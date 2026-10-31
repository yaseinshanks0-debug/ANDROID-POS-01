/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { usePOS } from '../../context/POSContext';
import { getTranslation } from '../../lib/translations';
import { formatCurrency } from '../../lib/pos-calculations';
import { TactileButton } from '../ui/TactileButton';
import { ShoppingBag, Globe, Wifi, Coins } from 'lucide-react';

export const AppHeader: React.FC<{ onOpenCart?: () => void }> = ({ onOpenCart }) => {
  const { settings, updateSettings, currencies, cartTotals, cart, activeTab, setActiveTab } = usePOS();
  const t = getTranslation(settings.language);

  const toggleLanguage = () => {
    updateSettings({ language: settings.language === 'en' ? 'ar' : 'en' });
  };

  const activeCurrencyCodes =
    currencies && currencies.length > 0
      ? currencies.filter((c) => c.isActive !== false).map((c) => c.code)
      : ['SDG', 'USD', 'SAR', 'AED', 'EUR', 'GBP'];

  return (
    <header className="sticky top-0 z-30 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3 pt-safe">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
            aria-label="Go to Dashboard"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-neutral-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
              {settings.storeLogo ? (
                <img
                  src={settings.storeLogo}
                  alt={settings.language === 'ar' ? settings.storeNameAr : settings.storeName}
                  className="w-full h-full object-contain bg-neutral-950 p-0.5"
                />
              ) : (
                <span className="font-mono text-base">DQ</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                  {settings.language === 'ar' ? settings.storeNameAr : settings.storeName}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-md">
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <span>ONLINE</span>
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-medium hidden xs:block truncate max-w-[200px] sm:max-w-xs">
                {t.tagline}
              </p>
            </div>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Currency Switcher */}
          <div className="relative flex items-center">
            <Coins className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 pointer-events-none" />
            <select
              aria-label="Active Currency"
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value })}
              className="min-h-[36px] pl-7 pr-2.5 py-1 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/60 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {activeCurrencyCodes.map((code) => (
                <option key={code} value={code} className="bg-neutral-900 text-white">
                  {code}
                </option>
              ))}
            </select>
          </div>

          {/* Language Switcher */}
          <TactileButton
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="font-medium text-neutral-300 hover:text-white"
            aria-label={`Switch language to ${settings.language === 'en' ? 'Arabic' : 'English'}`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="font-mono text-xs">{settings.language === 'en' ? 'العربية' : 'EN'}</span>
          </TactileButton>

          {/* Quick Cart Trigger (especially on mobile/compact screens) */}
          <TactileButton
            variant={cart.length > 0 ? 'amber' : 'secondary'}
            size="sm"
            onClick={() => {
              if (activeTab !== 'checkout') setActiveTab('checkout');
              onOpenCart?.();
            }}
            className="relative font-mono font-semibold"
            aria-label={`Cart contains ${cartTotals.totalItemsCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="tabular-nums">
              {formatCurrency(cartTotals.grandTotal, settings.currency, settings.language)}
            </span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-neutral-950">
                {cartTotals.totalItemsCount}
              </span>
            )}
          </TactileButton>
        </div>
      </div>
    </header>
  );
};
