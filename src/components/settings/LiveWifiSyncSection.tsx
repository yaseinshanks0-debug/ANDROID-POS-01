import React, { useState, useMemo } from 'react';
import {
  Wifi,
  WifiOff,
  Laptop,
  Smartphone,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Camera,
  Zap,
  Radio,
  ArrowLeftRight,
  Activity,
  Server,
  Link2,
  Unlink,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import {
  encodeCode128B,
  isStandaloneCapacitorApk,
  normalizeLanHostUrl,
} from '../../lib/lan-sync-client';
import { BarcodeScannerModal } from '../checkout/BarcodeScannerModal';
import { playSuccessChime, triggerHaptic } from '../../lib/sound-fx';

interface LiveWifiSyncSectionProps {
  compact?: boolean;
}

export const LiveWifiSyncSection: React.FC<LiveWifiSyncSectionProps> = ({ compact = false }) => {
  const {
    settings,
    lanSyncConfig,
    updateLanSyncConfig,
    lanConnectionStatus,
    lanConnectedDevices,
    lanRecentEvents,
    lanNetworkAddresses,
    lanPrimaryHostUrl,
    lanLastSyncError,
    pushLiveLanSyncNow,
  } = usePOS();

  const isAr = settings.language === 'ar';
  const isAndroidApk = useMemo(() => isStandaloneCapacitorApk(), []);

  const [hostInput, setHostInput] = useState<string>(lanSyncConfig.hostUrl || '');
  const [deviceNameInput, setDeviceNameInput] = useState<string>(lanSyncConfig.deviceName || '');
  const [selectedAddressIdx, setSelectedAddressIdx] = useState<number>(0);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [isManualSyncing, setIsManualSyncing] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [statusFeedback, setStatusFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const activeHostAddress = useMemo(() => {
    if (lanNetworkAddresses.length > 0) {
      const chosen = lanNetworkAddresses[selectedAddressIdx] || lanNetworkAddresses[0];
      return chosen.url;
    }
    if (lanPrimaryHostUrl) return lanPrimaryHostUrl;
    if (typeof window !== 'undefined' && window.location?.origin?.startsWith('http')) {
      return window.location.origin;
    }
    return 'http://192.168.1.100:3000';
  }, [lanNetworkAddresses, selectedAddressIdx, lanPrimaryHostUrl]);

  // Compact IP:Port payload for Code-128 Barcode so camera scanners read it effortlessly
  const compactPairingCode = useMemo(() => {
    return activeHostAddress.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
  }, [activeHostAddress]);

  const barcodeBits = useMemo(() => {
    return encodeCode128B(compactPairingCode);
  }, [compactPairingCode]);

  const handleCopyHostUrl = async () => {
    try {
      await navigator.clipboard.writeText(activeHostAddress);
      setCopiedUrl(true);
      triggerHaptic('light', settings.hapticsEnabled);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {}
  };

  const handleSaveAndConnect = async (overrideUrl?: string) => {
    const rawTarget = overrideUrl !== undefined ? overrideUrl : hostInput;
    const normalized = normalizeLanHostUrl(rawTarget);
    const cleanName =
      deviceNameInput.trim() ||
      (lanSyncConfig.platform === 'android' ? 'هاتف أندرويد POS' : 'كمبيوتر ويندوز POS');

    updateLanSyncConfig({
      enabled: true,
      hostUrl: normalized,
      deviceName: cleanName,
      autoSyncOnEveryAction: true,
    });
    setHostInput(normalized);

    setIsManualSyncing(true);
    setStatusFeedback(null);
    try {
      // Allow state update to propagate or call directly
      setTimeout(async () => {
        const ok = await pushLiveLanSyncNow(
          `ربط ومزامنة حية من ${cleanName}`,
          `Live Wi-Fi pairing & sync from ${cleanName}`
        );
        setIsManualSyncing(false);
        if (ok) {
          playSuccessChime(settings.soundEnabled);
          triggerHaptic('success', settings.hapticsEnabled);
          setStatusFeedback({
            type: 'success',
            message: isAr
              ? 'تم الربط والمزامنة الحية عبر الواي فاي بنجاح! كل العمليات تظهر الآن لايف في الجهازين.'
              : 'Connected & synced live over Wi-Fi! All operations now appear live on both devices.',
          });
        } else {
          setStatusFeedback({
            type: 'error',
            message: isAr
              ? 'تعذر الوصول إلى عنوان IP للكمبيوتر. تأكد أن الهاتف واللابتوب على نفس شبكة الواي فاي أو نقطة الاتصال.'
              : 'Could not reach Laptop IP. Ensure both Android and Windows are on the same Wi-Fi or Hotspot.',
          });
        }
      }, 150);
    } catch {
      setIsManualSyncing(false);
    }
  };

  const handleManualPushNow = async () => {
    setIsManualSyncing(true);
    setStatusFeedback(null);
    const ok = await pushLiveLanSyncNow(
      'مزامنة شاملة فورية عبر الواي فاي',
      'Manual full Wi-Fi sync'
    );
    setIsManualSyncing(false);
    if (ok) {
      playSuccessChime(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);
      setStatusFeedback({
        type: 'success',
        message: isAr
          ? 'تمت المزامنة الفورية بنجاح بين الويندوز والأندرويد!'
          : 'Instant bidirectional sync completed between Windows and Android!',
      });
    } else {
      setStatusFeedback({
        type: 'error',
        message: isAr
          ? 'فشل الاتصال بالمضيف. تحقق من عنوان IP واتصال الواي فاي.'
          : 'Failed to reach host. Verify the IP address and Wi-Fi connection.',
      });
    }
  };

  const handleDisconnect = () => {
    updateLanSyncConfig({ enabled: false });
    setStatusFeedback({
      type: 'error',
      message: isAr
        ? 'تم إيقاف المزامنة الحية مؤقتاً.'
        : 'Live Wi-Fi sync paused.',
    });
  };

  return (
    <div className="space-y-4" data-testid="live-wifi-sync-section">
      {/* Top Status Banner */}
      <div
        className={`p-4 rounded-xl border transition-all ${
          lanConnectionStatus === 'connected'
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : lanConnectionStatus === 'connecting'
            ? 'bg-amber-500/10 border-amber-500/30'
            : 'bg-zinc-950/90 border-zinc-800'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                lanConnectionStatus === 'connected'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : lanConnectionStatus === 'connecting'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400'
              }`}
            >
              {lanConnectionStatus === 'connected' ? (
                <Wifi className="w-5 h-5" />
              ) : (
                <WifiOff className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-white">
                  {isAr
                    ? 'المزامنة الحية ثنائية الاتجاه عبر الواي فاي (Windows ⇄ Android)'
                    : 'Live Bidirectional Wi-Fi Sync (Windows ⇄ Android)'}
                </h3>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    lanConnectionStatus === 'connected'
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : lanConnectionStatus === 'connecting'
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      lanConnectionStatus === 'connected'
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]'
                        : lanConnectionStatus === 'connecting'
                        ? 'bg-amber-400'
                        : 'bg-zinc-500'
                    }`}
                  />
                  {lanConnectionStatus === 'connected'
                    ? isAr
                      ? 'متصل لايف (مزامنة فورية)'
                      : 'Connected Live (Real-Time)'
                    : lanConnectionStatus === 'connecting'
                    ? isAr
                      ? 'جاري الاتصال...'
                      : 'Connecting...'
                    : lanConnectionStatus === 'unconfigured'
                    ? isAr
                      ? 'بانتظار إدخال IP الكمبيوتر'
                      : 'Awaiting Laptop IP'
                    : isAr
                    ? 'غير متصل'
                    : 'Disconnected'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {isAr
                  ? 'أي عملية بيع، إضافة منتج، تعديل مخزون، أو عميل تتم على الأندرويد تظهر فوراً في الويندوز والعكس بدون إنترنت سحابي.'
                  : 'Every sale, product edit, stock movement, or customer action on Android appears instantly on Windows and vice-versa over local Wi-Fi.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualPushNow}
              disabled={isManualSyncing}
              data-testid="lan-sync-push-now-btn"
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isManualSyncing ? 'animate-spin' : ''}`} />
              <span>{isAr ? 'مزامنة فورية الآن' : 'Sync Live Now'}</span>
            </button>

            {lanSyncConfig.enabled ? (
              <button
                type="button"
                onClick={handleDisconnect}
                className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Unlink className="w-3.5 h-3.5 text-rose-400" />
                <span>{isAr ? 'إيقاف مؤقت' : 'Pause'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSaveAndConnect()}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'تفعيل المزامنة' : 'Enable Sync'}</span>
              </button>
            )}
          </div>
        </div>

        {statusFeedback && (
          <div
            className={`mt-3 p-2.5 rounded-lg border text-xs font-bold flex items-center gap-2 ${
              statusFeedback.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
            }`}
          >
            {statusFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{statusFeedback.message}</span>
          </div>
        )}

        {lanLastSyncError && lanConnectionStatus === 'disconnected' && !statusFeedback && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>
              {isAr
                ? `تنبيه الاتصال: تأكد من تشغيل النظام على اللابتوب واتصال الجهازين بنفس شبكة الواي فاي (${lanLastSyncError})`
                : `Connection notice: Ensure the Windows Laptop server is running on the same Wi-Fi (${lanLastSyncError})`}
            </span>
          </div>
        )}
      </div>

      {/* Main 2-Column Grid: Left = Windows Host Address & Barcode | Right = Android Pairing & Device Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card 1: Windows Laptop Host Info & Pairing Barcode */}
        <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">
                  {isAr
                    ? '1. عنوان مضيف الويندوز (Laptop Wi-Fi Host)'
                    : '1. Windows Laptop Wi-Fi Host Address'}
                </h4>
                <p className="text-[11px] text-zinc-400">
                  {isAr
                    ? 'استخدم هذا العنوان أو امسح الباركود من تطبيق الأندرويد للربط الفوري'
                    : 'Enter this IP or scan the barcode from the Android app to pair'}
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 text-[10px] font-mono">
              Port 3000
            </span>
          </div>

          {lanNetworkAddresses.length > 1 && (
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                {isAr ? 'اختر شبكة الواي فاي / نقطة الاتصال:' : 'Select Wi-Fi / Hotspot Interface:'}
              </label>
              <select
                value={selectedAddressIdx}
                onChange={(e) => setSelectedAddressIdx(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
              >
                {lanNetworkAddresses.map((addr, idx) => (
                  <option key={`${addr.ip}-${idx}`} value={idx}>
                    {addr.url} ({addr.interfaceName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Highlighted Copyable Host URL */}
          <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                {isAr ? 'رابط الربط المباشر عبر الواي فاي' : 'Direct Wi-Fi Pairing URL'}
              </div>
              <div
                className="text-sm sm:text-base font-black font-mono text-sky-400 truncate mt-0.5"
                dir="ltr"
                data-testid="lan-host-primary-url"
              >
                {activeHostAddress}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyHostUrl}
              className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{isAr ? 'تم النسخ' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isAr ? 'نسخ الرابط' : 'Copy URL'}</span>
                </>
              )}
            </button>
          </div>

          {/* Scannable Code-128 Barcode for 1-Tap Android Camera Pairing */}
          {!compact && (
            <div className="p-3 rounded-xl bg-white text-zinc-950 border border-zinc-300 flex flex-col items-center justify-center space-y-1.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-zinc-700">
                {isAr
                  ? 'امسح الباركود بكاميرا تطبيق الأندرويد للربط التلقائي'
                  : 'Scan with Android App Camera for Instant Pairing'}
              </div>
              <svg
                viewBox={`0 0 ${barcodeBits.length + 20} 48`}
                className="w-full max-w-[300px] h-12"
                preserveAspectRatio="none"
              >
                <rect x="0" y="0" width={barcodeBits.length + 20} height="48" fill="#ffffff" />
                {barcodeBits.split('').map((bit, idx) =>
                  bit === '1' ? (
                    <rect key={idx} x={idx + 10} y="4" width="1" height="40" fill="#09090b" />
                  ) : null
                )}
              </svg>
              <div className="text-xs font-mono font-black tracking-widest text-zinc-900" dir="ltr">
                {compactPairingCode}
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Connect Android / Remote Device to Windows Host */}
        <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">
                  {isAr
                    ? '2. إعدادات ربط الجهاز (الأندرويد أو نقطة بيع فرعية)'
                    : '2. Pair Android Phone or Secondary Terminal'}
                </h4>
                <p className="text-[11px] text-zinc-400">
                  {isAr
                    ? 'أدخل عنوان IP الخاص باللابتوب أو امسح الباركود بالكاميرا'
                    : 'Enter the Windows Laptop IP or scan the pairing barcode'}
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
              {lanSyncConfig.platform === 'android'
                ? isAr
                  ? 'جهاز أندرويد'
                  : 'Android Device'
                : isAr
                ? 'جهاز ويندوز'
                : 'Windows PC'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                {isAr ? 'اسم هذا الجهاز في الشبكة' : 'This Device Name on LAN'}
              </label>
              <input
                type="text"
                value={deviceNameInput}
                onChange={(e) => setDeviceNameInput(e.target.value)}
                placeholder={isAr ? 'مثال: كاشير أندرويد 1' : 'e.g. Android POS 1'}
                className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                {isAr
                  ? 'عنوان IP للابتوب الويندوز (اختياري على المضيف)'
                  : 'Windows Laptop IP (Required on Android)'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={hostInput}
                onChange={(e) => setHostInput(e.target.value)}
                placeholder="http://192.168.1.100:3000"
                data-testid="lan-host-url-input"
                className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-emerald-300 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleSaveAndConnect()}
              disabled={isManualSyncing}
              data-testid="lan-save-connect-btn"
              className="flex-1 min-w-[160px] h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>
                {isAr ? 'حفظ واتصال لايف عبر الواي فاي' : 'Save & Connect Live via Wi-Fi'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              data-testid="lan-scan-barcode-btn"
              className="h-10 px-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{isAr ? 'مسح باركود الربط بالكاميرا' : 'Scan Pairing Barcode'}</span>
            </button>
          </div>

          {/* Auto-Sync Toggle */}
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-bold text-zinc-300">
                {isAr
                  ? 'مزامنة لحظية تلقائية عند كل عملية بيع أو تعديل'
                  : 'Instant auto-sync on every sale or edit'}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                updateLanSyncConfig({
                  autoSyncOnEveryAction: !lanSyncConfig.autoSyncOnEveryAction,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                lanSyncConfig.autoSyncOnEveryAction ? 'bg-emerald-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  lanSyncConfig.autoSyncOnEveryAction
                    ? isAr
                      ? '-translate-x-5'
                      : 'translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {isAndroidApk && !lanSyncConfig.hostUrl && (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300">
              {isAr
                ? 'ملاحظة لتطبيق الأندرويد: اكتب عنوان الـ IP الظاهر في شاشة اللابتوب (مثل 192.168.1.100:3000) أو اضغط "مسح باركود الربط بالكاميرا" ليتم الربط فوراً.'
                : 'Android Tip: Enter the IP shown on your Windows Laptop (e.g. 192.168.1.100:3000) or tap Scan Pairing Barcode.'}
            </div>
          )}
        </div>
      </div>

      {/* Connected Devices & Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Connected Devices List */}
        <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-black text-white">
                {isAr ? 'الأجهزة المتصلة حالياً على الشبكة' : 'Devices Currently Online on LAN'}
              </h4>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
              {lanConnectedDevices.length}{' '}
              {isAr ? 'جهاز متصل' : lanConnectedDevices.length === 1 ? 'Device' : 'Devices'}
            </span>
          </div>

          {lanConnectedDevices.length === 0 ? (
            <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/60 text-center text-xs text-zinc-500">
              {isAr
                ? 'لا توجد أجهزة مقترنة نشطة حالياً. بمجرد ربط الأندرويد والويندوز سيظهران هنا لايف.'
                : 'No active paired peers yet. Once Windows and Android connect, both appear here live.'}
            </div>
          ) : (
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {lanConnectedDevices.map((dev) => {
                const isSelf = dev.deviceId === lanSyncConfig.deviceId;
                return (
                  <div
                    key={dev.deviceId}
                    className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          dev.platform === 'android'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                        }`}
                      >
                        {dev.platform === 'android' ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <Laptop className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">
                            {dev.deviceName}
                          </span>
                          {isSelf && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                              {isAr ? 'هذا الجهاز' : 'This Device'}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono" dir="ltr">
                          {dev.platform.toUpperCase()} • {dev.ipAddress || 'LAN'}
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                      {isAr ? 'متصل لايف' : 'Live'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Sync Activity Stream */}
        <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-black text-white">
                {isAr
                  ? 'سجل العمليات المتزامنة لحظياً (Live Feed)'
                  : 'Real-Time Synced Operations Feed'}
              </h4>
            </div>
            <Server className="w-3.5 h-3.5 text-zinc-500" />
          </div>

          {lanRecentEvents.length === 0 ? (
            <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/60 text-center text-xs text-zinc-500">
              {isAr
                ? 'سيظهر هنا سجل حي لكل عملية بيع أو تعديل تتم بين الويندوز والأندرويد.'
                : 'Live log of sales, product updates, and stock actions synced between devices will appear here.'}
            </div>
          ) : (
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {lanRecentEvents.slice(0, 8).map((ev) => (
                <div
                  key={ev.id}
                  className="p-2 rounded-lg bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-zinc-200 truncate">
                      {isAr ? ev.summaryAr : ev.summaryEn}
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {ev.deviceName} ({ev.platform === 'android' ? 'Android' : 'Windows'})
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 shrink-0" dir="ltr">
                    {new Date(ev.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Camera Barcode Scanner Modal for 1-Tap Pairing */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={(scannedValue) => {
          setIsScannerOpen(false);
          const normalized = normalizeLanHostUrl(scannedValue);
          if (normalized) {
            setHostInput(normalized);
            handleSaveAndConnect(normalized);
          }
        }}
      />
    </div>
  );
};
