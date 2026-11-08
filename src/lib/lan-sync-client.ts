/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LanDevicePlatform = 'android' | 'windows' | 'web';

export interface LanConnectedDeviceInfo {
  deviceId: string;
  deviceName: string;
  platform: LanDevicePlatform;
  companyId: string;
  ipAddress: string;
  connectedAt: string;
  lastSeenAt: string;
  userName?: string;
}

export interface LanSyncEventRecord {
  id: string;
  timestamp: string;
  deviceId: string;
  deviceName: string;
  platform: LanDevicePlatform;
  companyId: string;
  operationType: string;
  summaryAr: string;
  summaryEn: string;
  revision: number;
}

export interface LanNetworkAddressItem {
  ip: string;
  interfaceName: string;
  url: string;
  isHotspotOrWifiLikely: boolean;
}

export interface LanSyncConfig {
  enabled: boolean;
  /** Empty string ('') means same-origin host (e.g., Windows Laptop hosting the server) */
  remoteHostUrl: string;
  hostUrl: string;
  deviceId: string;
  deviceName: string;
  platform: LanDevicePlatform;
  autoSyncOnEveryAction: boolean;
}

export const LAN_SYNC_CONFIG_STORAGE_KEY = 'dqnamo_lan_sync_config_v1';
export const LAN_SYNC_STATUS_EVENT = 'dqnamo:lan-sync-status-changed';
export const LAN_SYNC_OPEN_MODAL_EVENT = 'dqnamo:open-lan-sync-modal';

export function detectClientPlatform(): LanDevicePlatform {
  if (typeof window === 'undefined') return 'web';
  const w = window as any;
  if (w.AndroidNativeFileBridge) return 'android';
  if (w.Capacitor && typeof w.Capacitor.getPlatform === 'function') {
    const p = w.Capacitor.getPlatform();
    if (p === 'android') return 'android';
  }
  const ua = (navigator?.userAgent || '').toLowerCase();
  if (ua.includes('android')) return 'android';
  if (ua.includes('windows') || ua.includes('win64') || ua.includes('win32')) {
    return 'windows';
  }
  return 'web';
}

export function isStandaloneCapacitorApk(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as any;
  if (w.AndroidNativeFileBridge) return true;
  if (w.Capacitor && typeof w.Capacitor.isNativePlatform === 'function') {
    return Boolean(w.Capacitor.isNativePlatform());
  }
  return (
    window.location.protocol === 'capacitor:' ||
    (window.location.hostname === 'localhost' &&
      detectClientPlatform() === 'android')
  );
}

export function normalizeLanHostUrl(rawInput: string): string {
  let cleaned = (rawInput || '').trim();
  if (!cleaned) return '';

  if (cleaned.startsWith('{')) {
    try {
      const parsedJson = JSON.parse(cleaned);
      cleaned = String(
        parsedJson.hostUrl || parsedJson.remoteHostUrl || parsedJson.url || ''
      ).trim();
    } catch {}
  }

  // Support scanned barcode prefix e.g. DQSYNC|192.168.1.15:3000
  if (cleaned.toUpperCase().startsWith('DQSYNC|')) {
    cleaned = cleaned.slice(7).trim();
  }

  // Remove trailing slashes and /api/... suffixes if user pasted full URL
  cleaned = cleaned.replace(/\/api\/lan-sync.*$/i, '').replace(/\/+$/, '');

  if (!cleaned) return '';

  if (!/^https?:\/\//i.test(cleaned)) {
    // If user typed just IP like 192.168.1.15 without port, default to :3000
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(cleaned)) {
      cleaned = `http://${cleaned}:3000`;
    } else if (/^[a-zA-Z0-9.-]+:\d+$/.test(cleaned)) {
      cleaned = `http://${cleaned}`;
    } else {
      cleaned = `http://${cleaned}:3000`;
    }
  } else {
    // If http://192.168.1.15 without port, add :3000
    try {
      const parsed = new URL(cleaned);
      if (
        !parsed.port &&
        parsed.protocol === 'http:' &&
        /^\d{1,3}(\.\d{1,3}){3}$/.test(parsed.hostname)
      ) {
        parsed.port = '3000';
        cleaned = parsed.origin;
      } else {
        cleaned = parsed.origin;
      }
    } catch {}
  }

  return cleaned.replace(/\/+$/, '');
}

