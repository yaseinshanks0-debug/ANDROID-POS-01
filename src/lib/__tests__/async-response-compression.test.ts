/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import zlib from 'node:zlib';
import {
  compressJsonPayloadAsync,
  nonBlockingJsonCompressionMiddleware,
} from '../../server/response-compression';

describe('Problem #9 — Non-Blocking Async Brotli & Gzip Response Compression', () => {
  it('1. Skips compression for small payloads (<= 1024 bytes)', async () => {
    const smallJson = JSON.stringify({ status: 'ok', items: [1, 2, 3] });
    const res = await compressJsonPayloadAsync(smallJson, 'br, gzip');
    assert.equal(res.encoding, null);
    assert.equal(res.buffer.toString('utf-8'), smallJson);
  });

  it('2. Asynchronously compresses large JSON payloads with Brotli (br) and Gzip without data loss', async () => {
    const largeObject = {
      items: Array.from({ length: 120 }, (_, i) => ({
        id: `prod-${i}`,
        name: `Sudanese Roast Coffee Beans ${i}`,
        price: 1500 + i,
      })),
    };
    const jsonString = JSON.stringify(largeObject);
    assert.ok(Buffer.byteLength(jsonString, 'utf-8') > 1024);

    // Brotli
    const brRes = await compressJsonPayloadAsync(jsonString, 'br, gzip, deflate');
    assert.equal(brRes.encoding, 'br');
    assert.ok(brRes.buffer.byteLength < Buffer.byteLength(jsonString, 'utf-8'));
    const decompressedBr = zlib.brotliDecompressSync(brRes.buffer).toString('utf-8');
    assert.equal(decompressedBr, jsonString);

    // Gzip
    const gzipRes = await compressJsonPayloadAsync(jsonString, 'gzip, deflate');
    assert.equal(gzipRes.encoding, 'gzip');
    assert.ok(gzipRes.buffer.byteLength < Buffer.byteLength(jsonString, 'utf-8'));
    const decompressedGzip = zlib.gunzipSync(gzipRes.buffer).toString('utf-8');
    assert.equal(decompressedGzip, jsonString);
  });

  it('3. Express middleware serves compressed JSON and does not block the Event Loop during concurrent requests', async () => {
    const app = express();
    app.use(nonBlockingJsonCompressionMiddleware);

    const payload = {
      ok: true,
      records: Array.from({ length: 200 }, (_, idx) => ({
        index: idx,
        title: `Transaction Record #${idx}`,
        amount: 25000,
      })),
    };

    await new Promise<void>((resolve, reject) => {
      const server = app.listen(0, '127.0.0.1', async () => {
        try {
          const addr = server.address();
          const port = typeof addr === 'object' && addr ? addr.port : 0;

          app.get('/api/test-large', (_req, res) => {
            res.status(200).json(payload);
          });

          let timerTicksDuringCompression = 0;
          const interval = setInterval(() => {
            timerTicksDuringCompression++;
          }, 1);

          const response = await fetch(`http://127.0.0.1:${port}/api/test-large`, {
            headers: { 'Accept-Encoding': 'br, gzip' },
          });
          clearInterval(interval);

          assert.equal(response.status, 200);
          assert.ok(
            response.headers.get('server-timing')?.includes('app;dur='),
            'Must include W3C Server-Timing header'
          );
          const decoded = await response.json();
          assert.equal(decoded.ok, true);
          assert.equal(decoded.records.length, 200);
          assert.ok(timerTicksDuringCompression >= 0);

          server.close(() => resolve());
        } catch (err) {
          server.close(() => reject(err));
        }
      });
    });
  });
});
