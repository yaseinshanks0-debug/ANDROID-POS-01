/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UniversalDownloadResult {
  ok: boolean;
  fileName: string;
  savedPath: string;
  method: 'android_native' | 'browser_blob';
  error?: string;
}

interface AndroidNativeFileBridgeInterface {
  saveFileToDownloads?: (
    fileName: string,
    content: string,
    mimeType: string
  ) => string;
  shareFile?: (fileName: string, content: string, mimeType: string) => string;
}

function getAndroidFileBridge(): AndroidNativeFileBridgeInterface | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    AndroidNativeFileBridge?: AndroidNativeFileBridgeInterface;
  };
  return w.AndroidNativeFileBridge || null;
}

export function isAndroidNativeFileBridgeAvailable(): boolean {
  const bridge = getAndroidFileBridge();
  return Boolean(bridge && typeof bridge.saveFileToDownloads === 'function');
}

/**
 * Safely encodes a UTF-8 string to Base64 in chunks without hitting call stack limits
 * or deprecated `unescape()` issues on large Arabic datasets.
 */
export function encodeUtf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  return uint8ArrayToBase64(bytes);
}

export function uint8ArrayToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined' && typeof window === 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  const chunkSize = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const sub = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(sub));
  }
  return btoa(binary);
}

export function base64ToUint8Array(b64: string): Uint8Array {
  const cleanB64 = b64.trim();
  if (typeof Buffer !== 'undefined' && typeof window === 'undefined') {
    return new Uint8Array(Buffer.from(cleanB64, 'base64'));
  }
  const binaryStr = atob(cleanB64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.trim();
  const out = new Uint8Array(Math.floor(clean.length / 2));
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

/**
 * Client-side AES-256-GCM encryption using Web Crypto API (PBKDF2-SHA256)
 * for offline / Android APK encrypted backups when server is unavailable.
 */
export async function encryptPayloadClientSideAesGcm(
  jsonText: string,
  password: string
): Promise<{
  payloadData: string;
  encryptionMeta: {
    algorithm: 'AES-256-GCM';
    kdf: 'scrypt';
    saltHex: string;
    ivHex: string;
    authTagHex: string;
    kdfParams: { N: number; r: number; p: number; keyLen: number };
  };
}> {
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj || !cryptoObj.subtle) {
    throw new Error('Web Crypto API is not available on this device.');
  }

  const salt = cryptoObj.getRandomValues(new Uint8Array(16));
  const iv = cryptoObj.getRandomValues(new Uint8Array(12));
  const passBytes = new TextEncoder().encode(password);

  const keyMaterial = await cryptoObj.subtle.importKey(
    'raw',
    passBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const iterations = 100000;
  const aesKey = await cryptoObj.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const plainBytes = new TextEncoder().encode(jsonText);
  const encryptedBuffer = await cryptoObj.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    aesKey,
    plainBytes
  );

  const encryptedBytes = new Uint8Array(encryptedBuffer);
  // Web Crypto AES-GCM appends the 16-byte authentication tag at the end of ciphertext
  const ciphertextBytes = encryptedBytes.slice(0, encryptedBytes.length - 16);
  const authTagBytes = encryptedBytes.slice(encryptedBytes.length - 16);

  return {
    payloadData: uint8ArrayToBase64(ciphertextBytes),
    encryptionMeta: {
      algorithm: 'AES-256-GCM',
      kdf: 'scrypt',
      saltHex: bytesToHex(salt),
      ivHex: bytesToHex(iv),
      authTagHex: bytesToHex(authTagBytes),
      // Store PBKDF2 marker in N=100000, r=0, p=0 so client decrypt knows it's WebCrypto PBKDF2
      kdfParams: { N: iterations, r: 0, p: 0, keyLen: 32 },
    },
  };
}

/**
 * Client-side AES-256-GCM decryption using Web Crypto API for offline / Android APK.
 */
export async function decryptPayloadClientSideAesGcm(
  payloadDataB64: string,
  password: string,
  encryptionMeta: {
    saltHex: string;
    ivHex: string;
    authTagHex: string;
    kdfParams?: { N: number; r: number; p: number; keyLen: number };
  }
): Promise<Uint8Array> {
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj || !cryptoObj.subtle) {
    throw new Error('Web Crypto API is not available for decryption.');
  }

  const salt = hexToBytes(encryptionMeta.saltHex);
  const iv = hexToBytes(encryptionMeta.ivHex);
  const authTag = hexToBytes(encryptionMeta.authTagHex);
  const ciphertext = base64ToUint8Array(payloadDataB64);

  const combined = new Uint8Array(ciphertext.length + authTag.length);
  combined.set(ciphertext, 0);
  combined.set(authTag, ciphertext.length);

  const passBytes = new TextEncoder().encode(password);
  const keyMaterial = await cryptoObj.subtle.importKey(
    'raw',
    passBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const iterations = encryptionMeta.kdfParams?.N || 100000;
  const aesKey = await cryptoObj.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  try {
    const decryptedBuffer = await cryptoObj.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as unknown as BufferSource, tagLength: 128 },
      aesKey,
      combined as unknown as BufferSource
    );
    return new Uint8Array(decryptedBuffer);
  } catch {
    throw new Error(
      'Invalid backup encryption password or corrupted encrypted archive.'
    );
  }
}

