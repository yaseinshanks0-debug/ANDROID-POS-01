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
} from 'lucide-react';
import { playTactileClick } from '../../lib/sound-fx';
import { ExchangeRateSettings } from './ExchangeRateSettings';

export const SettingsView: React.FC = () => {
  const {
    settings,
    currencies: contextCurrencies,
    updateSettings,
    resetAllData,
    syncTransactions,
    isSyncing,
    lastSyncedAt,
  } = usePOS();
  const t = getTranslation(settings.language);

  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>(() =>
    contextCurrencies && contextCurrencies.length > 0
      ? contextCurrencies.map((c) => c.code)
      : ['SDG', 'USD', 'SAR', 'AED', 'EUR', 'GBP']
  );

  React.useEffect(() => {
    if (contextCurrencies && contextCurrencies.length > 0) {
      setAvailableCurrencies(contextCurrencies.map((c) => c.code));
    }
  }, [contextCurrencies]);

  const handleCurrenciesUpdated = useCallback((currList: Currency[]) => {
    if (currList && currList.length > 0) {
      setAvailableCurrencies(currList.map((c) => c.code));
    }
  }, []);

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
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 space-y-6 pb-28">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          {t.systemSettings}
        </h2>
        <span className="text-xs text-neutral-400">
          Hardware preferences, localization, tax policies and sync state
        </span>
      </div>

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
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Offline Durable Engine Active</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Local journal persists all transactions, catalog changes, and movements on Android storage.
              {lastSyncedAt && ` Last synced: ${lastSyncedAt.toLocaleTimeString()}`}
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

        {/* Factory Reset Safety Zone */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-rose-400 block">Factory Reset</span>
            <span className="text-[11px] text-neutral-500">
              Clear all sales, custom products, customers and restore initial seeds
            </span>
          </div>

          <HoldToConfirm
            onConfirm={resetAllData}
            label={t.resetData}
            confirmingLabel="Erasing data..."
            confirmedLabel="Reset Complete"
            variant="danger"
            className="w-full sm:w-auto text-xs min-h-[38px]"
          />
        </div>
      </AppCard>
    </div>
  );
};
