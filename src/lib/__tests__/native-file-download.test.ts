import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  base64ToUint8Array,
  decryptPayloadClientSideAesGcm,
  encodeUtf8ToBase64,
  encryptPayloadClientSideAesGcm,
  triggerUniversalFileDownload,
} from '../native-file-download';

describe('Native Android File Download & Offline Backup Crypto Engine', () => {
  it('encodes and decodes UTF-8 Arabic backup JSON payloads without corruption', () => {
    const sample = JSON.stringify({
      companyNameAr: 'شركة النيل للتجارة والمبيعات',
      notes: 'نسخة احتياطية شاملة للأصناف والفواتير والعملاء',
      items: Array.from({ length: 100 }, (_, idx) => ({
        id: `prod-${idx}`,
        name: `منتج تجريبي رقم ${idx}`,
        barcode: `6281000${idx}`,
      })),
    });

    const b64 = encodeUtf8ToBase64(sample);
    const decodedBytes = base64ToUint8Array(b64);
    const decodedStr = new TextDecoder('utf-8').decode(decodedBytes);

    assert.equal(decodedStr, sample);
  });

  it('encrypts and decrypts backup payloads client-side with AES-256-GCM', async () => {
    const secretPayload = JSON.stringify({
      companyProfile: { id: 'comp-1', displayName: 'متجر الخرطوم' },
      products: [{ id: 'p1', name: 'سكر 10 كيلو', sellingPrice: 25000 }],
    });

    const encrypted = await encryptPayloadClientSideAesGcm(
      secretPayload,
      'StrongPass#2025'
    );
    assert.equal(encrypted.encryptionMeta.algorithm, 'AES-256-GCM');
    assert.ok(encrypted.payloadData.length > 10);

    const decryptedBytes = await decryptPayloadClientSideAesGcm(
      encrypted.payloadData,
      'StrongPass#2025',
      encrypted.encryptionMeta
    );
    const decryptedText = new TextDecoder('utf-8').decode(decryptedBytes);
    assert.equal(decryptedText, secretPayload);

    await assert.rejects(
      async () => {
        await decryptPayloadClientSideAesGcm(
          encrypted.payloadData,
          'WrongPassword',
          encrypted.encryptionMeta
        );
      },
      /Invalid backup encryption password/
    );
  });

  it('invokes AndroidNativeFileBridge.saveFileToDownloads automatically when running on Android APK', () => {
    let capturedArgs: { fileName: string; content: string; mimeType: string } | null =
      null;

    (globalThis as any).window = {
      AndroidNativeFileBridge: {
        saveFileToDownloads: (
          fileName: string,
          content: string,
          mimeType: string
        ) => {
          capturedArgs = { fileName, content, mimeType };
          return JSON.stringify({
            ok: true,
            fileName,
            savedPath: `Downloads/${fileName}`,
          });
        },
      },
    };

    try {
      const res = triggerUniversalFileDownload(
        '{"formatSignature":"DQNAMO_POS_BACKUP_V1"}',
        'nile-store-backup-2025-05-10.backup',
        'application/octet-stream'
      );

      assert.equal(res.ok, true);
      assert.equal(res.method, 'android_native');
      assert.equal(res.savedPath, 'Downloads/nile-store-backup-2025-05-10.backup');
      assert.ok(capturedArgs);
      assert.equal(
        (capturedArgs as any).fileName,
        'nile-store-backup-2025-05-10.backup'
      );
      assert.equal((capturedArgs as any).mimeType, 'application/octet-stream');
    } finally {
      delete (globalThis as any).window;
    }
  });
});
