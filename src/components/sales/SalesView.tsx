/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import { getTranslation } from '../../lib/translations';
import {
  formatCurrency,
  formatPaymentMethodLabel,
  getConvertedTransactionView,
} from '../../lib/pos-calculations';
import { Transaction, SalesRateValuationMode } from '../../lib/types';
import { AppCard } from '../ui/AppCard';
import { AppInput } from '../ui/AppInput';
import { AppModal } from '../ui/AppModal';
import { TactileButton } from '../ui/TactileButton';
import { HoldToConfirm } from '../ui/HoldToConfirm';
import { ReceiptModal } from '../checkout/ReceiptModal';
import {
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  RotateCcw,
  X,
  Hash,
  Image as ImageIcon,
  AlertCircle,
  Check,
  Coins,
  TrendingUp,
  RefreshCw,
  History,
  ShieldCheck,
  ArrowRightLeft,
} from 'lucide-react';

export const SalesView: React.FC = () => {
  const {
    transactions,
    voidTransaction,
    settleTransactionDebt,
    applyNewRateToTransaction,
    applyNewRateToAllTransactions,
    settings,
    updateSettings,
    currencies,
    exchangeRates,
    updateExchangeRate,
    setActiveTab,
  } = usePOS();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'voided'>('all');
  const [valuationMode, setValuationMode] = useState<SalesRateValuationMode>('indexed');
  const [anchorCurrency, setAnchorCurrency] = useState<string>('USD');
  const [rateEditCurrency, setRateEditCurrency] = useState<string>(
    settings.currency && settings.currency !== 'SDG' ? settings.currency : 'USD'
  );
  const [rateInputDraft, setRateInputDraft] = useState<string>(() => {
    const initialCode =
      settings.currency && settings.currency !== 'SDG' ? settings.currency : 'USD';
    return String(exchangeRates[initialCode] || 2700);
  });
  const [rateSaveFeedback, setRateSaveFeedback] = useState<string | null>(null);

  const [selectedReceiptTxn, setSelectedReceiptTxn] = useState<Transaction | null>(null);
  const [previewNotificationTxn, setPreviewNotificationTxn] = useState<Transaction | null>(null);

  const activeCurrencyCodes = useMemo(() => {
    const list =
      currencies && currencies.length > 0
        ? currencies.filter((c) => c.isActive !== false).map((c) => c.code.toUpperCase())
        : ['SDG', 'USD', 'SAR', 'AED', 'EUR', 'GBP'];
    return Array.from(new Set(['SDG', ...list]));
  }, [currencies]);

  const foreignCurrencyCodes = useMemo(() => {
    const list = activeCurrencyCodes.filter((c) => c !== 'SDG');
    return list.length > 0 ? list : ['USD', 'SAR', 'AED', 'EUR', 'GBP'];
  }, [activeCurrencyCodes]);

  // Sync quick rate editor currency when active display currency or exchangeRates change
  useEffect(() => {
    const targetCode =
      settings.currency && settings.currency !== 'SDG'
        ? settings.currency.toUpperCase()
        : anchorCurrency.toUpperCase();
    setRateEditCurrency(targetCode);
    if (exchangeRates[targetCode]) {
      setRateInputDraft(String(exchangeRates[targetCode]));
    }
  }, [settings.currency, anchorCurrency, exchangeRates]);

  const handleSelectRateEditCurrency = (code: string) => {
    const clean = code.toUpperCase();
    setRateEditCurrency(clean);
    setAnchorCurrency(clean);
    setRateInputDraft(String(exchangeRates[clean] || 1));
  };

  const handleSaveQuickRate = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(rateInputDraft);
    if (!Number.isFinite(parsed) || parsed <= 0) return;

    setAnchorCurrency(rateEditCurrency);
    await updateExchangeRate({
      sourceCurrency: rateEditCurrency,
      targetCurrency: 'SDG',
      rate: parsed,
    });

    setRateSaveFeedback(
      isAr
        ? `تم تحديث سعر الصرف: 1 ${rateEditCurrency} = ${parsed} ج.س`
        : `Updated rate: 1 ${rateEditCurrency} = ${parsed} SDG`
    );
    setTimeout(() => setRateSaveFeedback(null), 3000);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        tx.id.toLowerCase().includes(q) ||
        (tx.customerName && tx.customerName.toLowerCase().includes(q)) ||
        tx.paymentMethod.toLowerCase().includes(q) ||
        (tx.transferReference && tx.transferReference.toLowerCase().includes(q));

      const matchStatus = statusFilter === 'all' || tx.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [transactions, searchQuery, statusFilter]);

  // Pre-compute converted view for each filtered transaction
  const convertedRows = useMemo(() => {
    return filteredTransactions.map((tx) => ({
      tx,
      view: getConvertedTransactionView(
        tx,
        settings.currency,
        exchangeRates,
        valuationMode,
        anchorCurrency
      ),
    }));
  }, [filteredTransactions, settings.currency, exchangeRates, valuationMode, anchorCurrency]);

  // Summary KPIs in active currency
  const salesSummary = useMemo(() => {
    let grossTotal = 0;
    let collectedTotal = 0;
    let debtTotal = 0;
    let outOfSyncCount = 0;

    for (const { tx, view } of convertedRows) {
      if (tx.status === 'completed') {
        grossTotal += view.grandTotal;
        collectedTotal += view.amountPaid;
        debtTotal += view.debtAmount;
        if (view.hasRateChanged) {
          outOfSyncCount += 1;
        }
      }
    }

    return {
      grossTotal,
      collectedTotal,
      debtTotal,
      outOfSyncCount,
    };
  }, [convertedRows]);

  const handleVoid = (id: string) => {
    voidTransaction(id);
  };

  const handleSyncAllToNewRate = () => {
    const count = applyNewRateToAllTransactions(false, anchorCurrency);
    setRateSaveFeedback(
      isAr
        ? `تم ربط وتحديث ${count} فاتورة بسعر الصرف الجديد بنجاح`
        : `Successfully linked & updated ${count} invoices to the new exchange rate`
    );
    setTimeout(() => setRateSaveFeedback(null), 3000);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-5 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {t.salesHistory}
          </h2>
          <span className="text-xs text-neutral-400">
            {isAr
              ? `${transactions.length} فاتورة مسجلة • يتم تحويل القيم والديون تلقائياً حسب العملة وسعر الصرف`
              : `${transactions.length} total orders • Totals & debts convert dynamically by currency & exchange rate`}
          </span>
        </div>

        {salesSummary.outOfSyncCount > 0 && (
          <TactileButton
            variant="amber"
            size="sm"
            onClick={handleSyncAllToNewRate}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            {isAr
              ? `تثبيت كل الفواتير والديون بالسعر الجديد (${salesSummary.outOfSyncCount})`
              : `Sync All Invoices to New Rate (${salesSummary.outOfSyncCount})`}
          </TactileButton>
        )}
      </div>

      {/* Summary KPI Cards in Active Currency */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <AppCard className="p-4 border-neutral-800 bg-neutral-900/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-neutral-400 block mb-1">
              {t.grossSales} ({settings.currency})
            </span>
            <span
              data-testid="sales-kpi-gross"
              className="text-lg sm:text-xl font-extrabold font-mono text-emerald-400 tabular-nums"
            >
              {formatCurrency(salesSummary.grossTotal, settings.currency, settings.language)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </AppCard>

        <AppCard className="p-4 border-neutral-800 bg-neutral-900/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-neutral-400 block mb-1">
              {t.totalCollectedSales} ({settings.currency})
            </span>
            <span
              data-testid="sales-kpi-collected"
              className="text-lg sm:text-xl font-extrabold font-mono text-amber-400 tabular-nums"
            >
              {formatCurrency(salesSummary.collectedTotal, settings.currency, settings.language)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
        </AppCard>

        <AppCard className="p-4 border-neutral-800 bg-neutral-900/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-neutral-400 block mb-1">
              {t.totalOutstandingDebts} ({settings.currency})
            </span>
            <span
              data-testid="sales-kpi-debt"
              className="text-lg sm:text-xl font-extrabold font-mono text-rose-400 tabular-nums"
            >
              {formatCurrency(salesSummary.debtTotal, settings.currency, settings.language)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-800/50 flex items-center justify-center text-rose-400">
            <AlertCircle className="w-5 h-5" />
          </div>
        </AppCard>
      </div>

      {/* Multi-Currency & Fluctuating Exchange Rate Control Panel */}
      <AppCard className="p-4 border-amber-500/30 bg-neutral-900/95 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* 1. Display Currency Switcher */}
          <div className="lg:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.salesDisplayCurrency}</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {activeCurrencyCodes.map((code) => {
                const isSelected = settings.currency.toUpperCase() === code;
                return (
                  <button
                    key={code}
                    type="button"
                    data-testid={`sales-currency-btn-${code}`}
                    onClick={() => updateSettings({ currency: code })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                      isSelected
                        ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-sm'
                        : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-amber-500/50 hover:text-white'
                    }`}
                  >
                    {code}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Quick Live Exchange Rate Editor */}
          <div className="lg:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.quickRateUpdate}</span>
            </label>
            <form onSubmit={handleSaveQuickRate} className="flex items-center gap-1.5">
              <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl px-2 py-1 text-xs font-mono text-neutral-300 shrink-0">
                <span>1</span>
                <select
                  aria-label="Currency to edit exchange rate"
                  value={rateEditCurrency}
                  onChange={(e) => handleSelectRateEditCurrency(e.target.value)}
                  className="bg-transparent font-bold text-amber-400 pl-1 pr-0.5 py-0.5 focus:outline-none cursor-pointer"
                >
                  {foreignCurrencyCodes.map((code) => (
                    <option key={code} value={code} className="bg-neutral-900 text-white">
                      {code}
                    </option>
                  ))}
                </select>
                <span className="mx-1">=</span>
              </div>

              <input
                type="number"
                step="any"
                min="0.0001"
                dir="ltr"
                data-testid="sales-quick-rate-input"
                value={rateInputDraft}
                onChange={(e) => setRateInputDraft(e.target.value)}
                className="w-28 px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                placeholder="2700"
              />

              <span className="text-[11px] font-mono text-neutral-400 shrink-0">SDG</span>

              <TactileButton
                type="submit"
                variant="emerald"
                size="sm"
                data-testid="sales-quick-rate-submit"
                className="shrink-0 px-3 py-1.5 text-xs"
              >
                {t.applyNewRateBtn}
              </TactileButton>
            </form>
            {rateSaveFeedback && (
              <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>{rateSaveFeedback}</span>
              </p>
            )}
          </div>

          {/* 3. Fluctuating Exchange Rate Valuation Mode Selector */}
          <div className="lg:col-span-4 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.rateValuationMode}</span>
              </label>

              {valuationMode === 'indexed' && (
                <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                  <span>{isAr ? 'العملة المرجعية:' : 'Anchor:'}</span>
                  <select
                    aria-label="Anchor Hard Currency"
                    value={anchorCurrency}
                    onChange={(e) => handleSelectRateEditCurrency(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded px-1.5 py-0.5 text-amber-400 font-mono font-bold focus:outline-none"
                  >
                    {foreignCurrencyCodes.map((c) => (
                      <option key={c} value={c} className="bg-neutral-900 text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
              <button
                type="button"
                data-testid="valuation-mode-indexed"
                onClick={() => setValuationMode('indexed')}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                  valuationMode === 'indexed'
                    ? 'bg-amber-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title={t.modeIndexedRate}
              >
                <ShieldCheck className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  {isAr ? 'ربط بالسعر الجديد' : 'Linked New Rate'}
                </span>
              </button>

              <button
                type="button"
                data-testid="valuation-mode-live"
                onClick={() => setValuationMode('live')}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                  valuationMode === 'live'
                    ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title={t.modeLiveRate}
              >
                <RefreshCw className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  {isAr ? 'تحويل مباشر' : 'Live Direct'}
                </span>
              </button>

              <button
                type="button"
                data-testid="valuation-mode-historical"
                onClick={() => setValuationMode('historical')}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                  valuationMode === 'historical'
                    ? 'bg-neutral-700 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title={t.modeHistoricalRate}
              >
                <History className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  {isAr ? 'سعر وقت الفاتورة' : 'Invoice Rate'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Contextual Explanation Banner for the Active Mode */}
        <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400">
          <div>
            {valuationMode === 'indexed' && (
              <span>
                {isAr
                  ? `وضع الحماية من تغير الصرف: يتم حفظ قيمة الفاتورة والدين بعملة (${anchorCurrency}) وقت البيع، وعند تغير سعر الصرف تتعدل القيمة تلقائياً بالسعر الجديد (${exchangeRates[anchorCurrency] || 2700} ج.س).`
                  : `Inflation-Protected Mode: Invoices & debts retain their ${anchorCurrency} value at time of sale and automatically adjust to the new exchange rate (${exchangeRates[anchorCurrency] || 2700} SDG).`}
              </span>
            )}
            {valuationMode === 'live' && (
              <span>
                {isAr
                  ? `وضع التحويل المباشر: يحول مبلغ الفاتورة المسجل مباشرة إلى (${settings.currency}) باستخدام سعر الصرف الحالي.`
                  : `Direct Live Mode: Converts the recorded invoice amount directly to ${settings.currency} using today's exchange rate.`}
              </span>
            )}
            {valuationMode === 'historical' && (
              <span>
                {isAr
                  ? `وضع السعر التاريخي: يعرض قيمة الفاتورة بسعر الصرف القديم الذي كان سارياً لحظة إصدار الفاتورة دون تأثر بتغيرات السعر اللاحقة.`
                  : `Historical Snapshot Mode: Displays invoice amounts using the exact exchange rate locked when the invoice was issued.`}
              </span>
            )}
          </div>
        </div>
      </AppCard>

      {/* Filters Strip */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <AppInput
            placeholder={t.searchTransactions}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={
              searchQuery ? (
                <button onClick={() => setSearchQuery('')} className="p-1 text-neutral-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : undefined
            }
          />
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          {(['all', 'completed', 'voided'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {st === 'all'
                ? isAr
                  ? 'الكل'
                  : 'All'
                : st === 'completed'
                ? t.completed
                : t.voided}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {convertedRows.length === 0 ? (
          <AppCard className="text-center p-12 text-xs text-neutral-500">
            {isAr ? 'لا توجد فواتير مطابقة للبحث.' : 'No transactions match your search filter.'}
          </AppCard>
        ) : (
          convertedRows.map(({ tx, view }) => {
            const isCompleted = tx.status === 'completed';
            const hasDebt = isCompleted && view.debtAmount > 0;
            const showOriginalBadge =
              view.originalCurrency !== settings.currency ||
              Math.abs(view.grandTotal - tx.grandTotal) > 0.0001;

            return (
              <AppCard
                key={tx.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-mono font-bold text-sm text-white">{tx.id}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        isCompleted
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                          : 'bg-rose-950/80 text-rose-400 border border-rose-800/50'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span className="capitalize">
                        {isCompleted ? t.completed : t.voided}
                      </span>
                    </span>

                    <span className="text-[11px] font-semibold text-amber-300 px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded">
                      {formatPaymentMethodLabel(tx.paymentMethod, settings.language)}
                    </span>

                    {tx.transferReference && (
                      <span className="text-[11px] font-mono text-neutral-300 px-2 py-0.5 bg-neutral-900 border border-neutral-750 rounded flex items-center gap-1">
                        <Hash className="w-3 h-3 text-amber-400" />
                        <span>{tx.transferReference}</span>
                      </span>
                    )}

                    {hasDebt ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-950/90 text-rose-300 border border-rose-700/70 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>
                          {t.remainingDebt}:{' '}
                          <span className="font-mono tabular-nums">
                            {formatCurrency(view.debtAmount, settings.currency, settings.language)}
                          </span>
                        </span>
                      </span>
                    ) : (
                      isCompleted && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-950/50 text-emerald-300 border border-emerald-800/40">
                          {t.paidInFull}
                        </span>
                      )
                    )}

                    {/* Original Invoice Value & Exchange Rate Snapshot Badges */}
                    {showOriginalBadge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-950 text-neutral-300 border border-neutral-800">
                        {t.originalInvoiceValue}:{' '}
                        <span className="font-mono font-semibold tabular-nums">
                          {formatCurrency(tx.grandTotal, view.originalCurrency, settings.language)}
                        </span>
                      </span>
                    )}

                    {view.hasRateChanged && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950/70 text-amber-300 border border-amber-700/50">
                        {t.invoiceHistoricalRateLabel} ({view.referenceCurrency}):{' '}
                        <span className="font-mono font-semibold tabular-nums">
                          {view.historicalRate} → {view.currentRate}
                        </span>
                        {Math.abs(view.rateDifference) > 0.0001 && (
                          <span className="mx-1 font-mono font-bold tabular-nums">
                            ({view.rateDifference > 0 ? '+' : ''}
                            {formatCurrency(
                              view.rateDifference,
                              settings.currency,
                              settings.language
                            )}
                            )
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-neutral-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono">{new Date(tx.timestamp).toLocaleString()}</span>
                    <span>·</span>
                    <span>{tx.customerName || t.walkInCustomer}</span>
                    <span>·</span>
                    <span>
                      {tx.items.reduce((acc, i) => acc + i.quantity, 0)} {t.itemsCount} (
                      {tx.items
                        .map((i) => i.productName)
                        .slice(0, 2)
                        .join(', ')}
                      {tx.items.length > 2 ? '...' : ''})
                    </span>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                  <div className="text-left sm:text-right">
                    <span
                      data-testid={`sales-row-total-${tx.id}`}
                      className="text-base font-bold font-mono text-emerald-400 tabular-nums block"
                    >
                      {formatCurrency(view.grandTotal, settings.currency, settings.language)}
                    </span>
                    {hasDebt ? (
                      <span className="text-[10px] text-rose-400 block">
                        {t.amountPaidLabel}:{' '}
                        <span className="font-mono font-semibold tabular-nums">
                          {formatCurrency(view.amountPaid, settings.currency, settings.language)}
                        </span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-500 block">
                        {t.tax}:{' '}
                        <span className="font-mono tabular-nums">
                          {formatCurrency(view.taxAmount, settings.currency, settings.language)}
                        </span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {isCompleted && view.hasRateChanged && (
                      <TactileButton
                        variant="secondary"
                        size="sm"
                        onClick={() => applyNewRateToTransaction(tx.id, anchorCurrency)}
                        leftIcon={<RefreshCw className="w-3.5 h-3.5 text-amber-400" />}
                        title={t.syncInvoiceToNewRate}
                      >
                        {t.syncInvoiceToNewRate}
                      </TactileButton>
                    )}

                    {tx.transferReceiptImage && (
                      <TactileButton
                        variant="secondary"
                        size="sm"
                        onClick={() => setPreviewNotificationTxn(tx)}
                        leftIcon={<ImageIcon className="w-3.5 h-3.5 text-amber-400" />}
                      >
                        {t.transferReceiptImage}
                      </TactileButton>
                    )}

                    {hasDebt && (
                      <TactileButton
                        variant="emerald"
                        size="sm"
                        onClick={() =>
                          settleTransactionDebt(
                            tx.id,
                            valuationMode === 'indexed',
                            anchorCurrency
                          )
                        }
                        leftIcon={<Check className="w-3.5 h-3.5" />}
                      >
                        {t.settleDebt}
                      </TactileButton>
                    )}

                    <TactileButton
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedReceiptTxn(tx)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      {isAr ? 'الفاتورة' : 'Receipt'}
                    </TactileButton>

                    {isCompleted && (
                      <HoldToConfirm
                        onConfirm={() => handleVoid(tx.id)}
                        label={isAr ? 'إلغاء' : 'Void'}
                        confirmingLabel={isAr ? 'جارٍ الإلغاء...' : 'Voiding...'}
                        confirmedLabel={isAr ? 'ملغاة' : 'Voided'}
                        variant="danger"
                        className="py-1 px-3 text-xs min-h-[36px]"
                        icon={<RotateCcw className="w-3.5 h-3.5" />}
                      />
                    )}
                  </div>
                </div>
              </AppCard>
            );
          })
        )}
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(selectedReceiptTxn)}
        onClose={() => setSelectedReceiptTxn(null)}
        transaction={selectedReceiptTxn}
        valuationMode={valuationMode}
        anchorCurrency={anchorCurrency}
        onNewSale={() => {
          setSelectedReceiptTxn(null);
          setActiveTab('checkout');
        }}
      />

      {/* Transfer Notification Image Preview Modal */}
      <AppModal
        isOpen={Boolean(previewNotificationTxn)}
        onClose={() => setPreviewNotificationTxn(null)}
        title={`${t.transferReceiptImage} • ${previewNotificationTxn?.id || ''}`}
        description={
          previewNotificationTxn?.transferReference
            ? `${t.transferReference}: ${previewNotificationTxn.transferReference}`
            : undefined
        }
        maxWidth="md"
      >
        {previewNotificationTxn?.transferReceiptImage && (
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 flex items-center justify-center max-h-[65vh]">
              <img
                src={previewNotificationTxn.transferReceiptImage}
                alt={t.transferReceiptImage}
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>
            <div className="flex justify-end">
              <TactileButton
                variant="secondary"
                size="sm"
                onClick={() => setPreviewNotificationTxn(null)}
              >
                {isAr ? 'إغلاق' : 'Close'}
              </TactileButton>
            </div>
          </div>
        )}
      </AppModal>
    </div>
  );
};


