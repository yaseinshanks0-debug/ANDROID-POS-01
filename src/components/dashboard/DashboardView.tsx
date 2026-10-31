/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { getTranslation } from '../../lib/translations';
import { formatCurrency } from '../../lib/pos-calculations';
import { AppCard } from '../ui/AppCard';
import { TactileButton } from '../ui/TactileButton';
import { ScrambleText } from '../ui/ScrambleText';
import { ReceiptModal } from '../checkout/ReceiptModal';
import { Transaction } from '../../lib/types';
import {
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Barcode,
  Layers,
  Receipt,
  CheckCircle2,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { transactions, products, settings, setActiveTab } = usePOS();
  const t = getTranslation(settings.language);

  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // Compute live actual metrics from real transactions store
  const todayMetrics = useMemo(() => {
    const today = new Date().toDateString();
    const todayTxns = transactions.filter(
      (tx) => new Date(tx.timestamp).toDateString() === today && tx.status === 'completed'
    );

    const todayGross = todayTxns.reduce((acc, curr) => acc + curr.grandTotal, 0);
    const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert).length;

    return {
      salesTotal: Math.round(todayGross * 100) / 100,
      txCount: todayTxns.length,
      totalProducts: products.length,
      lowStockCount,
      recentTxns: transactions.slice(0, 5),
    };
  }, [transactions, products]);

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6 pb-24">
      {/* Welcome & Terminal Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 p-5 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
              POS Terminal 01
            </span>
            <span className="text-neutral-600">/</span>
            <span className="text-xs text-neutral-400 font-mono">
              <ScrambleText text="SYSTEM ACTIVE" speed={25} />
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {settings.language === 'ar' ? settings.storeNameAr : settings.storeName}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <TactileButton
            variant="amber"
            size="md"
            onClick={() => setActiveTab('checkout')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            {t.newSale}
          </TactileButton>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Today's Sales */}
        <AppCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-400">{t.todaySales}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight tabular-nums">
              {formatCurrency(todayMetrics.salesTotal, settings.currency, settings.language)}
            </div>
            <span className="text-[11px] text-neutral-500 font-medium mt-1 block">
              {todayMetrics.txCount} {t.completed.toLowerCase()}
            </span>
          </div>
        </AppCard>

        {/* Transactions Today */}
        <AppCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-400">{t.todayTransactions}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight tabular-nums">
              {todayMetrics.txCount}
            </div>
            <span className="text-[11px] text-neutral-500 font-medium mt-1 block">
              Audited in local journal
            </span>
          </div>
        </AppCard>

        {/* Total Products */}
        <AppCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-400">{t.totalProducts}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight tabular-nums">
              {todayMetrics.totalProducts}
            </div>
            <span className="text-[11px] text-neutral-500 font-medium mt-1 block">
              Across active categories
            </span>
          </div>
        </AppCard>

        {/* Low Stock Alerts */}
        <AppCard
          className={`flex flex-col justify-between ${
            todayMetrics.lowStockCount > 0 ? 'border-amber-500/50 bg-amber-950/20' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-400">{t.lowStockAlerts}</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div
              className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight tabular-nums ${
                todayMetrics.lowStockCount > 0 ? 'text-amber-400' : 'text-neutral-400'
              }`}
            >
              {todayMetrics.lowStockCount}
            </div>
            <span className="text-[11px] text-neutral-500 font-medium mt-1 block">
              Requires restock action
            </span>
          </div>
        </AppCard>
      </div>

      {/* Quick Shortcuts Bar */}
      <div>
        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
          {t.quickShortcuts}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('checkout')}
            className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-left transition-all active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">{t.newSale}</span>
              <span className="text-[11px] text-neutral-500">Open register</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-left transition-all active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">{t.addProduct}</span>
              <span className="text-[11px] text-neutral-500">Catalog items</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-left transition-all active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">{t.stockAudit}</span>
              <span className="text-[11px] text-neutral-500">Restock & counts</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('sales')}
            className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-left transition-all active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">{t.salesHistory}</span>
              <span className="text-[11px] text-neutral-500">Slips & refunds</span>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Transactions Feed */}
      <AppCard>
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-white">{t.recentTransactions}</h3>
          </div>
          <button
            onClick={() => setActiveTab('sales')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-neutral-800/80 mt-2">
          {todayMetrics.recentTxns.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              {t.noRecentTransactions}
            </div>
          ) : (
            todayMetrics.recentTxns.map((tx) => (
              <div
                key={tx.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedTxn(tx)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-neutral-850/60 -mx-2 px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-white">{tx.id}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        tx.status === 'completed'
                          ? 'bg-emerald-950/80 text-emerald-400'
                          : 'bg-rose-950/80 text-rose-400'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    {tx.customerName || 'Walk-in'} • {tx.items.length} items •{' '}
                    {new Date(tx.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                    {formatCurrency(tx.grandTotal, settings.currency, settings.language)}
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">
                    {tx.paymentMethod}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </AppCard>

      {/* Receipt Modal on Click */}
      <ReceiptModal
        isOpen={Boolean(selectedTxn)}
        onClose={() => setSelectedTxn(null)}
        transaction={selectedTxn}
        onNewSale={() => {
          setSelectedTxn(null);
          setActiveTab('checkout');
        }}
      />
    </div>
  );
};
