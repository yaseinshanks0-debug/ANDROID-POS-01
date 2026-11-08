/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { usePOS } from '../../context/POSContext';
import { getTranslation } from '../../lib/translations';
import { AppCard } from '../ui/AppCard';
import { AppInput } from '../ui/AppInput';
import { TactileButton } from '../ui/TactileButton';
import { HoldToConfirm } from '../ui/HoldToConfirm';
import { SupportedCurrency, Currency } from '../../lib/types';
import { normalizeNumberInput, parseNormalizedNumber } from '../../lib/number-utils';
import {
  Settings,
  Globe,
  Sun,
  Moon,
  Volume2,
  Vibrate,
  Store,
  Percent,
  Coins,
  RefreshCw,
  Database,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Lock,
  Trash2,
  X,
  Download,
  Upload,
  HardDriveDownload,
} from 'lucide-react';
import { playTactileClick } from '../../lib/sound-fx';
import { offlineSqliteStorage } from '../../lib/offline-sqlite-storage';
import {
  triggerUniversalFileDownload,
  triggerUniversalFileShare,
} from '../../lib/native-file-download';
import { ExchangeRateSettings } from './ExchangeRateSettings';
import { UsersPermissionsSection } from './UsersPermissionsSection';
import { TrainingCenterSection } from './TrainingCenterSection';
import { BackupRestoreCenterSection } from './BackupRestoreCenterSection';
import { LiveWifiSyncSection } from './LiveWifiSyncSection';
import { FirebaseCloudSyncSection } from './FirebaseCloudSyncSection';