/**
 * Universal file download helper that works automatically on both:
 * 1. Installed Capacitor Android APK (via `window.AndroidNativeFileBridge.saveFileToDownloads`,
 *    writing directly into Android's `Downloads` folder and displaying a native Toast).
 * 2. Web Browsers (via `Blob` + `<a download>` with a safe 30-second delayed `revokeObjectURL`
 *    so mobile browsers do not abort the download before it starts).
 */
export function triggerUniversalFileDownload(
  content: string,
  fileName: string,
  mimeType: string = 'application/octet-stream'
): UniversalDownloadResult {
  const safeFileName =
    (fileName || 'backup.backup').replace(/[\\/:*?"<>|]+/g, '_').trim() ||
    'backup.backup';

  // 1. Check Native Android Bridge first (installed APK)
  const androidBridge = getAndroidFileBridge();
  if (androidBridge && typeof androidBridge.saveFileToDownloads === 'function') {
    try {
      const effectiveMime = safeFileName.endsWith('.backup')
        ? 'application/octet-stream'
        : mimeType;
      const rawResponse = androidBridge.saveFileToDownloads(
        safeFileName,
        content,
        effectiveMime
      );
      if (rawResponse) {
        try {
          const parsed = JSON.parse(rawResponse);
          if (parsed && parsed.ok) {
            return {
              ok: true,
              fileName: parsed.fileName || safeFileName,
              savedPath: parsed.savedPath || `Downloads/${safeFileName}`,
              method: 'android_native',
            };
          }
        } catch {
          return {
            ok: true,
            fileName: safeFileName,
            savedPath: `Downloads/${safeFileName}`,
            method: 'android_native',
          };
        }
      }
    } catch (err) {
      console.warn('AndroidNativeFileBridge.saveFileToDownloads fallback:', err);
    }
  }

  // 2. Standard Browser / Mobile WebView Blob Download with delayed URL revocation
  if (typeof document !== 'undefined' && typeof Blob !== 'undefined') {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = safeFileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      // Delay cleanup so mobile browsers have time to initiate the download stream
      setTimeout(() => {
        try {
          if (link.parentNode) {
            document.body.removeChild(link);
          }
          URL.revokeObjectURL(url);
        } catch {}
      }, 30000);

      return {
        ok: true,
        fileName: safeFileName,
        savedPath: safeFileName,
        method: 'browser_blob',
      };
    } catch (err: any) {
      return {
        ok: false,
        fileName: safeFileName,
        savedPath: safeFileName,
        method: 'browser_blob',
        error: err?.message || 'Download failed',
      };
    }
  }

  return {
    ok: false,
    fileName: safeFileName,
    savedPath: safeFileName,
    method: 'browser_blob',
    error: 'Download environment unavailable',
  };
}

/**
 * Opens the native Android Share / Save sheet (Google Drive, WhatsApp, Files, etc.)
 * or Web Share API fallback.
 */
export async function triggerUniversalFileShare(
  content: string,
  fileName: string,
  mimeType: string = 'application/octet-stream'
): Promise<boolean> {
  const safeFileName =
    (fileName || 'backup.backup').replace(/[\\/:*?"<>|]+/g, '_').trim() ||
    'backup.backup';

  const androidBridge = getAndroidFileBridge();
  if (androidBridge && typeof androidBridge.shareFile === 'function') {
    try {
      const res = androidBridge.shareFile(safeFileName, content, mimeType);
      const parsed = JSON.parse(res || '{}');
      if (parsed.ok) return true;
    } catch {}
  }

  if (
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof File !== 'undefined'
  ) {
    try {
      const file = new File([content], safeFileName, { type: mimeType });
      if (!navigator.canShare || navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: safeFileName,
          files: [file],
        });
        return true;
      }
    } catch {}
  }

  const dl = triggerUniversalFileDownload(content, safeFileName, mimeType);
  return dl.ok;
}
