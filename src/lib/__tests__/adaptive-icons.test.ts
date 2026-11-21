/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const RES_DIR = path.join(ROOT, 'android/app/src/main/res');
const PUBLIC_DIR = path.join(ROOT, 'public');

const SAFE_ZONE_CENTER = 54;
const SAFE_ZONE_RADIUS = 33; // Material Design 3 adaptive icon 66dp diameter safe zone inside 108dp viewport

function readPngDimensions(filePath: string): { width: number; height: number } {
  const buf = fs.readFileSync(filePath);
  // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
  assert.equal(buf[0], 0x89, `${filePath} must be a valid PNG`);
  assert.equal(buf[1], 0x50, `${filePath} must be a valid PNG`);
  assert.equal(buf[2], 0x4e, `${filePath} must be a valid PNG`);
  assert.equal(buf[3], 0x47, `${filePath} must be a valid PNG`);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

function extractCoordinatePairs(xml: string): Array<[number, number]> {
  const pairs: Array<[number, number]> = [];
  const pathDataRegex = /android:pathData="([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = pathDataRegex.exec(xml)) !== null) {
    const d = match[1];
    // Extract explicit absolute M/L/A endpoint x,y coordinate pairs
    const tokens = d.match(/[ML]\s*([\d.]+)\s*,\s*([\d.]+)/g) ?? [];
    for (const token of tokens) {
      const m = /[ML]\s*([\d.]+)\s*,\s*([\d.]+)/.exec(token);
      if (m) {
        pairs.push([Number(m[1]), Number(m[2])]);
      }
    }
  }
  return pairs;
}

describe('Dqnamo POS Material Design 3 Adaptive Android Icons', () => {
  it('defines adaptive-icon XMLs with background, foreground, and Material You monochrome layers', () => {
    for (const file of ['ic_launcher.xml', 'ic_launcher_round.xml']) {
      const fullPath = path.join(RES_DIR, 'mipmap-anydpi-v26', file);
      assert.ok(fs.existsSync(fullPath), `Missing ${file}`);
      const xml = fs.readFileSync(fullPath, 'utf8');
      assert.match(xml, /<adaptive-icon\b/);
      assert.match(xml, /<background\s+android:drawable="@drawable\/ic_launcher_background"\s*\/>/);
      assert.match(xml, /<foreground\s+android:drawable="@drawable\/ic_launcher_foreground"\s*\/>/);
      assert.match(xml, /<monochrome\s+android:drawable="@drawable\/ic_launcher_monochrome"\s*\/>/);
    }
  });

  it('provides Light Mode, Dark Mode (night), API 24+ gradient, and Monochrome vector drawables', () => {
    const requiredFiles = [
      'values/ic_launcher_background.xml',
      'values-night/ic_launcher_background.xml',
      'drawable/ic_launcher_background.xml',
      'drawable-v24/ic_launcher_background.xml',
      'drawable-night/ic_launcher_background.xml',
      'drawable-night-v24/ic_launcher_background.xml',
      'drawable/ic_launcher_foreground.xml',
      'drawable-v24/ic_launcher_foreground.xml',
      'drawable-night/ic_launcher_foreground.xml',
      'drawable-night-v24/ic_launcher_foreground.xml',
      'drawable/ic_launcher_monochrome.xml',
    ];

    for (const rel of requiredFiles) {
      const fullPath = path.join(RES_DIR, rel);
      assert.ok(fs.existsSync(fullPath), `Missing Android resource: ${rel}`);
      const content = fs.readFileSync(fullPath, 'utf8');
      assert.ok(content.includes('<?xml version="1.0"'), `${rel} must start with XML declaration`);
      if (rel.startsWith('drawable')) {
        assert.match(content, /android:viewportWidth="108"/, `${rel} must use 108dp viewportWidth`);
        assert.match(content, /android:viewportHeight="108"/, `${rel} must use 108dp viewportHeight`);
      }
      // Base drawable/ and drawable-night/ must remain API <24 safe (no aapt:attr gradient)
      if (rel === 'drawable/ic_launcher_background.xml' || rel === 'drawable-night/ic_launcher_background.xml' ||
          rel === 'drawable/ic_launcher_foreground.xml' || rel === 'drawable-night/ic_launcher_foreground.xml') {
        assert.ok(!content.includes('aapt:attr'), `${rel} must not use API 24+ aapt:attr`);
      }
    }
  });

  it('keeps all foreground and monochrome emblem vertices strictly inside the 66dp Material safe zone', () => {
    const foregroundFiles = [
      'drawable/ic_launcher_foreground.xml',
      'drawable-v24/ic_launcher_foreground.xml',
      'drawable-night/ic_launcher_foreground.xml',
      'drawable-night-v24/ic_launcher_foreground.xml',
      'drawable/ic_launcher_monochrome.xml',
    ];

    for (const rel of foregroundFiles) {
      const xml = fs.readFileSync(path.join(RES_DIR, rel), 'utf8');
      const coords = extractCoordinatePairs(xml);
      assert.ok(coords.length > 0, `Expected path vertices in ${rel}`);
      for (const [x, y] of coords) {
        const dist = Math.hypot(x - SAFE_ZONE_CENTER, y - SAFE_ZONE_CENTER);
        assert.ok(
          dist <= SAFE_ZONE_RADIUS,
          `Vertex (${x}, ${y}) in ${rel} exceeds 66dp safe zone radius (${dist.toFixed(2)} > ${SAFE_ZONE_RADIUS})`
        );
      }
    }
  });

  it('ships exact pixel-sized Light and Dark mipmap PNGs across all 5 Android densities plus Play Store 512px', () => {
    const densities: ReadonlyArray<{ name: string; legacy: number; foreground: number }> = [
      { name: 'mdpi', legacy: 48, foreground: 108 },
      { name: 'hdpi', legacy: 72, foreground: 162 },
      { name: 'xhdpi', legacy: 96, foreground: 216 },
      { name: 'xxhdpi', legacy: 144, foreground: 324 },
      { name: 'xxxhdpi', legacy: 192, foreground: 432 },
    ];

    for (const prefix of ['mipmap', 'mipmap-night']) {
      for (const d of densities) {
        const dir = path.join(RES_DIR, `${prefix}-${d.name}`);
        for (const legacyFile of ['ic_launcher.png', 'ic_launcher_round.png']) {
          const dims = readPngDimensions(path.join(dir, legacyFile));
          assert.deepEqual(dims, { width: d.legacy, height: d.legacy }, `${prefix}-${d.name}/${legacyFile}`);
        }
        const fgDims = readPngDimensions(path.join(dir, 'ic_launcher_foreground.png'));
        assert.deepEqual(
          fgDims,
          { width: d.foreground, height: d.foreground },
          `${prefix}-${d.name}/ic_launcher_foreground.png`
        );
      }
    }

    const playStoreDims = readPngDimensions(path.join(ROOT, 'android/app/src/main/ic_launcher-playstore.png'));
    assert.deepEqual(playStoreDims, { width: 512, height: 512 });
  });

  it('references only existing icon assets in public/manifest.json', () => {
    const manifestPath = path.join(PUBLIC_DIR, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as {
      icons?: Array<{ src: string; sizes?: string; purpose?: string }>;
    };
    assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 4);
    for (const icon of manifest.icons) {
      const relSrc = icon.src.replace(/^\//, '');
      const fullPath = path.join(PUBLIC_DIR, relSrc);
      assert.ok(fs.existsSync(fullPath), `Manifest icon missing on disk: ${icon.src}`);
    }
  });
});