export const SettingsView: React.FC = () => {
  const {
    settings,
    currencies: contextCurrencies,
    currentCompany,
    currentUser,
    workspaceMode,
    updateSettings,
    resetAllData,
    executeAuthorizedFactoryReset,
    syncTransactions,
    isSyncing,
    lastSyncedAt,
    sqliteDiagnostics,
    products,
    transactions,
    customers,
    stockMovements,
    applyIncomingLanSyncState,
  } = usePOS();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>(() =>
    contextCurrencies && contextCurrencies.length > 0
      ? contextCurrencies.map((c) => c.code)
      : []
  );

  React.useEffect(() => {
    setAvailableCurrencies(
      contextCurrencies && contextCurrencies.length > 0
        ? contextCurrencies.map((c) => c.code)
        : []
    );
  }, [contextCurrencies]);

  const handleCurrenciesUpdated = useCallback((currList: Currency[]) => {
    setAvailableCurrencies(currList && currList.length > 0 ? currList.map((c) => c.code) : []);
  }, []);

  // Authorized Factory Reset Modal state (Part 8: Two Reset Scopes)
  const [isFactoryResetModalOpen, setIsFactoryResetModalOpen] = useState(false);
  const [factoryResetScope, setFactoryResetScope] = useState<
    'LOCAL_DEVICE_RESET' | 'COMPANY_FACTORY_RESET'
  >('LOCAL_DEVICE_RESET');
  const [confirmCompanyNameInput, setConfirmCompanyNameInput] = useState('');
  const [ownerPasswordInput, setOwnerPasswordInput] = useState('');
  const [resetReasonInput, setResetReasonInput] = useState('');
  const [factoryResetError, setFactoryResetError] = useState<string | null>(null);
  const [isExecutingReset, setIsExecutingReset] = useState(false);

  // Store form state
  const [storeName, setStoreName] = useState(settings.storeName);
  const [storeNameAr, setStoreNameAr] = useState(settings.storeNameAr);
  const [storeLogo, setStoreLogo] = useState(settings.storeLogo || '');
  const [address, setAddress] = useState(settings.address);
  const [addressAr, setAddressAr] = useState(settings.addressAr);
  const [taxNumber, setTaxNumber] = useState(settings.taxNumber);
  const [phone, setPhone] = useState(settings.phone);
  const [receiptFooter, setReceiptFooter] = useState(settings.receiptFooter);
  const [receiptFooterAr, setReceiptFooterAr] = useState(settings.receiptFooterAr);
  const [taxRatePercent, setTaxRatePercent] = useState(settings.taxRatePercent.toString());
  const [isTaxInclusive, setIsTaxInclusive] = useState(settings.isTaxInclusive);
  const [savedNotification, setSavedNotification] = useState(false);
  const logoInputRef = React.useRef<HTMLInputElement | null>(null);
  const sqliteRestoreInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isExportingSqlite, setIsExportingSqlite] = useState(false);
  const [sqliteBackupStatus, setSqliteBackupStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleExportSqliteBackup = async (shareAfterExport = false) => {
    setIsExportingSqlite(true);
    setSqliteBackupStatus(null);
    try {
      const exported = await offlineSqliteStorage.exportDatabaseToBackupFile({
        companyId: currentCompany.id,
        companyName: currentCompany.displayName || currentCompany.legalName || settings.storeName,
        transactions,
        products,
        customers,
        stockMovements,
        currencies: contextCurrencies,
        settings: settings as unknown as Record<string, any>,
      });

      if (shareAfterExport) {
        await triggerUniversalFileShare(
          exported.jsonContent,
          exported.fileName,
          'application/json'
        );
      } else {
        triggerUniversalFileDownload(
          exported.jsonContent,
          exported.fileName,
          'application/json'
        );
      }

      setSqliteBackupStatus({
        type: 'success',
        message: isAr
          ? `تم تصدير وتنزيل قاعدة بيانات SQLite المحلية بنجاح (${exported.fileName} — ${exported.transactionsCount} فاتورة، ${exported.productsCount} منتج، ${exported.customersCount} عميل).`
          : `Exported & downloaded SQLite database backup (${exported.fileName} — ${exported.transactionsCount} invoices, ${exported.productsCount} products).`,
      });
    } catch (err: any) {
      setSqliteBackupStatus({
        type: 'error',
        message: isAr
          ? `فشل تصدير قاعدة بيانات SQLite: ${err?.message || ''}`
          : `Failed to export SQLite database: ${err?.message || ''}`,
      });
    } finally {
      setIsExportingSqlite(false);
    }
  };

  const handleImportSqliteBackupFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsExportingSqlite(true);
    setSqliteBackupStatus(null);
    try {
      const rawText = await file.text();
      const res = await offlineSqliteStorage.importDatabaseFromBackupFile(
        rawText,
        currentCompany.id
      );
      if (!res.ok) {
        setSqliteBackupStatus({
          type: 'error',
          message:
            res.error ||
            (isAr
              ? 'ملف النسخة الاحتياطية لـ SQLite غير صالح.'
              : 'Invalid SQLite backup file.'),
        });
        return;
      }

      applyIncomingLanSyncState({
        transactions: res.restoredTransactions,
        products: res.restoredProducts,
        customers: res.restoredCustomers,
        stockMovements: res.restoredStockMovements,
        currencies: res.restoredCurrencies,
      });

      setSqliteBackupStatus({
        type: 'success',
        message: isAr
          ? `تم استيراد واستعادة قاعدة بيانات SQLite بنجاح (${res.restoredTransactions.length} فاتورة، ${res.restoredProducts.length} منتج، ${res.restoredCustomers.length} عميل)!`
          : `Successfully restored SQLite database backup (${res.restoredTransactions.length} invoices, ${res.restoredProducts.length} products, ${res.restoredCustomers.length} customers)!`,
      });
    } catch (err: any) {
      setSqliteBackupStatus({
        type: 'error',
        message: isAr
          ? `فشل استيراد ملف SQLite: ${err?.message || ''}`
          : `Failed to import SQLite backup: ${err?.message || ''}`,
      });
    } finally {
      setIsExportingSqlite(false);
    }
  };

  React.useEffect(() => {
    setStoreName(settings.storeName);
    setStoreNameAr(settings.storeNameAr);
    setStoreLogo(settings.storeLogo || '');
  }, [settings.storeName, settings.storeNameAr, settings.storeLogo]);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 240;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/png', 0.9);
          setStoreLogo(dataUrl);
          updateSettings({ storeLogo: dataUrl });
        } else if (typeof reader.result === 'string') {
          setStoreLogo(reader.result);
          updateSettings({ storeLogo: reader.result });
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveStoreProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      storeNameAr,
      storeLogo: storeLogo.trim(),
      address,
      addressAr,
      taxNumber,
      phone,
      receiptFooter,
      receiptFooterAr,
      taxRatePercent: parseNormalizedNumber(taxRatePercent, 0),
      isTaxInclusive,
    });
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-6 space-y-6 pb-28">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          {t.systemSettings}
        </h2>
        <span className="text-xs text-neutral-400 mt-0.5 block">
          {isAr
            ? 'تفضيلات النظام، صلاحيات المستخدمين، العملات وأسعار الصرف، الضرائب، والنسخ الاحتياطي'
            : 'Hardware preferences, multi-user permissions, localization, tax policies and sync state'}
        </span>
      </div>

      {/* Interactive Training Tour & Onboarding Center */}
      <TrainingCenterSection />

      {/* Multi-User Role Permissions & Concurrent Active Sessions */}
      <UsersPermissionsSection />

      {/* Enterprise Backup, Restore, Company Migration & Intelligent Data Merge Center */}
      <BackupRestoreCenterSection />

      {/* Language & Appearance */}
      <AppCard>
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
          <Globe className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold text-sm text-white">{t.general}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Language Selector */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
              {t.language}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  playTactileClick(settings.soundEnabled);
                  updateSettings({ language: 'en' });
                }}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  settings.language === 'en'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-neutral-850 border-neutral-750 text-neutral-400 hover:text-white'
                }`}
              >
                <span>English (LTR)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playTactileClick(settings.soundEnabled);
                  updateSettings({ language: 'ar' });
                }}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all font-arabic ${
                  settings.language === 'ar'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-neutral-850 border-neutral-750 text-neutral-400 hover:text-white'
                }`}
              >
                <span>العربية (RTL)</span>
              </button>
            </div>
          </div>

          {/* Currency Selector */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-neutral-400" />
              <span>{t.currency}</span>
            </label>
            {availableCurrencies.length === 0 ? (
              <div className="p-2.5 rounded-xl bg-neutral-900/70 border border-dashed border-neutral-700 text-[11px] text-neutral-400">
                {isAr
                  ? 'لم يتم إضافة أي عملات بعد — قم بإضافة عملاتك المخصصة من قسم العملات وأسعار الصرف أدناه.'
                  : 'No currencies added yet — add your custom currencies in the Exchange Rates section below.'}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {availableCurrencies.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      playTactileClick(settings.soundEnabled);
                      updateSettings({ currency: c });
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                      settings.currency === c
                        ? 'bg-amber-500 text-neutral-950 border-amber-400'
                        : 'bg-neutral-850 border-neutral-750 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sound & Haptic Feedback Toggles */}
          <div className="flex items-center justify-between p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-white block">{t.soundEffects}</span>
                <span className="text-[10px] text-neutral-500">
                  Tactile mechanical switch audio clicks
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.soundEnabled ? 'bg-amber-500 justify-end' : 'bg-neutral-800 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <Vibrate className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-white block">{t.hapticFeedback}</span>
                <span className="text-[10px] text-neutral-500">
                  Capacitor Android impact vibrations
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateSettings({ hapticsEnabled: !settings.hapticsEnabled })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.hapticsEnabled ? 'bg-amber-500 justify-end' : 'bg-neutral-800 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>
        </div>
      </AppCard>

      {/* Multi-Currency Exchange Rates Management Section */}
      <ExchangeRateSettings onCurrenciesUpdated={handleCurrenciesUpdated} />

      {/* Store Profile & Tax Policies */}
      <AppCard>
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
          <Store className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold text-sm text-white">{t.storeProfile}</h3>
        </div>

        <form onSubmit={handleSaveStoreProfile} className="space-y-4 mt-4">
          {/* Store Logo Upload & Preview */}
          <div className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center overflow-hidden shrink-0">
              {storeLogo ? (
                <img
                  src={storeLogo}
                  alt="Store Logo"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <span className="font-mono font-bold text-lg text-amber-400">DQ</span>
              )}
            </div>
            <div className="flex-1 w-full space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {settings.language === 'ar'
                      ? 'شعار المتجر (اللوقو) على الفاتورة والواجهة'
                      : 'Store Logo (Receipt & Header)'}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    {settings.language === 'ar'
                      ? 'ارفع صورة شعار المتجر أو أدخل رابط الصورة ليظهر في الفاتورة المطبوعة'
                      : 'Upload an image or paste a URL to appear on printed receipts'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    className="hidden"
                  />
                  <TactileButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    {settings.language === 'ar' ? 'رفع اللوقو' : 'Upload Logo'}
                  </TactileButton>
                  {storeLogo && (
                    <TactileButton
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setStoreLogo('');
                        updateSettings({ storeLogo: '' });
                      }}
                    >
                      {settings.language === 'ar' ? 'حذف' : 'Remove'}
                    </TactileButton>
                  )}
                </div>
              </div>
              <input
                type="text"
                dir="ltr"
                value={storeLogo.startsWith('data:') ? '' : storeLogo}
                onChange={(e) => setStoreLogo(e.target.value)}
                placeholder={
                  storeLogo.startsWith('data:')
                    ? settings.language === 'ar'
                      ? 'تم رفع صورة لوقو مخصصة'
                      : 'Custom uploaded logo active'
                    : 'https://example.com/store-logo.png'
                }
                className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AppInput
              label={t.storeName}
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
            />
            <AppInput
              label="Arabic Store Name (اسم المتجر)"
              value={storeNameAr}
              onChange={(e) => setStoreNameAr(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AppInput
              label={t.storeAddress}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <AppInput
              label="Arabic Address (العنوان بالعربية)"
              value={addressAr}
              onChange={(e) => setAddressAr(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <AppInput
              label={t.taxNumber}
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
            />
            <AppInput
              label={t.phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <AppInput
              label={t.taxRate}
              type="text"
              inputMode="decimal"
              dir="ltr"
              value={taxRatePercent}
              onChange={(e) => setTaxRatePercent(normalizeNumberInput(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AppInput
              label={t.receiptFooterNote}
              value={receiptFooter}
              onChange={(e) => setReceiptFooter(e.target.value)}
            />
            <AppInput
              label="Arabic Receipt Note (تذييل الفاتورة)"
              value={receiptFooterAr}
              onChange={(e) => setReceiptFooterAr(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
              <input
                type="checkbox"
                checked={isTaxInclusive}
                onChange={(e) => setIsTaxInclusive(e.target.checked)}
                className="rounded border-neutral-700 text-amber-500 focus:ring-amber-500"
              />
              <span>{t.taxInclusive}</span>
            </label>

            <div className="flex items-center gap-2">
              {savedNotification && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </span>
              )}
              <TactileButton variant="amber" type="submit" size="sm">
                {t.saveSettings}
              </TactileButton>
            </div>
          </div>
        </form>
      </AppCard>

      {/* Offline Sync State & Database Control */}
      <AppCard>
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
          <Database className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-sm text-white">{t.offlineStatus}</h3>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-neutral-950/70 border border-neutral-800 rounded-2xl">
          <div className="space-y-1.5">
            <div className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>
                {isAr
                  ? 'محرك قاعدة البيانات المحلية أوفلاين (Capacitor SQLite Engine)'
                  : 'Capacitor SQLite Offline Durable Engine Active'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300">
                {sqliteDiagnostics.engineType === 'capacitor-sqlite'
                  ? 'Native SQLite DB'
                  : sqliteDiagnostics.engineType === 'indexeddb-sqlite-mirror'
                  ? 'SQLite + IndexedDB'
                  : 'SQLite Journal'}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              {isAr
                ? `قاعدة بيانات SQLite المحلية (${sqliteDiagnostics.databaseName}) تحفظ جميع الفواتير (${sqliteDiagnostics.totalPersistedTransactions} فاتورة محفوظة، ${sqliteDiagnostics.pendingOfflineTransactions} بانتظار المزامنة) تلقائياً عند انقطاع الإنترنت.`
                : `Local SQLite database (${sqliteDiagnostics.databaseName}) persists all offline transactions (${sqliteDiagnostics.totalPersistedTransactions} saved, ${sqliteDiagnostics.pendingOfflineTransactions} pending outbox).`}
              {lastSyncedAt && ` • ${isAr ? 'آخر مزامنة:' : 'Last synced:'} ${lastSyncedAt.toLocaleTimeString()}`}
            </p>
          </div>

          <TactileButton
            variant="secondary"
            size="sm"
            onClick={syncTransactions}
            isLoading={isSyncing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            {t.syncNow}
          </TactileButton>
        </div>

        {/* Capacitor SQLite Database Backup Export & Restore to Local File */}
        <div
          data-testid="sqlite-backup-export-card"
          className="mt-4 p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                <HardDriveDownload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white">
                  {isAr
                    ? 'نسخ احتياطي وتصدير قاعدة بيانات SQLite المحلية (SQLite Database Backup)'
                    : 'Local Capacitor SQLite Database Backup & File Export'}
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {isAr
                    ? 'قم بتصدير وتنزيل ملف قاعدة بيانات SQLite الكامل (.sqlite.json) لحفظ نسخة احتياطية من الفواتير والمنتجات والعملاء على جهازك.'
                    : 'Export the local Capacitor SQLite database tables to a downloadable (.sqlite.json) backup file or restore from an existing file.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={sqliteRestoreInputRef}
                type="file"
                accept=".json,.sqlite.json"
                onChange={handleImportSqliteBackupFile}
                className="hidden"
              />
              <TactileButton
                type="button"
                variant="amber"
                size="sm"
                data-testid="export-sqlite-backup-btn"
                isLoading={isExportingSqlite}
                onClick={() => handleExportSqliteBackup(false)}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                {isAr ? 'تنزيل نسخة SQLite الاحتياطية' : 'Download SQLite Backup'}
              </TactileButton>

              <TactileButton
                type="button"
                variant="secondary"
                size="sm"
                data-testid="import-sqlite-backup-btn"
                isLoading={isExportingSqlite}
                onClick={() => sqliteRestoreInputRef.current?.click()}
                leftIcon={<Upload className="w-3.5 h-3.5" />}
              >
                {isAr ? 'استعادة ملف SQLite' : 'Restore SQLite File'}
              </TactileButton>
            </div>
          </div>

          {sqliteBackupStatus && (
            <div
              data-testid="sqlite-backup-status-banner"
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                sqliteBackupStatus.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {sqliteBackupStatus.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{sqliteBackupStatus.message}</span>
            </div>
          )}
        </div>

        {/* Firebase Auth (Google Sign-In) & Cloud Firestore Persistence */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80">
          <FirebaseCloudSyncSection />
        </div>

        {/* Live Wi-Fi LAN Bidirectional Sync (Windows <-> Android) */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80">
          <LiveWifiSyncSection />
        </div>

        {/* Factory Reset Safety Zone (Part 8: Two-Scope Authorized Reset Workflow) */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-rose-400 block">
              {isAr
                ? 'إعادة ضبط المصنع وإدارة تصفير البيانات (Factory Reset)'
                : 'Authorized Factory Reset & Zero-Default-Data Wipe'}
            </span>
            <span className="text-[11px] text-neutral-500">
              {isAr
                ? 'اختر بين مسح بيانات هذا الجهاز محلياً أو إعادة ضبط الشركة بالكامل بدون أي بيانات افتراضية'
                : 'Choose between Local Device Reset or Authorized Company Factory Reset (zero default data)'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <TactileButton
              type="button"
              variant="danger"
              size="sm"
              data-testid="open-factory-reset-modal-btn"
              onClick={() => {
                setFactoryResetError(null);
                setConfirmCompanyNameInput('');
                setOwnerPasswordInput('');
                setResetReasonInput('');
                setFactoryResetScope('LOCAL_DEVICE_RESET');
                setIsFactoryResetModalOpen(true);
              }}
              leftIcon={<ShieldAlert className="w-3.5 h-3.5" />}
            >
              {isAr ? 'خيارات إعادة الضبط المعتمدة' : 'Authorized Factory Reset'}
            </TactileButton>

            <HoldToConfirm
              onConfirm={resetAllData}
              label={isAr ? 'مسح محلي سريع' : t.resetData}
              confirmingLabel={isAr ? 'جاري المسح...' : 'Erasing data...'}
              confirmedLabel={isAr ? 'تم المسح' : 'Reset Complete'}
              variant="danger"
              className="w-full sm:w-auto text-xs min-h-[38px]"
            />
          </div>
        </div>
      </AppCard>

      {/* Part 8: Authorized Two-Scope Factory Reset Modal */}
      {isFactoryResetModalOpen && (
        <div
          data-testid="factory-reset-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
        >
          <div className="w-full max-w-xl bg-neutral-900 border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {isAr
                      ? 'بوابة إعادة ضبط المصنع المعتمدة (بدون بيانات افتراضية)'
                      : 'Authorized Factory Reset (Zero Default Business Data)'}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {isAr
                      ? 'لن يتم توليد أي منتجات أو عملات أو حسابات افتراضية بعد إعادة الضبط'
                      : 'No sample products, currencies, or fictional accounts will be created after reset'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                data-testid="factory-reset-close-btn"
                onClick={() => setIsFactoryResetModalOpen(false)}
                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {factoryResetError && (
                <div
                  data-testid="factory-reset-error-banner"
                  className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{factoryResetError}</span>
                </div>
              )}

              {/* Two Reset Scopes Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  data-testid="reset-scope-local-btn"
                  onClick={() => {
                    setFactoryResetScope('LOCAL_DEVICE_RESET');
                    setFactoryResetError(null);
                  }}
                  className={`p-3.5 rounded-xl border text-start transition-all ${
                    factoryResetScope === 'LOCAL_DEVICE_RESET'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-200'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1">
                    {isAr ? 'النطاق أ — الجهاز المحلي فقط' : 'SCOPE A — LOCAL DEVICE RESET'}
                  </span>
                  <span className="text-xs font-bold text-white block">
                    {isAr ? 'مسح حالة الجهاز المحلي فقط' : 'Local Device Reset Only'}
                  </span>
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    {isAr
                      ? 'يمسح الكاش المحلي وبيانات المتصفح دون حذف سجلات الشركة على الخادم.'
                      : 'Clears local cached data and local session without deleting server-side company records.'}
                  </span>
                </button>

                <button
                  type="button"
                  data-testid="reset-scope-company-btn"
                  onClick={() => {
                    setFactoryResetScope('COMPANY_FACTORY_RESET');
                    setFactoryResetError(null);
                  }}
                  className={`p-3.5 rounded-xl border text-start transition-all ${
                    factoryResetScope === 'COMPANY_FACTORY_RESET'
                      ? 'bg-rose-500/15 border-rose-500 text-rose-200'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 block mb-1">
                    {isAr ? 'النطاق ب — إعادة ضبط الشركة بالكامل' : 'SCOPE B — COMPANY FACTORY RESET'}
                  </span>
                  <span className="text-xs font-bold text-white block">
                    {isAr ? 'تصفير الشركة بالكامل وإلغاء الجلسات' : 'Full Company Workspace Reset'}
                  </span>
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    {isAr
                      ? 'يحذف بيانات الشركة المحددة فقط ويعيدها إلى شاشة التأسيس النظيفة مع حفظ سجل التدقيق.'
                      : 'Wipes selected company data, revokes sessions, preserves audit logs & other companies.'}
                  </span>
                </button>
              </div>

              {/* Explicit Warning: What will be deleted vs What will be preserved */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1.5">
                  <span className="font-black text-rose-300 block">
                    {isAr ? 'ما الذي سيتم حذفه:' : 'What Will Be Deleted:'}
                  </span>
                  <ul className="space-y-1 text-[11px] text-neutral-300 list-disc list-inside">
                    {factoryResetScope === 'LOCAL_DEVICE_RESET' ? (
                      <>
                        <li>{isAr ? 'المنتجات والفواتير المخزنة محلياً في هذا الجهاز' : 'Local cached products, sales & cart on this device'}</li>
                        <li>{isAr ? 'العملات وأسعار الصرف المحفوظة محلياً' : 'Local cached currencies & exchange rates'}</li>
                        <li>{isAr ? 'جلسة العمل المحلية الحالية' : 'Current local device session state'}</li>
                      </>
                    ) : (
                      <>
                        <li>{isAr ? 'جميع المنتجات والعملاء والفواتير وحركات المخزون للشركة الحالية' : 'All products, customers, sales & stock movements for this company'}</li>
                        <li>{isAr ? 'جميع العملات وأسعار الصرف والحسابات المضافة في هذه الشركة' : 'All company currencies, exchange rates & employee accounts'}</li>
                        <li>{isAr ? 'إلغاء جميع الجلسات النشطة وإعادة التوجيه لشاشة التأسيس' : 'All active company sessions (revoked immediately)'}</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1.5">
                  <span className="font-black text-emerald-300 block">
                    {isAr ? 'ما الذي سيتم الحفاظ عليه:' : 'What Will Be Preserved:'}
                  </span>
                  <ul className="space-y-1 text-[11px] text-neutral-300 list-disc list-inside">
                    {factoryResetScope === 'LOCAL_DEVICE_RESET' ? (
                      <>
                        <li>{isAr ? 'حساب الشركة وسجلات الخادم' : 'Server-side company records & accounts'}</li>
                        <li>{isAr ? 'الشركات الأخرى وبيئة التدريب المعزولة' : 'Other companies & isolated Practice Mode'}</li>
                        <li>{isAr ? 'عدم إضافة أي بيانات افتراضية (0 منتجات / 0 عملات)' : 'Zero default business data injected (0 products / 0 currencies)'}</li>
                      </>
                    ) : (
                      <>
                        <li>{isAr ? 'سجلات التدقيق والامتثال الأمني (Audit Logs)' : 'Immutable compliance & security audit trail records'}</li>
                        <li>{isAr ? 'جميع الشركات الأخرى المستقلة وبياناتها' : 'All other tenant companies & isolated Practice Mode'}</li>
                        <li>{isAr ? 'عودة نظيفة 100% بدون أي بيانات افتراضية' : '100% clean onboarding state with zero default records'}</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Scope B Verification Inputs: Exact Company Name + Owner Password/PIN */}
              {factoryResetScope === 'COMPANY_FACTORY_RESET' && (
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-rose-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>
                      {isAr
                        ? `تأكيد مصادقة المالك لإعادة ضبط الشركة (${currentCompany.displayName || currentCompany.legalName})`
                        : `Owner Re-Authentication Required for (${currentCompany.displayName || currentCompany.legalName})`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                        {isAr
                          ? `اكتب اسم الشركة للتأكيد (${currentCompany.displayName || currentCompany.legalName}) *`
                          : `Type Company Name (${currentCompany.displayName || currentCompany.legalName}) *`}
                      </label>
                      <input
                        type="text"
                        data-testid="factory-reset-company-name-input"
                        value={confirmCompanyNameInput}
                        onChange={(e) => setConfirmCompanyNameInput(e.target.value)}
                        placeholder={currentCompany.displayName || currentCompany.legalName}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                        {isAr
                          ? 'كلمة مرور المالك أو رمز PIN للتأكيد *'
                          : 'Owner Password or PIN *'}
                      </label>
                      <input
                        type="password"
                        data-testid="factory-reset-password-input"
                        value={ownerPasswordInput}
                        onChange={(e) => setOwnerPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                      {isAr ? 'سبب إعادة الضبط (يُحفظ في سجل التدقيق)' : 'Reset Reason (Saved in Audit Trail)'}
                    </label>
                    <input
                      type="text"
                      data-testid="factory-reset-reason-input"
                      value={resetReasonInput}
                      onChange={(e) => setResetReasonInput(e.target.value)}
                      placeholder={
                        isAr
                          ? 'مثال: إعادة تهيئة المتجر لبداية سنة مالية جديدة'
                          : 'e.g. Clean re-initialization for production launch'
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-800">
                <TactileButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsFactoryResetModalOpen(false)}
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </TactileButton>

                <TactileButton
                  type="button"
                  variant="danger"
                  size="sm"
                  data-testid="factory-reset-confirm-btn"
                  isLoading={isExecutingReset}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={async () => {
                    setFactoryResetError(null);
                    setIsExecutingReset(true);
                    try {
                      const res = await executeAuthorizedFactoryReset({
                        scope: factoryResetScope,
                        confirmCompanyName: confirmCompanyNameInput,
                        ownerUsernameOrId: currentUser.username || currentUser.id,
                        ownerPassword: ownerPasswordInput,
                        reason: resetReasonInput,
                      });
                      if (!res.ok) {
                        setFactoryResetError(
                          res.error ||
                            (isAr
                              ? 'فشل التحقق من صلاحيات إعادة الضبط.'
                              : 'Factory reset authorization failed.')
                        );
                        return;
                      }
                      setIsFactoryResetModalOpen(false);
                    } finally {
                      setIsExecutingReset(false);
                    }
                  }}
                >
                  {factoryResetScope === 'LOCAL_DEVICE_RESET'
                    ? isAr
                      ? 'تأكيد مسح بيانات الجهاز المحلي (0 بيانات افتراضية)'
                      : 'Confirm Local Device Reset (0 Defaults)'
                    : isAr
                    ? 'تأكيد إعادة ضبط الشركة بالكامل'
                    : 'Confirm Company Factory Reset'}
                </TactileButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
