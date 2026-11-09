/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Request, Response, NextFunction } from 'express';
import { promisify } from 'node:util';
import zlib from 'node:zlib';

const brotliCompressAsync = promisify(zlib.brotliCompress);
const gzipAsync = promisify(zlib.gzip);

export const MIN_COMPRESSION_BYTES = 1024;

export interface AsyncCompressionResult {
  buffer: Buffer;
  encoding: 'br' | 'gzip' | null;
}

/**
 * Compresses a JSON string asynchronously on the libuv worker pool without blocking
 * the Node.js Event Loop. Payloads <= 1024 bytes or without 'br'/'gzip' in Accept-Encoding
 * are returned uncompressed.
 */
export async function compressJsonPayloadAsync(
  jsonString: string,
  acceptEncoding: string
): Promise<AsyncCompressionResult> {
  const rawBuffer = Buffer.from(jsonString, 'utf-8');
  if (rawBuffer.byteLength <= MIN_COMPRESSION_BYTES) {
    return { buffer: rawBuffer, encoding: null };
  }

  const normalizedAccept = String(acceptEncoding || '').toLowerCase();
  if (normalizedAccept.includes('br')) {
    const compressed = await brotliCompressAsync(rawBuffer, {
      params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 },
    });
    return { buffer: compressed, encoding: 'br' };
  }

  if (normalizedAccept.includes('gzip')) {
    const compressed = await gzipAsync(rawBuffer, { level: 6 });
    return { buffer: compressed, encoding: 'gzip' };
  }

  return { buffer: rawBuffer, encoding: null };
}

/**
 * Express middleware that attaches W3C `Server-Timing` telemetry and compresses
 * JSON responses larger than 1 KB asynchronously using Brotli or Gzip.
 */
export function nonBlockingJsonCompressionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startHr = process.hrtime.bigint();
  const originalJson = res.json.bind(res);

  res.json = function (body: any): Response {
    const durationMs = Number(process.hrtime.bigint() - startHr) / 1_000_000;
    if (!res.headersSent) {
      res.setHeader('Server-Timing', `app;dur=${durationMs.toFixed(2)}`);
    }

    const acceptEncoding = String(req.headers['accept-encoding'] || '');
    let jsonString: string;
    try {
      jsonString = JSON.stringify(body);
    } catch {
      return originalJson(body);
    }

    if (
      !res.headersSent &&
      typeof jsonString === 'string' &&
      Buffer.byteLength(jsonString, 'utf-8') > MIN_COMPRESSION_BYTES &&
      (acceptEncoding.includes('br') || acceptEncoding.includes('gzip'))
    ) {
      compressJsonPayloadAsync(jsonString, acceptEncoding)
        .then(({ buffer, encoding }) => {
          if (res.writableEnded) return;
          if (!res.headersSent && encoding) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Vary', 'Accept-Encoding');
            res.setHeader('Content-Encoding', encoding);
            res.setHeader('Content-Length', String(buffer.length));
            res.end(buffer);
            return;
          }
          if (!res.headersSent) {
            originalJson(body);
          }
        })
        .catch(() => {
          if (!res.headersSent && !res.writableEnded) {
            originalJson(body);
          }
        });

      return res;
    }

    return originalJson(body);
  };

  next();
}
