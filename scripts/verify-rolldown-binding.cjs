#!/usr/bin/env node
/**
 * Dqnamo POS — Rolldown Native Binding Verification & Auto-Repair Script
 * Protects Windows (win32-x64) and Linux (linux-x64) builds against npm CLI bug #4828
 * where platform-specific optionalDependencies (@rolldown/binding-*) may be omitted.
 */

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

function getExpectedRolldownBindingPackage() {
  const platform = process.platform;
  const arch = process.arch;

  if (platform === 'win32' && arch === 'x64') {
    return '@rolldown/binding-win32-x64-msvc';
  }
  if (platform === 'win32' && arch === 'arm64') {
    return '@rolldown/binding-win32-arm64-msvc';
  }
  if (platform === 'linux' && arch === 'x64') {
    return '@rolldown/binding-linux-x64-gnu';
  }
  if (platform === 'linux' && arch === 'arm64') {
    return '@rolldown/binding-linux-arm64-gnu';
  }
  if (platform === 'darwin' && arch === 'arm64') {
    return '@rolldown/binding-darwin-arm64';
  }
  if (platform === 'darwin' && arch === 'x64') {
    return '@rolldown/binding-darwin-x64';
  }
  return null;
}

function getRolldownVersion(rootDir) {
  const rolldownPkgPath = path.join(rootDir, 'node_modules', 'rolldown', 'package.json');
  if (!fs.existsSync(rolldownPkgPath)) {
    throw new Error('node_modules/rolldown/package.json not found. Run npm install first.');
  }
  const pkg = JSON.parse(fs.readFileSync(rolldownPkgPath, 'utf-8'));
  return pkg.version;
}

function isBindingInstalled(rootDir, pkgName) {
  const pkgDir = path.join(rootDir, 'node_modules', ...pkgName.split('/'));
  const pkgJson = path.join(pkgDir, 'package.json');
  if (!fs.existsSync(pkgJson)) return false;

  const entries = fs.readdirSync(pkgDir);
  return entries.some((file) => file.endsWith('.node'));
}

function main() {
  const rootDir = process.cwd();
  const expectedPkg = getExpectedRolldownBindingPackage();
  const rolldownVersion = getRolldownVersion(rootDir);

  console.log(
    `[Rolldown Verify] Platform: ${process.platform}-${process.arch} | Rolldown Version: ${rolldownVersion} | Expected Binding: ${expectedPkg || 'wasm-fallback'}`
  );

  if (!expectedPkg) {
    console.log('[Rolldown Verify] PASS — Non-standard platform, skipping native check.');
    return;
  }

  if (isBindingInstalled(rootDir, expectedPkg)) {
    console.log(`[Rolldown Verify] PASS — Native binding present: ${expectedPkg}@${rolldownVersion}`);
    return;
  }

  console.warn(
    `[Rolldown Verify] WARNING — Missing ${expectedPkg}@${rolldownVersion} (npm optional dependency bug #4828). Repairing via npm pack...`
  );

  const targetDir = path.join(rootDir, 'node_modules', ...expectedPkg.split('/'));
  const tmpDir = path.join(rootDir, '.tmp-rolldown-binding');
  fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    const tgzName = execSync(`npm pack ${expectedPkg}@${rolldownVersion}`, {
      cwd: tmpDir,
      encoding: 'utf-8',
    }).trim();
    const tgzPath = path.join(tmpDir, tgzName);
    fs.rmSync(targetDir, { recursive: true, force: true });
    fs.mkdirSync(targetDir, { recursive: true });
    execSync(`tar -xzf "${tgzPath}" --strip-components=1 -C "${targetDir}"`);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  if (!isBindingInstalled(rootDir, expectedPkg)) {
    console.error(`[Rolldown Verify] FAIL — Could not restore ${expectedPkg}@${rolldownVersion}`);
    process.exit(1);
  }

  console.log(`[Rolldown Verify] PASS — Successfully restored ${expectedPkg}@${rolldownVersion}`);
}

main();
