/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { usePOS } from '../../context/POSContext';
import { getTranslation } from '../../lib/translations';
import {
  formatCurrency,
  getConvertedTransactionView,
  computeDailyRevenueTrends,
  DailyRevenueTrendPoint,
} from '../../lib/pos-calculations';
import { AppCard } from '../ui/AppCard';
import { TactileButton } from '../ui/TactileButton';
import { ScrambleText } from '../ui/ScrambleText';
import { ReceiptModal } from '../checkout/ReceiptModal';
import { Transaction } from '../../lib/types';
import {
  computeExpensesSummary,
} from '../../lib/expense-calculations';
import {
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Layers,
  Receipt,
  Wallet,
  Award,
  Activity,
  Calendar,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { transactions, expenses, products, settings, exchangeRates, setActiveTab } = usePOS();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [rangeDays, setRangeDays] = useState<7 | 14 | 30>(7);
  const [showCollectedCurve, setShowCollectedCurve] = useState<boolean>(true);
  const [chartVisualMode, setChartVisualMode] = useState<'area' | 'composed'>('area');
  const [activePointKey, setActivePointKey] = useState<string | null>(null);

  // Compute live actual metrics from real transactions store using saved sale exchange rate
  const todayMetrics = useMemo(() => {
    const today = new Date().toDateString();
    const todayTxns = transactions.filter(
      (tx) => new Date(tx.timestamp).toDateString() === today && tx.status === 'completed'
    );

    const todayGross = todayTxns.reduce((acc, curr) => {
      const converted = getConvertedTransactionView(
        curr,
        settings.currency,
        exchangeRates,
        'historical'
      );
      return acc + converted.grandTotal;
    }, 0);
    const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert).length;

    const expSummary = computeExpensesSummary(
      expenses || [],
      settings.currency,
      exchangeRates,
      'historical'
    );

    return {
      salesTotal: Math.round(todayGross * 100) / 100,
      txCount: todayTxns.length,
      todayExpenses: expSummary.todayExpenses,
      totalExpenses: expSummary.totalExpenses,
      totalProducts: products.length,
      lowStockCount,
      recentTxns: transactions.slice(0, 5),
    };
  }, [transactions, expenses, products, settings.currency, exchangeRates]);

  // Compute D3 Daily Revenue Trends & Performance Peaks
  const trendSummary = useMemo(() => {
    return computeDailyRevenueTrends(
      transactions,
      rangeDays,
      settings.currency,
      exchangeRates,
      'historical',
      settings.language
    );
  }, [transactions, rangeDays, settings.currency, exchangeRates, settings.language]);

  const rechartsData = useMemo(() => {
    return trendSummary.points.map((pt) => ({
      ...pt,
      name: pt.label,
      grossRevenue: Math.round(pt.revenue * 100) / 100,
      collectedCash: Math.round(pt.collected * 100) / 100,
      remainingDebt: Math.round(pt.debt * 100) / 100,
    }));
  }, [trendSummary]);

  const inspectedPoint = useMemo(() => {
    if (activePointKey) {
      const match = trendSummary.points.find((p) => p.dateKey === activePointKey);
      if (match) return match;
    }
    return (
      trendSummary.peakPoint ||
      trendSummary.points[trendSummary.points.length - 1] ||
      null
    );
  }, [activePointKey, trendSummary]);

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
            {isAr ? settings.storeNameAr : settings.storeName}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <TactileButton
            variant="secondary"
            size="md"
            onClick={() => setActiveTab('expenses')}
            leftIcon={<Wallet className="w-4 h-4 text-rose-400" />}
          >
            {isAr ? 'بند المنصرفات' : 'Expenses'}
          </TactileButton>
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
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight tabular-nums">
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
              {isAr ? 'مقيّدة في السجل المحلي' : 'Audited in local journal'}
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
              {isAr ? 'ضمن التصنيفات النشطة' : 'Across active categories'}
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
              {isAr ? 'تتطلب إعادة التزويد' : 'Requires restock action'}
            </span>
          </div>
        </AppCard>
      </div>

      {/* D3.js Daily Revenue Trends & Performance Peaks Chart */}
      <AppCard
        data-testid="dashboard-revenue-chart-card"
        className="space-y-4 border-neutral-800 bg-neutral-900/95"
      >
        {/* Header & Range Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  {isAr
                    ? 'الأداء اليومي للمبيعات واتجاهات الإيرادات (Recharts)'
                    : 'Daily Sales Performance & Revenue Trends'}
                </h3>
                <p className="text-[11px] text-neutral-400">
                  {isAr
                    ? `رسم بياني تفاعلي للمبيعات اليومية (${settings.currency}) محسوباً بسعر الصرف المحفوظ لكل فاتورة`
                    : `Interactive Recharts daily sales & revenue trajectory (${settings.currency}) valued at each invoice's saved exchange rate`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Visual Mode Switcher: Area vs Composed Bars */}
            <div className="inline-flex items-center rounded-xl bg-neutral-950 p-1 border border-neutral-800">
              <button
                type="button"
                data-testid="chart-mode-area-btn"
                onClick={() => setChartVisualMode('area')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartVisualMode === 'area'
                    ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {isAr ? 'منحنى مساحي' : 'Area Trend'}
              </button>
              <button
                type="button"
                data-testid="chart-mode-composed-btn"
                onClick={() => setChartVisualMode('composed')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartVisualMode === 'composed'
                    ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {isAr ? 'أعمدة + اتجاه' : 'Bars + Line'}
              </button>
            </div>

            {/* Toggle Collected Cash Line */}
            <button
              type="button"
              data-testid="toggle-collected-curve-btn"
              onClick={() => setShowCollectedCurve((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                showCollectedCurve
                  ? 'bg-sky-950/60 border-sky-500/40 text-sky-300'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  showCollectedCurve ? 'bg-sky-400' : 'bg-neutral-600'
                }`}
              />
              <span>{isAr ? 'المبيعات المحصلة' : 'Collected Cash'}</span>
            </button>

            {/* Range Selector: 7D / 14D / 30D */}
            <div className="inline-flex items-center rounded-xl bg-neutral-950 p-1 border border-neutral-800">
              {([7, 14, 30] as const).map((days) => {
                const isSelected = rangeDays === days;
                return (
                  <button
                    key={days}
                    type="button"
                    data-testid={`chart-range-${days}d`}
                    onClick={() => {
                      setRangeDays(days);
                      setActivePointKey(null);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-neutral-950 shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {isAr ? `${days} يوم` : `${days}D`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Peak & Trend Summary Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Peak Day Badge */}
          <div
            data-testid="dashboard-peak-revenue-badge"
            className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>{isAr ? 'ذروة الأداء (أعلى يوم)' : 'Peak Performance Day'}</span>
              </div>
              <div className="text-lg font-extrabold text-white tabular-nums mt-1">
                {formatCurrency(
                  trendSummary.peakPoint?.revenue || 0,
                  settings.currency,
                  settings.language
                )}
              </div>
              <div className="text-[11px] text-amber-300/80 font-medium mt-0.5">
                {trendSummary.peakPoint
                  ? `${trendSummary.peakPoint.weekdayLabel} • ${trendSummary.peakPoint.label} (${trendSummary.peakPoint.transactionCount} ${
                      isAr
                        ? trendSummary.peakPoint.transactionCount === 1
                          ? 'فاتورة'
                          : 'فواتير'
                        : trendSummary.peakPoint.transactionCount === 1
                        ? 'order'
                        : 'orders'
                    })`
                  : isAr
                  ? 'لا توجد مبيعات في هذه الفترة'
                  : 'No sales in period'}
              </div>
            </div>
            {trendSummary.peakPoint && (
              <button
                type="button"
                onClick={() => setActivePointKey(trendSummary.peakPoint?.dateKey || null)}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[11px] font-bold text-amber-300 transition-colors shrink-0"
              >
                {isAr ? 'تحديد الذروة' : 'Focus Peak'}
              </button>
            )}
          </div>

          {/* Daily Average Badge */}
          <div
            data-testid="dashboard-avg-revenue-badge"
            className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'المتوسط اليومي' : 'Daily Average'}</span>
              </div>
              <div className="text-lg font-extrabold text-emerald-400 tabular-nums mt-1">
                {formatCurrency(
                  trendSummary.averageDailyRevenue,
                  settings.currency,
                  settings.language
                )}
              </div>
              <div className="text-[11px] text-neutral-500 font-medium mt-0.5">
                {isAr ? 'متوسط الأيام النشطة:' : 'Active days avg:'}{' '}
                <span className="text-neutral-300 tabular-nums">
                  {formatCurrency(
                    trendSummary.activeDaysAverageRevenue,
                    settings.currency,
                    settings.language
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Period Total & Momentum */}
          <div
            data-testid="dashboard-period-total-badge"
            className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                <span>
                  {isAr
                    ? `إجمالي إيرادات (${rangeDays} يوم)`
                    : `Period Total (${rangeDays}D)`}
                </span>
              </div>
              <div className="text-lg font-extrabold text-white tabular-nums mt-1">
                {formatCurrency(
                  trendSummary.totalRevenue,
                  settings.currency,
                  settings.language
                )}
              </div>
              <div className="text-[11px] text-neutral-500 font-medium mt-0.5">
                {trendSummary.totalTransactions}{' '}
                {isAr ? 'عملية مكتملة' : 'completed transactions'}
              </div>
            </div>

            <div
              className={`px-2.5 py-1 rounded-xl text-xs font-extrabold tabular-nums border ${
                trendSummary.growthPercent >= 0
                  ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-950/60 border-rose-500/30 text-rose-400'
              }`}
            >
              {trendSummary.growthPercent >= 0 ? '+' : ''}
              {trendSummary.growthPercent}%
            </div>
          </div>
        </div>

        {/* Recharts Daily Sales Performance Visualization */}
        <div
          data-testid="recharts-daily-sales-container"
          className="relative rounded-2xl bg-neutral-950/90 border border-neutral-800/90 p-3 sm:p-4 overflow-hidden h-[270px] w-full"
          dir="ltr"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={rechartsData}
              margin={{ top: 16, right: 16, left: 4, bottom: 6 }}
              onClick={(state: any) => {
                const clickedKey = state?.activePayload?.[0]?.payload?.dateKey;
                if (clickedKey) {
                  setActivePointKey(clickedKey);
                }
              }}
            >
              <defs>
                <linearGradient id="rechartsRevenueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.42} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="rechartsBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.35} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#262626" strokeDasharray="4 4" vertical={false} />

              <XAxis
                dataKey="label"
                stroke="#737373"
                tick={{ fill: '#a3a3a3', fontSize: 11, fontWeight: 600 }}
                tickLine={false}
                axisLine={{ stroke: '#262626' }}
              />

              <YAxis
                stroke="#737373"
                tick={{ fill: '#737373', fontSize: 11, fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val: number) =>
                  val >= 1000 ? `${(val / 1000).toFixed(1)}k` : String(Math.round(val))
                }
              />

              <Tooltip
                cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const pt = payload[0].payload as DailyRevenueTrendPoint;
                  return (
                    <div
                      dir={isAr ? 'rtl' : 'ltr'}
                      className="rounded-xl bg-neutral-900/95 border border-neutral-700 px-3.5 py-2.5 shadow-xl text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-4 border-b border-neutral-800 pb-1">
                        <span className="font-extrabold text-white">
                          {pt.weekdayLabel} • {pt.label}
                        </span>
                        <span className="font-mono text-[10px] text-amber-400 font-bold">
                          {pt.transactionCount} {isAr ? 'فواتير' : 'orders'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-neutral-400">
                          {isAr ? 'إجمالي المبيعات:' : 'Gross Sales:'}
                        </span>
                        <span className="font-extrabold text-emerald-400 tabular-nums">
                          {formatCurrency(pt.revenue, settings.currency, settings.language)}
                        </span>
                      </div>
                      {showCollectedCurve && (
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-neutral-400">
                            {isAr ? 'المحصل نقداً/بنكياً:' : 'Collected:'}
                          </span>
                          <span className="font-bold text-sky-400 tabular-nums">
                            {formatCurrency(pt.collected, settings.currency, settings.language)}
                          </span>
                        </div>
                      )}
                      {pt.debt > 0 && (
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-neutral-400">
                            {isAr ? 'آجل / ذمم:' : 'Remaining Debt:'}
                          </span>
                          <span className="font-bold text-amber-400 tabular-nums">
                            {formatCurrency(pt.debt, settings.currency, settings.language)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }}
              />

              {trendSummary.averageDailyRevenue > 0 && (
                <ReferenceLine
                  y={trendSummary.averageDailyRevenue}
                  stroke="#f59e0b"
                  strokeDasharray="6 4"
                  strokeOpacity={0.65}
                />
              )}

              {chartVisualMode === 'area' ? (
                <Area
                  type="monotone"
                  dataKey="grossRevenue"
                  name={isAr ? 'إجمالي المبيعات' : 'Gross Revenue'}
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#rechartsRevenueAreaGrad)"
                  activeDot={{
                    r: 6,
                    fill: '#f59e0b',
                    stroke: '#fef3c7',
                    strokeWidth: 2,
                    onClick: (_e: any, dotPayload: any) => {
                      if (dotPayload?.payload?.dateKey) {
                        setActivePointKey(dotPayload.payload.dateKey);
                      }
                    },
                  }}
                />
              ) : (
                <>
                  <Bar
                    dataKey="grossRevenue"
                    name={isAr ? 'إجمالي المبيعات' : 'Gross Revenue'}
                    fill="url(#rechartsBarGrad)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36}
                  />
                  <Line
                    type="monotone"
                    dataKey="grossRevenue"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#f59e0b' }}
                  />
                </>
              )}

              {showCollectedCurve && (
                <Line
                  type="monotone"
                  dataKey="collectedCash"
                  name={isAr ? 'المبيعات المحصلة' : 'Collected Cash'}
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={{ r: 3, fill: '#0284c7', stroke: '#bae6fd', strokeWidth: 1.5 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Interactive Point / Peak Day Inspector Footer */}
        {inspectedPoint && (
          <div
            data-testid="dashboard-chart-inspector"
            className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                  inspectedPoint.isPeak
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                    : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                }`}
              >
                {inspectedPoint.isPeak ? '★' : inspectedPoint.transactionCount}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-white">
                    {inspectedPoint.weekdayLabel} • {inspectedPoint.label}
                  </span>
                  {inspectedPoint.isPeak && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {isAr ? 'ذروة المبيعات' : 'Performance Peak'}
                    </span>
                  )}
                  {inspectedPoint.isToday && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">
                      {isAr ? 'اليوم' : 'Today'}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-neutral-400 block mt-0.5">
                  {inspectedPoint.transactionCount}{' '}
                  {isAr ? 'فواتير مكتملة' : 'completed orders'} •{' '}
                  {isAr ? 'متوسط الفاتورة:' : 'Avg order:'}{' '}
                  <strong className="text-neutral-200 tabular-nums">
                    {formatCurrency(
                      inspectedPoint.avgOrderValue,
                      settings.currency,
                      settings.language
                    )}
                  </strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/80">
              <div>
                <span className="text-[10px] text-neutral-500 font-semibold block">
                  {isAr ? 'إجمالي اليوم' : 'Day Revenue'}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-400 tabular-nums">
                  {formatCurrency(
                    inspectedPoint.revenue,
                    settings.currency,
                    settings.language
                  )}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 font-semibold block">
                  {isAr ? 'المحصل نقداً/بنكياً' : 'Collected'}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-sky-400 tabular-nums">
                  {formatCurrency(
                    inspectedPoint.collected,
                    settings.currency,
                    settings.language
                  )}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 font-semibold block">
                  {isAr ? 'الديون المتبقية' : 'Remaining Debt'}
                </span>
                <span
                  className={`text-xs sm:text-sm font-extrabold tabular-nums ${
                    inspectedPoint.debt > 0 ? 'text-amber-400' : 'text-neutral-400'
                  }`}
                >
                  {formatCurrency(
                    inspectedPoint.debt,
                    settings.currency,
                    settings.language
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </AppCard>

      {/* Quick Shortcuts Bar */}
      <div>
        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
          {t.quickShortcuts}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => setActiveTab('checkout')}
            className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-left transition-all active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">{t.newSale}</span>
              <span className="text-[11px] text-neutral-500">
                {isAr ? 'فتح نقطة البيع' : 'Open register'}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-rose-500/40 text-left transition-all active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">
                {isAr ? 'المنصرفات' : 'Expenses'}
              </span>
              <span className="text-[11px] text-rose-400 font-mono">
                {formatCurrency(todayMetrics.todayExpenses, settings.currency, settings.language)}
              </span>
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
              <span className="text-[11px] text-neutral-500">
                {isAr ? 'إدارة الأصناف' : 'Catalog items'}
              </span>
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
              <span className="text-[11px] text-neutral-500">
                {isAr ? 'الجرد والتوريد' : 'Restock & counts'}
              </span>
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
              <span className="text-[11px] text-neutral-500">
                {isAr ? 'الفواتير والمرتجعات' : 'Slips & refunds'}
              </span>
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
            <span>{isAr ? 'عرض الكل' : 'View All'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-neutral-800/80 mt-2">
          {todayMetrics.recentTxns.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              {t.noRecentTransactions}
            </div>
          ) : (
            todayMetrics.recentTxns.map((tx) => {
              const convertedTx = getConvertedTransactionView(
                tx,
                settings.currency,
                exchangeRates,
                'historical'
              );
              return (
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
                    <div className="text-sm font-bold text-emerald-400 tabular-nums">
                      {formatCurrency(
                        convertedTx.grandTotal,
                        settings.currency,
                        settings.language
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                      {tx.paymentMethod}
                    </span>
                  </div>
                </div>
              );
            })
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

