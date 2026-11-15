// src/lib/native-file-download.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
function getAndroidFileBridge() {
	if (typeof window === "undefined") return null;
	return window.AndroidNativeFileBridge || null;
}
/**
* Safely encodes a UTF-8 string to Base64 in chunks without hitting call stack limits
* or deprecated `unescape()` issues on large Arabic datasets.
*/
function encodeUtf8ToBase64(text) {
	return uint8ArrayToBase64(new TextEncoder().encode(text));
}
function uint8ArrayToBase64(bytes) {
	if (typeof Buffer !== "undefined" && typeof window === "undefined") return Buffer.from(bytes).toString("base64");
	const chunkSize = 32768;
	let binary = "";
	for (let i = 0; i < bytes.length; i += chunkSize) {
		const sub = bytes.subarray(i, i + chunkSize);
		binary += String.fromCharCode.apply(null, Array.from(sub));
	}
	return btoa(binary);
}
function base64ToUint8Array(b64) {
	const cleanB64 = b64.trim();
	if (typeof Buffer !== "undefined" && typeof window === "undefined") return new Uint8Array(Buffer.from(cleanB64, "base64"));
	const binaryStr = atob(cleanB64);
	const bytes = new Uint8Array(binaryStr.length);
	for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
	return bytes;
}
function bytesToHex(bytes) {
	return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function hexToBytes(hex) {
	const clean = hex.trim();
	const out = new Uint8Array(Math.floor(clean.length / 2));
	for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
	return out;
}
/**
* Client-side AES-256-GCM encryption using Web Crypto API (PBKDF2-SHA256)
* for offline / Android APK encrypted backups when server is unavailable.
*/
async function encryptPayloadClientSideAesGcm(jsonText, password) {
	const cryptoObj = globalThis.crypto;
	if (!cryptoObj || !cryptoObj.subtle) throw new Error("Web Crypto API is not available on this device.");
	const salt = cryptoObj.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	const iv = cryptoObj.getRandomValues(/* @__PURE__ */ new Uint8Array(12));
	const passBytes = new TextEncoder().encode(password);
	const keyMaterial = await cryptoObj.subtle.importKey("raw", passBytes, { name: "PBKDF2" }, false, ["deriveKey"]);
	const iterations = 1e5;
	const aesKey = await cryptoObj.subtle.deriveKey({
		name: "PBKDF2",
		salt,
		iterations,
		hash: "SHA-256"
	}, keyMaterial, {
		name: "AES-GCM",
		length: 256
	}, false, ["encrypt"]);
	const plainBytes = new TextEncoder().encode(jsonText);
	const encryptedBuffer = await cryptoObj.subtle.encrypt({
		name: "AES-GCM",
		iv,
		tagLength: 128
	}, aesKey, plainBytes);
	const encryptedBytes = new Uint8Array(encryptedBuffer);
	const ciphertextBytes = encryptedBytes.slice(0, encryptedBytes.length - 16);
	const authTagBytes = encryptedBytes.slice(encryptedBytes.length - 16);
	return {
		payloadData: uint8ArrayToBase64(ciphertextBytes),
		encryptionMeta: {
			algorithm: "AES-256-GCM",
			kdf: "scrypt",
			saltHex: bytesToHex(salt),
			ivHex: bytesToHex(iv),
			authTagHex: bytesToHex(authTagBytes),
			kdfParams: {
				N: iterations,
				r: 0,
				p: 0,
				keyLen: 32
			}
		}
	};
}
/**
* Client-side AES-256-GCM decryption using Web Crypto API for offline / Android APK.
*/
async function decryptPayloadClientSideAesGcm(payloadDataB64, password, encryptionMeta) {
	const cryptoObj = globalThis.crypto;
	if (!cryptoObj || !cryptoObj.subtle) throw new Error("Web Crypto API is not available for decryption.");
	const salt = hexToBytes(encryptionMeta.saltHex);
	const iv = hexToBytes(encryptionMeta.ivHex);
	const authTag = hexToBytes(encryptionMeta.authTagHex);
	const ciphertext = base64ToUint8Array(payloadDataB64);
	const combined = new Uint8Array(ciphertext.length + authTag.length);
	combined.set(ciphertext, 0);
	combined.set(authTag, ciphertext.length);
	const passBytes = new TextEncoder().encode(password);
	const keyMaterial = await cryptoObj.subtle.importKey("raw", passBytes, { name: "PBKDF2" }, false, ["deriveKey"]);
	const iterations = encryptionMeta.kdfParams?.N || 1e5;
	const aesKey = await cryptoObj.subtle.deriveKey({
		name: "PBKDF2",
		salt,
		iterations,
		hash: "SHA-256"
	}, keyMaterial, {
		name: "AES-GCM",
		length: 256
	}, false, ["decrypt"]);
	try {
		const decryptedBuffer = await cryptoObj.subtle.decrypt({
			name: "AES-GCM",
			iv,
			tagLength: 128
		}, aesKey, combined);
		return new Uint8Array(decryptedBuffer);
	} catch {
		throw new Error("Invalid backup encryption password or corrupted encrypted archive.");
	}
}
/**
* Universal file download helper that works automatically on both:
* 1. Installed Capacitor Android APK (via `window.AndroidNativeFileBridge.saveFileToDownloads`,
*    writing directly into Android's `Downloads` folder and displaying a native Toast).
* 2. Web Browsers (via `Blob` + `<a download>` with a safe 30-second delayed `revokeObjectURL`
*    so mobile browsers do not abort the download before it starts).
*/
function triggerUniversalFileDownload(content, fileName, mimeType = "application/octet-stream") {
	const safeFileName = (fileName || "backup.backup").replace(/[\\/:*?"<>|]+/g, "_").trim() || "backup.backup";
	const androidBridge = getAndroidFileBridge();
	if (androidBridge && typeof androidBridge.saveFileToDownloads === "function") try {
		const effectiveMime = safeFileName.endsWith(".backup") ? "application/octet-stream" : mimeType;
		const rawResponse = androidBridge.saveFileToDownloads(safeFileName, content, effectiveMime);
		if (rawResponse) try {
			const parsed = JSON.parse(rawResponse);
			if (parsed && parsed.ok) return {
				ok: true,
				fileName: parsed.fileName || safeFileName,
				savedPath: parsed.savedPath || `Downloads/${safeFileName}`,
				method: "android_native"
			};
		} catch {
			return {
				ok: true,
				fileName: safeFileName,
				savedPath: `Downloads/${safeFileName}`,
				method: "android_native"
			};
		}
	} catch (err) {
		console.warn("AndroidNativeFileBridge.saveFileToDownloads fallback:", err);
	}
	if (typeof document !== "undefined" && typeof Blob !== "undefined") try {
		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = safeFileName;
		link.style.display = "none";
		document.body.appendChild(link);
		link.click();
		setTimeout(() => {
			try {
				if (link.parentNode) document.body.removeChild(link);
				URL.revokeObjectURL(url);
			} catch {}
		}, 3e4);
		return {
			ok: true,
			fileName: safeFileName,
			savedPath: safeFileName,
			method: "browser_blob"
		};
	} catch (err) {
		return {
			ok: false,
			fileName: safeFileName,
			savedPath: safeFileName,
			method: "browser_blob",
			error: err?.message || "Download failed"
		};
	}
	return {
		ok: false,
		fileName: safeFileName,
		savedPath: safeFileName,
		method: "browser_blob",
		error: "Download environment unavailable"
	};
}
/**
* Opens the native Android Share / Save sheet (Google Drive, WhatsApp, Files, etc.)
* or Web Share API fallback.
*/
async function triggerUniversalFileShare(content, fileName, mimeType = "application/octet-stream") {
	const safeFileName = (fileName || "backup.backup").replace(/[\\/:*?"<>|]+/g, "_").trim() || "backup.backup";
	const androidBridge = getAndroidFileBridge();
	if (androidBridge && typeof androidBridge.shareFile === "function") try {
		const res = androidBridge.shareFile(safeFileName, content, mimeType);
		if (JSON.parse(res || "{}").ok) return true;
	} catch {}
	if (typeof navigator !== "undefined" && typeof navigator.share === "function" && typeof File !== "undefined") try {
		const file = new File([content], safeFileName, { type: mimeType });
		if (!navigator.canShare || navigator.canShare({ files: [file] })) {
			await navigator.share({
				title: safeFileName,
				files: [file]
			});
			return true;
		}
	} catch {}
	return triggerUniversalFileDownload(content, safeFileName, mimeType).ok;
}
export { triggerUniversalFileDownload as a, encryptPayloadClientSideAesGcm as i, decryptPayloadClientSideAesGcm as n, triggerUniversalFileShare as o, encodeUtf8ToBase64 as r, base64ToUint8Array as t };