export function loadLanSyncConfig(): LanSyncConfig {
  const platform = detectClientPlatform();
  const isApk = isStandaloneCapacitorApk();
  const defaultDeviceId = `${platform}-${Math.random().toString(36).slice(2, 8)}`;
  const defaultDeviceName =
    platform === 'android'
      ? 'جهاز الأندرويد (Android POS)'
      : platform === 'windows'
      ? 'كمبيوتر الويندوز (Windows POS)'
      : 'نقطة بيع المتصفح (Web POS)';

  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(LAN_SYNC_CONFIG_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const normalizedHost = normalizeLanHostUrl(
          parsed.hostUrl || parsed.remoteHostUrl || ''
        );
        return {
          enabled: parsed.enabled !== undefined ? Boolean(parsed.enabled) : !isApk,
          remoteHostUrl: normalizedHost,
          hostUrl: normalizedHost,
          deviceId: parsed.deviceId || defaultDeviceId,
          deviceName: parsed.deviceName || defaultDeviceName,
          platform: parsed.platform || platform,
          autoSyncOnEveryAction:
            parsed.autoSyncOnEveryAction !== undefined
              ? Boolean(parsed.autoSyncOnEveryAction)
              : true,
        };
      }
    }
  } catch {}

  const initial: LanSyncConfig = {
    enabled: !isApk,
    remoteHostUrl: '',
    hostUrl: '',
    deviceId: defaultDeviceId,
    deviceName: defaultDeviceName,
    platform,
    autoSyncOnEveryAction: true,
  };

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LAN_SYNC_CONFIG_STORAGE_KEY, JSON.stringify(initial));
    }
  } catch {}

  return initial;
}

export function saveLanSyncConfig(
  updates: Partial<LanSyncConfig>
): LanSyncConfig {
  const current = loadLanSyncConfig();
  const rawHostUpdate =
    updates.hostUrl !== undefined
      ? updates.hostUrl
      : updates.remoteHostUrl !== undefined
      ? updates.remoteHostUrl
      : current.hostUrl || current.remoteHostUrl;
  const normalizedHost = normalizeLanHostUrl(rawHostUpdate);

  const next: LanSyncConfig = {
    ...current,
    ...updates,
    remoteHostUrl: normalizedHost,
    hostUrl: normalizedHost,
  };
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LAN_SYNC_CONFIG_STORAGE_KEY, JSON.stringify(next));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(LAN_SYNC_STATUS_EVENT, { detail: next })
      );
    }
  } catch {}
  return next;
}

export function resolveEffectiveLanBaseUrl(config: LanSyncConfig): string | null {
  if (!config.enabled) return null;
  const host = config.hostUrl || config.remoteHostUrl;
  if (host) {
    return host;
  }
  if (!isStandaloneCapacitorApk()) {
    return '';
  }
  return null;
}

// ============================================================================
// CODE-128B BARCODE GENERATOR (For 1-Tap Android Camera Pairing with Windows IP)
// ============================================================================

const CODE128_PATTERNS = [
  '11011001100', '11001101100', '11001100110', '10010011000', '10010001100',
  '10001001100', '10011001000', '10011000100', '10001100100', '11001001000',
  '11001000100', '11000100100', '10110011100', '10011011100', '10011001110',
  '10111001100', '10011101100', '10011100110', '11001110010', '11001011100',
  '11001001110', '11011100100', '11001110100', '11101101110', '11101001100',
  '11100101100', '11100100110', '11101100100', '11100110100', '11100110010',
  '11011011000', '11011000110', '11000110110', '10100011000', '10001011000',
  '10001000110', '10110001000', '10001101000', '10001100010', '11010001000',
  '11000101000', '11000100010', '10110111000', '10110001110', '10001101110',
  '10111011000', '10111000110', '10001110110', '11101110110', '11010001110',
  '11000101110', '11011101000', '11011100010', '11011101110', '11101011000',
  '11101000110', '11100010110', '11101101000', '11101100010', '11100011010',
  '11101111010', '11001000010', '11110001010', '10100110000', '10100001100',
  '10010110000', '10010000110', '10000101100', '10000100110', '10110010000',
  '10110000100', '10011010000', '10011000010', '10000110100', '10000110010',
  '11000010010', '11001010000', '11110111010', '11000010100', '10001111010',
  '10100111100', '10010111100', '10010011110', '10111100100', '10011110100',
  '10011110010', '11110100100', '11110010100', '11110010010', '11011011110',
  '11011110110', '11110110110', '10101111000', '10100011110', '10001011110',
  '10111101000', '10111100010', '11110101000', '11110100010', '10111011110',
  '10111101110', '11101011110', '11110101110', '11010000100', '11010010000',
  '11010011100', '1100011101011',
];

/**
 * Encodes an ASCII string (such as `192.168.1.15:3000`) into a binary bar pattern
 * for rendering a scannable Code-128B SVG barcode on the Windows Laptop screen.
 */
export function encodeCode128B(text: string): string {
  const clean = text.trim();
  if (!clean) return '';
  // Start Code B = 104
  const codes: number[] = [104];
  let checksum = 104;

  for (let i = 0; i < clean.length; i++) {
    const ascii = clean.charCodeAt(i);
    const val = ascii >= 32 && ascii <= 126 ? ascii - 32 : 0;
    codes.push(val);
    checksum += val * (i + 1);
  }

  const checkCode = checksum % 103;
  codes.push(checkCode);
  // Stop Code = 106
  codes.push(106);

  return codes.map((c) => CODE128_PATTERNS[c] || '').join('');
}
