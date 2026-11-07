/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { formatCurrency } from '../../lib/pos-calculations';
import { AppLanguage, SupportedCurrency } from '../../lib/types';
import {
  DailyIntradayCandlestick,
  ForecastPoint,
  ProductInventoryAnalyticsItem,
  TechnicalIndicatorPoint,
} from '../../analytics/analytics.types';

interface TechnicalTrendOverlayChartProps {
  series: TechnicalIndicatorPoint[];
  supportFloor: number;
  resistanceCeiling: number;
  currency: SupportedCurrency;
  language: AppLanguage;
}

export function TechnicalTrendOverlayChart({
  series,
  supportFloor,
  resistanceCeiling,
  currency,
  language,
}: TechnicalTrendOverlayChartProps) {
  const isAr = language === 'ar';
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isExpandedModalOpen, setIsExpandedModalOpen] = useState(false);
  const [viewFilter, setViewFilter] = useState<'all' | 'active_only' | 'last_14' | 'last_7'>('all');
  const [visibleLines, setVisibleLines] = useState({
    netSales: true,
    sma7: true,
    ema7: true,
    trendline: true,
    supportResistance: true,
  });

  const filteredSeries = useMemo(() => {
    if (!series || series.length === 0) return [];
    if (viewFilter === 'active_only') {
      const active = series.filter((p) => p.value > 0 || (p.transactionCount ?? 0) > 0);
      return active.length > 0 ? active : series;
    }
    if (viewFilter === 'last_7') {
      return series.slice(-7);
    }
    if (viewFilter === 'last_14') {
      return series.slice(-14);
    }
    return series;
  }, [series, viewFilter]);

  if (!filteredSeries || filteredSeries.length === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-xs text-slate-400">
        {isAr ? 'لا توجد بيانات زمنية كافية للرسم البياني' : 'Insufficient time-series data for chart'}
      </div>
    );
  }

  const width = 760;
  const height = 260;
  const padLeft = 58;
  const padRight = 24;
  const padTop = 24;
  const padBottom = 36;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const allVals = filteredSeries.flatMap((p) =>
    [
      visibleLines.netSales ? p.value : null,
      visibleLines.sma7 ? p.sma7 : null,
      visibleLines.ema7 ? p.ema7 : null,
      visibleLines.trendline ? p.trendlineValue : null,
      visibleLines.supportResistance ? supportFloor : null,
      visibleLines.supportResistance ? resistanceCeiling : null,
    ].filter((v): v is number => v !== null && Number.isFinite(v))
  );
  const maxVal = Math.max(10, ...allVals) * 1.15;

  const xAt = (i: number) =>
    filteredSeries.length <= 1
      ? padLeft + plotW / 2
      : padLeft + (i / (filteredSeries.length - 1)) * plotW;
  const yAt = (v: number) => padTop + plotH - Math.min(1, Math.max(0, v / maxVal)) * plotH;

  const buildPath = (getter: (p: TechnicalIndicatorPoint) => number | null) => {
    const segments: string[] = [];
    let started = false;
    filteredSeries.forEach((pt, idx) => {
      const val = getter(pt);
      if (val === null || !Number.isFinite(val)) {
        started = false;
        return;
      }
      const x = xAt(idx).toFixed(1);
      const y = yAt(val).toFixed(1);
      segments.push(`${started ? 'L' : 'M'} ${x} ${y}`);
      started = true;
    });
    return segments.join(' ');
  };

  const mainLinePath = visibleLines.netSales ? buildPath((p) => p.value) : '';
  const areaPath =
    mainLinePath.length > 0
      ? `${mainLinePath} L ${xAt(filteredSeries.length - 1).toFixed(1)} ${(padTop + plotH).toFixed(
          1
        )} L ${xAt(0).toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`
      : '';
  const sma7Path = visibleLines.sma7 ? buildPath((p) => p.sma7) : '';
  const ema7Path = visibleLines.ema7 ? buildPath((p) => p.ema7) : '';
  const trendPath = visibleLines.trendline ? buildPath((p) => p.trendlineValue) : '';

  const effectiveIdx =
    selectedIdx !== null && filteredSeries[selectedIdx]
      ? selectedIdx
      : hoverIdx !== null && filteredSeries[hoverIdx]
      ? hoverIdx
      : filteredSeries.length - 1;
  const activePoint = filteredSeries[effectiveIdx] || filteredSeries[filteredSeries.length - 1];
  const pinnedPoint = selectedIdx !== null && filteredSeries[selectedIdx] ? filteredSeries[selectedIdx] : null;

  const resolveIndexFromClientX = (clientX: number, targetSvg: SVGSVGElement | null) => {
    if (!targetSvg || filteredSeries.length === 0) return null;
    const rect = targetSvg.getBoundingClientRect();
    if (rect.width <= 0) return null;
    const relX = ((clientX - rect.left) / rect.width) * width;
    const clampedPlotX = Math.max(0, Math.min(plotW, relX - padLeft));
    if (filteredSeries.length === 1) return 0;
    const ratio = clampedPlotX / plotW;
    return Math.min(
      filteredSeries.length - 1,
      Math.max(0, Math.round(ratio * (filteredSeries.length - 1)))
    );
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const idx = resolveIndexFromClientX(e.clientX, e.currentTarget);
    if (idx !== null) {
      setSelectedIdx(idx);
      setHoverIdx(idx);
    }
  };

  const toggleLine = (key: keyof typeof visibleLines) => {
    setVisibleLines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderInteractiveSvg = (isLarge = false) => (
    <svg
      ref={isLarge ? undefined : svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full ${
        isLarge ? 'h-80 sm:h-96' : 'h-60'
      } select-none overflow-visible cursor-pointer touch-manipulation`}
      onClick={handleSvgClick}
      onDoubleClick={() => setIsExpandedModalOpen(true)}
      onMouseMove={(e) => {
        const idx = resolveIndexFromClientX(e.clientX, e.currentTarget);
        if (idx !== null) setHoverIdx(idx);
      }}
      onMouseLeave={() => setHoverIdx(null)}
    >
      <defs>
        <linearGradient id={isLarge ? 'biTechAreaGradLg' : 'biTechAreaGrad'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Subtle interactive hint inside SVG top-left */}
      <text
        x={padLeft + 4}
        y={14}
        className="fill-slate-400 text-[9px] font-sans"
      >
        {isAr
          ? '💡 اضغط على أي نقطة في الرسم البياني لإظهار لوحة التحليل التفاعلية'
          : '💡 Click any point on the chart to open the interactive data inspector'}
      </text>

      {/* Horizontal Y gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const val = maxVal * ratio;
        const y = yAt(val);
        return (
          <g key={ratio}>
            <line
              x1={padLeft}
              y1={y}
              x2={width - padRight}
              y2={y}
              stroke="currentColor"
              className="text-slate-700/35"
              strokeDasharray="3 3"
            />
            <text
              x={padLeft - 6}
              y={y + 3}
              textAnchor="end"
              className="fill-slate-400 text-[9px] font-mono"
            >
              {Math.round(val)}
            </text>
          </g>
        );
      })}

      {/* Support & Resistance Zones */}
      {visibleLines.supportResistance && resistanceCeiling > 0 && (
        <g>
          <line
            x1={padLeft}
            y1={yAt(resistanceCeiling)}
            x2={width - padRight}
            y2={yAt(resistanceCeiling)}
            stroke="#f43f5e"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.75"
          />
          <text
            x={width - padRight - 4}
            y={yAt(resistanceCeiling) - 4}
            textAnchor="end"
            className="fill-rose-400 text-[9px] font-mono"
          >
            {isAr ? `مقاومة/ذروة ${resistanceCeiling}` : `Resistance ${resistanceCeiling}`}
          </text>
        </g>
      )}

      {visibleLines.supportResistance && supportFloor > 0 && (
        <g>
          <line
            x1={padLeft}
            y1={yAt(supportFloor)}
            x2={width - padRight}
            y2={yAt(supportFloor)}
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.7"
          />
          <text
            x={width - padRight - 4}
            y={yAt(supportFloor) - 4}
            textAnchor="end"
            className="fill-sky-400 text-[9px] font-mono"
          >
            {isAr ? `دعم ${supportFloor}` : `Support ${supportFloor}`}
          </text>
        </g>
      )}

      {/* Area & Lines */}
      {areaPath && (
        <path
          d={areaPath}
          fill={`url(#${isLarge ? 'biTechAreaGradLg' : 'biTechAreaGrad'})`}
        />
      )}
      {trendPath && (
        <path
          d={trendPath}
          fill="none"
          stroke="#e879f9"
          strokeWidth="1.75"
          strokeDasharray="5 4"
        />
      )}
      {sma7Path && <path d={sma7Path} fill="none" stroke="#fbbf24" strokeWidth="2.2" />}
      {ema7Path && <path d={ema7Path} fill="none" stroke="#38bdf8" strokeWidth="2.2" />}
      {mainLinePath && (
        <path d={mainLinePath} fill="none" stroke="#10b981" strokeWidth="2.75" />
      )}

      {/* Data Points & Interactive Hit Columns */}
      {filteredSeries.map((pt, i) => {
        const cx = xAt(i);
        const cy = yAt(pt.value);
        const isHovered = hoverIdx === i;
        const isPinned = selectedIdx === i;
        const isActiveFocus = effectiveIdx === i;
        const showTick =
          filteredSeries.length <= 12 ||
          i === 0 ||
          i === filteredSeries.length - 1 ||
          i % Math.ceil(filteredSeries.length / 8) === 0;

        return (
          <g key={pt.dateKey}>
            {(isHovered || isPinned) && (
              <>
                <line
                  x1={cx}
                  y1={padTop}
                  x2={cx}
                  y2={padTop + plotH}
                  stroke={isPinned ? '#f59e0b' : '#10b981'}
                  strokeWidth={isPinned ? '1.5' : '1'}
                  strokeDasharray="3 2"
                />
                <line
                  x1={padLeft}
                  y1={cy}
                  x2={width - padRight}
                  y2={cy}
                  stroke={isPinned ? '#f59e0b' : '#10b981'}
                  strokeWidth="0.75"
                  strokeDasharray="2 3"
                  opacity="0.5"
                />
              </>
            )}

            {isActiveFocus && (
              <circle
                cx={cx}
                cy={cy}
                r={9}
                fill={isPinned ? '#f59e0b' : '#10b981'}
                opacity="0.22"
              />
            )}

            <circle
              cx={cx}
              cy={cy}
              r={isPinned ? 6 : isHovered ? 5.5 : pt.value > 0 ? 3.5 : 2.2}
              className={
                isPinned
                  ? 'fill-amber-400 stroke-slate-950 stroke-2'
                  : pt.value > 0
                  ? 'fill-emerald-400 stroke-slate-950 stroke-2'
                  : 'fill-slate-600'
              }
            />

            {/* Direct value label above active/pinned point inside SVG */}
            {(isPinned || isHovered) && (
              <g transform={`translate(${Math.min(width - 95, Math.max(65, cx))}, ${Math.max(16, cy - 12)})`}>
                <rect
                  x="-58"
                  y="-16"
                  width="116"
                  height="18"
                  rx="5"
                  fill="#0f172a"
                  stroke={isPinned ? '#f59e0b' : '#10b981'}
                  strokeWidth="1"
                  opacity="0.95"
                />
                <text
                  x="0"
                  y="-4"
                  textAnchor="middle"
                  className="fill-emerald-300 text-[9px] font-mono font-bold"
                >
                  {pt.label}: {Math.round(pt.value).toLocaleString()} {currency}
                </text>
              </g>
            )}

            {showTick && (
              <text
                x={cx}
                y={height - 10}
                textAnchor="middle"
                className={`text-[9px] font-mono ${
                  isPinned ? 'fill-amber-400 font-bold' : 'fill-slate-400'
                }`}
              >
                {pt.label}
              </text>
            )}
            <rect
              x={cx - plotW / Math.max(2, filteredSeries.length) / 2}
              y={padTop}
              width={plotW / Math.max(1, filteredSeries.length)}
              height={plotH}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoverIdx(i)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIdx(i);
                setHoverIdx(i);
              }}
            />
          </g>
        );
      })}
    </svg>
  );

  return (
    <div className="space-y-2.5" data-testid="interactive-technical-chart">
      {/* 1. Interactive Legend, Series Toggles & Filter/Expand Controls (div:nth-of-type(1)) */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => toggleLine('netSales')}
            className={`px-2 py-1 rounded-lg border inline-flex items-center gap-1.5 font-semibold transition cursor-pointer ${
              visibleLines.netSales
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-900/50 border-slate-800 text-slate-500 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {isAr ? 'صافي المبيعات' : 'Net Sales'}
          </button>

          <button
            type="button"
            onClick={() => toggleLine('sma7')}
            className={`px-2 py-1 rounded-lg border inline-flex items-center gap-1.5 font-semibold transition cursor-pointer ${
              visibleLines.sma7
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-slate-900/50 border-slate-800 text-slate-500 line-through'
            }`}
          >
            <span className="w-2.5 h-0.5 bg-amber-400 inline-block" />
            SMA(7)
          </button>

          <button
            type="button"
            onClick={() => toggleLine('ema7')}
            className={`px-2 py-1 rounded-lg border inline-flex items-center gap-1.5 font-semibold transition cursor-pointer ${
              visibleLines.ema7
                ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                : 'bg-slate-900/50 border-slate-800 text-slate-500 line-through'
            }`}
          >
            <span className="w-2.5 h-0.5 bg-sky-400 inline-block" />
            EMA(7)
          </button>

          <button
            type="button"
            onClick={() => toggleLine('trendline')}
            className={`px-2 py-1 rounded-lg border inline-flex items-center gap-1.5 font-semibold transition cursor-pointer ${
              visibleLines.trendline
                ? 'bg-fuchsia-500/15 border-fuchsia-500/40 text-fuchsia-300'
                : 'bg-slate-900/50 border-slate-800 text-slate-500 line-through'
            }`}
          >
            <span className="w-2.5 h-0.5 border-b border-dashed border-fuchsia-400 inline-block" />
            {isAr ? 'خط الاتجاه' : 'Trendline'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Quick Period / Active Days Filter */}
          <div className="inline-flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-[10px]">
            {(
              [
                { id: 'all', ar: 'الكل', en: 'All' },
                { id: 'active_only', ar: 'الأيام النشطة', en: 'Active' },
                { id: 'last_14', ar: '14ي', en: '14D' },
                { id: 'last_7', ar: '7ي', en: '7D' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setViewFilter(f.id);
                  setSelectedIdx(null);
                  setHoverIdx(null);
                }}
                className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${
                  viewFilter === f.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? f.ar : f.en}
              </button>
            ))}
          </div>

          <button
            type="button"
            data-testid="expand-technical-chart-btn"
            onClick={() => setIsExpandedModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
          >
            <span>⤢</span>
            <span>{isAr ? 'عرض تفاعلي مكبّر' : 'Interactive Expand'}</span>
          </button>
        </div>
      </div>

      {/* 2. Chart SVG Container (div:nth-of-type(2) > svg:nth-of-type(1)) */}
      <div className="relative w-full overflow-x-auto rounded-xl bg-slate-950/60 border border-slate-800/80 p-2">
        {renderInteractiveSvg(false)}

        {/* Interactive Popover Card that appears immediately when clicking on the chart */}
        {pinnedPoint && selectedIdx !== null && (
          <div
            data-testid="technical-chart-click-popover"
            className="mt-2 p-3 rounded-xl bg-neutral-900/95 border border-amber-500/50 shadow-xl space-y-2.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-neutral-950 font-mono font-extrabold text-xs">
                  {pinnedPoint.dateKey}
                </span>
                <span className="text-xs font-bold text-white">
                  {isAr
                    ? `تفاصيل النقطة المحددة (${pinnedPoint.label})`
                    : `Selected Point Details (${pinnedPoint.label})`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedIdx(Math.max(0, selectedIdx - 1))}
                  disabled={selectedIdx <= 0}
                  className="px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white disabled:opacity-40 text-[11px] font-bold cursor-pointer"
                >
                  {isAr ? '◀ اليوم السابق' : '◀ Prev'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedIdx(Math.min(filteredSeries.length - 1, selectedIdx + 1))
                  }
                  disabled={selectedIdx >= filteredSeries.length - 1}
                  className="px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white disabled:opacity-40 text-[11px] font-bold cursor-pointer"
                >
                  {isAr ? 'اليوم التالي ▶' : 'Next ▶'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpandedModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-[11px] font-extrabold transition cursor-pointer"
                >
                  {isAr ? 'فتح النافذة التفاعلية ⤢' : 'Full Interactive View ⤢'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIdx(null)}
                  className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 text-[11px] font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] text-neutral-400">
                  {isAr ? 'صافي المبيعات' : 'Net Sales'}
                </div>
                <div className="font-mono font-extrabold text-emerald-400 mt-0.5">
                  {formatCurrency(pinnedPoint.value, currency, language)}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] text-neutral-400">
                  {isAr ? 'الفواتير / الوحدات' : 'Orders / Units'}
                </div>
                <div className="font-mono font-bold text-white mt-0.5">
                  {pinnedPoint.transactionCount ?? 0} {isAr ? 'فاتورة' : 'tx'} •{' '}
                  <span className="text-amber-300">{pinnedPoint.unitsSold ?? 0}</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] text-neutral-400">SMA(7)</div>
                <div className="font-mono font-bold text-amber-300 mt-0.5">
                  {pinnedPoint.sma7 !== null
                    ? formatCurrency(pinnedPoint.sma7, currency, language)
                    : '—'}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] text-neutral-400">EMA(7)</div>
                <div className="font-mono font-bold text-sky-300 mt-0.5">
                  {pinnedPoint.ema7 !== null
                    ? formatCurrency(pinnedPoint.ema7, currency, language)
                    : '—'}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] text-neutral-400">
                  {isAr ? 'خط الاتجاه' : 'Trendline'}
                </div>
                <div className="font-mono font-bold text-fuchsia-300 mt-0.5">
                  {pinnedPoint.trendlineValue !== null
                    ? formatCurrency(pinnedPoint.trendlineValue, currency, language)
                    : '—'}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] text-neutral-400">RSI(14)</div>
                <div className="font-mono font-bold text-amber-400 mt-0.5">
                  {pinnedPoint.rsi14 ?? '—'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Live Status Bar (Always visible summary of hovered/latest point) */}
      {activePoint && selectedIdx === null && (
        <div
          data-testid="technical-chart-inspector"
          className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] flex flex-wrap items-center justify-between gap-2"
        >
          <div className="flex flex-wrap items-center gap-3 font-mono">
            <span className="text-amber-300 font-bold">{activePoint.dateKey}</span>
            <span className="text-emerald-400 font-bold">
              {formatCurrency(activePoint.value, currency, language)}
            </span>
            <span className="text-slate-400 font-sans">
              ({activePoint.transactionCount ?? 0} {isAr ? 'فاتورة' : 'orders'} •{' '}
              {activePoint.unitsSold ?? 0} {isAr ? 'وحدة' : 'units'})
            </span>
            {activePoint.sma7 !== null && (
              <span className="text-amber-300">SMA7: {activePoint.sma7}</span>
            )}
            {activePoint.ema7 !== null && (
              <span className="text-sky-300">EMA7: {activePoint.ema7}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSelectedIdx(effectiveIdx)}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
          >
            {isAr ? 'اضغط لتثبيت النقطة والتفاصيل ▾' : 'Click to pin details ▾'}
          </button>
        </div>
      )}

      {/* 4. Fullscreen Interactive Chart Modal */}
      {isExpandedModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsExpandedModalOpen(false)}
        >
          <div
            data-testid="technical-chart-expanded-modal"
            className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-neutral-900 border border-amber-500/40 p-4 sm:p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-800">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  {isAr
                    ? 'الرسم البياني التفاعلي للمبيعات والمؤشرات الفنية (SMA / EMA / RSI / Trend)'
                    : 'Interactive Sales & Technical Indicators Explorer'}
                </h3>
                <p className="text-xs text-neutral-400">
                  {isAr
                    ? 'اضغط على أي نقطة في الرسم البياني أو في الجدول أدناه لاستعراض تفاصيل ذلك اليوم ومؤشراته.'
                    : 'Click any point on the chart or row in the table below to inspect full daily metrics.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsExpandedModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-rose-500 text-neutral-200 hover:text-white text-xs font-bold transition cursor-pointer"
              >
                {isAr ? 'إغلاق ✕' : 'Close ✕'}
              </button>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3">
              {renderInteractiveSvg(true)}
            </div>

            {activePoint && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] text-neutral-400">
                    {isAr ? 'التاريخ المحدد' : 'Selected Date'}
                  </div>
                  <div className="font-mono font-bold text-amber-400 mt-0.5">
                    {activePoint.dateKey}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] text-neutral-400">
                    {isAr ? 'صافي المبيعات' : 'Net Sales'}
                  </div>
                  <div className="font-mono font-bold text-emerald-400 mt-0.5">
                    {formatCurrency(activePoint.value, currency, language)}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] text-neutral-400">
                    {isAr ? 'عدد الفواتير / الوحدات' : 'Orders / Units'}
                  </div>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {activePoint.transactionCount ?? 0} / {activePoint.unitsSold ?? 0}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] text-neutral-400">SMA(7) / EMA(7)</div>
                  <div className="font-mono font-bold text-sky-400 mt-0.5">
                    {activePoint.sma7 ?? '—'} / {activePoint.ema7 ?? '—'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] text-neutral-400">
                    {isAr ? 'خط الاتجاه العام' : 'Trendline Value'}
                  </div>
                  <div className="font-mono font-bold text-fuchsia-400 mt-0.5">
                    {activePoint.trendlineValue ?? '—'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] text-neutral-400">RSI(14)</div>
                  <div className="font-mono font-bold text-amber-300 mt-0.5">
                    {activePoint.rsi14 ?? '—'}
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Day-by-Day Table */}
            <div className="max-h-56 overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-950">
              <table className="w-full text-xs text-start border-collapse">
                <thead className="sticky top-0 bg-neutral-900 border-b border-neutral-800 text-neutral-400 text-[11px]">
                  <tr>
                    <th className="py-2 px-3 text-start">{isAr ? 'التاريخ' : 'Date'}</th>
                    <th className="py-2 px-3 text-start">{isAr ? 'صافي المبيعات' : 'Net Sales'}</th>
                    <th className="py-2 px-3 text-start">{isAr ? 'الفواتير' : 'Orders'}</th>
                    <th className="py-2 px-3 text-start">{isAr ? 'الوحدات' : 'Units'}</th>
                    <th className="py-2 px-3 text-start">SMA(7)</th>
                    <th className="py-2 px-3 text-start">EMA(7)</th>
                    <th className="py-2 px-3 text-start">RSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/70 font-mono">
                  {filteredSeries.map((pt, idx) => {
                    const isRowSelected = effectiveIdx === idx;
                    return (
                      <tr
                        key={pt.dateKey}
                        onClick={() => {
                          setSelectedIdx(idx);
                          setHoverIdx(idx);
                        }}
                        className={`cursor-pointer transition ${
                          isRowSelected
                            ? 'bg-amber-500/20 text-white font-bold'
                            : 'hover:bg-neutral-900 text-neutral-300'
                        }`}
                      >
                        <td className="py-2 px-3">{pt.dateKey}</td>
                        <td className="py-2 px-3 text-emerald-400">
                          {formatCurrency(pt.value, currency, language)}
                        </td>
                        <td className="py-2 px-3">{pt.transactionCount ?? 0}</td>
                        <td className="py-2 px-3 text-amber-300">{pt.unitsSold ?? 0}</td>
                        <td className="py-2 px-3">{pt.sma7 ?? '—'}</td>
                        <td className="py-2 px-3 text-sky-300">{pt.ema7 ?? '—'}</td>
                        <td className="py-2 px-3 text-fuchsia-300">{pt.rsi14 ?? '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface IntradayCandlestickChartProps {
  candles: DailyIntradayCandlestick[];
  currency: SupportedCurrency;
  language: AppLanguage;
}

export function IntradayCandlestickChart({
  candles,
  currency,
  language,
}: IntradayCandlestickChartProps) {
  const isAr = language === 'ar';
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const visibleCandles = candles.length > 14 ? candles.slice(-14) : candles;
  if (visibleCandles.length === 0) {
    return null;
  }

  const width = 760;
  const height = 220;
  const padLeft = 58;
  const padRight = 24;
  const padTop = 18;
  const padBottom = 32;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const maxHigh =
    Math.max(
      10,
      ...visibleCandles.map((c) => Math.max(c.high, c.dailyTotalSales))
    ) * 1.1;

  const yAt = (v: number) =>
    padTop + plotH - Math.min(1, Math.max(0, v / maxHigh)) * plotH;

  const stepW = plotW / Math.max(1, visibleCandles.length);
  const candleW = Math.max(8, Math.min(26, stepW * 0.48));

  const effectiveIdx =
    selectedIdx !== null && visibleCandles[selectedIdx]
      ? selectedIdx
      : hoverIdx !== null && visibleCandles[hoverIdx]
      ? hoverIdx
      : visibleCandles.length - 1;
  const active = visibleCandles[effectiveIdx];
  const pinnedCandle = selectedIdx !== null && visibleCandles[selectedIdx] ? visibleCandles[selectedIdx] : null;

  const resolveCandleFromClientX = (clientX: number, targetSvg: SVGSVGElement | null) => {
    if (!targetSvg || visibleCandles.length === 0) return null;
    const rect = targetSvg.getBoundingClientRect();
    if (rect.width <= 0) return null;
    const relX = ((clientX - rect.left) / rect.width) * width;
    const clampedPlotX = Math.max(0, Math.min(plotW - 1, relX - padLeft));
    return Math.min(
      visibleCandles.length - 1,
      Math.max(0, Math.floor(clampedPlotX / stepW))
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
            {isAr ? 'إغلاق أعلى من الافتتاح (زخم مسائي)' : 'Close ≥ Open (Strong Closing Hour)'}
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
            {isAr ? 'افتتاح أعلى من الإغلاق (ذروة صباحية)' : 'Open > Close (Morning Front-Loaded)'}
          </span>
        </div>
        {active && (
          <div className="px-2.5 py-1 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] font-mono text-slate-200 flex flex-wrap items-center gap-2.5">
            <span className="text-amber-300 font-bold">{active.dateKey}</span>
            <span>O: {active.open}</span>
            <span className="text-emerald-400">H: {active.high}</span>
            <span className="text-rose-400">L: {active.low}</span>
            <span className="text-sky-400">C: {active.close}</span>
            <span className="text-amber-300 font-bold">
              {isAr ? 'الإجمالي:' : 'Total:'}{' '}
              {formatCurrency(active.dailyTotalSales, currency, language)}
            </span>
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-52 select-none cursor-pointer touch-manipulation"
        onClick={(e) => {
          const idx = resolveCandleFromClientX(e.clientX, e.currentTarget);
          if (idx !== null) {
            setSelectedIdx(idx);
            setHoverIdx(idx);
          }
        }}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {[0, 0.5, 1].map((r) => {
          const val = maxHigh * r;
          const y = yAt(val);
          return (
            <g key={r}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="currentColor"
                className="text-slate-700/30"
                strokeDasharray="3 3"
              />
              <text
                x={padLeft - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-slate-400 text-[9px] font-mono"
              >
                {Math.round(val)}
              </text>
            </g>
          );
        })}

        {visibleCandles.map((c, idx) => {
          const cx = padLeft + idx * stepW + stepW / 2;
          const isBull = c.close >= c.open;
          const isSelected = effectiveIdx === idx;
          const color = c.dailyTotalSales === 0 ? '#475569' : isBull ? '#10b981' : '#f59e0b';
          const yHigh = yAt(c.high);
          const yLow = yAt(c.low);
          const yOpen = yAt(c.open);
          const yClose = yAt(c.close);
          const bodyTop = Math.min(yOpen, yClose);
          const bodyHeight = Math.max(3, Math.abs(yClose - yOpen));
          const yTotal = yAt(c.dailyTotalSales);

          return (
            <g
              key={c.dateKey}
              className="cursor-pointer"
              onMouseEnter={() => setHoverIdx(idx)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIdx(idx);
                setHoverIdx(idx);
              }}
            >
              {isSelected && (
                <line
                  x1={cx}
                  y1={padTop}
                  x2={cx}
                  y2={padTop + plotH}
                  stroke="#fbbf24"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              )}
              {/* Daily Total translucent bar */}
              {c.dailyTotalSales > 0 && (
                <rect
                  x={cx - candleW * 0.7}
                  y={yTotal}
                  width={candleW * 1.4}
                  height={Math.max(2, padTop + plotH - yTotal)}
                  rx={2}
                  fill={color}
                  opacity={isSelected ? 0.28 : 0.14}
                />
              )}
              {/* High-Low Wick */}
              {c.high > 0 && (
                <line
                  x1={cx}
                  y1={yHigh}
                  x2={cx}
                  y2={yLow}
                  stroke={color}
                  strokeWidth={isSelected ? '2.5' : '2'}
                />
              )}
              {/* Open-Close Body */}
              <rect
                x={cx - candleW / 2}
                y={bodyTop}
                width={candleW}
                height={bodyHeight}
                rx={2}
                fill={color}
              />
              <text
                x={cx}
                y={height - 10}
                textAnchor="middle"
                className={`text-[9px] font-mono ${
                  isSelected ? 'fill-amber-400 font-bold' : 'fill-slate-400'
                }`}
              >
                {c.label}
              </text>
            </g>
          );
        })}
      </svg>

      {pinnedCandle && selectedIdx !== null && (
        <div className="p-3 rounded-xl bg-neutral-900/95 border border-amber-500/40 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3 font-mono">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-neutral-950 font-bold">
              {pinnedCandle.dateKey}
            </span>
            <span>O: {formatCurrency(pinnedCandle.open, currency, language)}</span>
            <span className="text-emerald-400">
              H: {formatCurrency(pinnedCandle.high, currency, language)}
            </span>
            <span className="text-rose-400">
              L: {formatCurrency(pinnedCandle.low, currency, language)}
            </span>
            <span className="text-sky-400">
              C: {formatCurrency(pinnedCandle.close, currency, language)}
            </span>
            <strong className="text-amber-300">
              {isAr ? 'إجمالي اليوم:' : 'Daily Total:'}{' '}
              {formatCurrency(pinnedCandle.dailyTotalSales, currency, language)}
            </strong>
          </div>
          <button
            type="button"
            onClick={() => setSelectedIdx(null)}
            className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

interface StatisticalForecastFanChartProps {
  series: ForecastPoint[];
  currency: SupportedCurrency;
  language: AppLanguage;
}

export function StatisticalForecastFanChart({
  series,
  currency,
  language,
}: StatisticalForecastFanChartProps) {
  const isAr = language === 'ar';
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (!series || series.length === 0) return null;

  const width = 760;
  const height = 250;
  const padLeft = 58;
  const padRight = 24;
  const padTop = 20;
  const padBottom = 34;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const maxVal =
    Math.max(
      10,
      ...series.map((p) =>
        Math.max(
          p.actualValue ?? 0,
          p.fittedOrForecastValue,
          p.upperBound95 ?? 0
        )
      )
    ) * 1.1;

  const xAt = (i: number) =>
    series.length <= 1
      ? padLeft + plotW / 2
      : padLeft + (i / (series.length - 1)) * plotW;
  const yAt = (v: number) =>
    padTop + plotH - Math.min(1, Math.max(0, v / maxVal)) * plotH;

  // Build 95% and 80% fan polygons for forecast points
  const forecastIndices = series
    .map((p, idx) => (!p.isHistorical ? idx : -1))
    .filter((idx) => idx >= 0);

  let band95Path = '';
  let band80Path = '';
  if (forecastIndices.length > 1) {
    const upper95Pts = forecastIndices.map(
      (i) =>
        `${xAt(i).toFixed(1)},${yAt(
          series[i].upperBound95 ?? series[i].fittedOrForecastValue
        ).toFixed(1)}`
    );
    const lower95Pts = [...forecastIndices]
      .reverse()
      .map(
        (i) => `${xAt(i).toFixed(1)},${yAt(series[i].lowerBound95 ?? 0).toFixed(1)}`
      );
    band95Path = `M ${upper95Pts.join(' L ')} L ${lower95Pts.join(' L ')} Z`;

    const upper80Pts = forecastIndices.map(
      (i) =>
        `${xAt(i).toFixed(1)},${yAt(
          series[i].upperBound80 ?? series[i].fittedOrForecastValue
        ).toFixed(1)}`
    );
    const lower80Pts = [...forecastIndices]
      .reverse()
      .map(
        (i) => `${xAt(i).toFixed(1)},${yAt(series[i].lowerBound80 ?? 0).toFixed(1)}`
      );
    band80Path = `M ${upper80Pts.join(' L ')} L ${lower80Pts.join(' L ')} Z`;
  }

  // Historical actual path
  const histPts = series
    .map((p, i) =>
      p.isHistorical && p.actualValue !== null
        ? `${xAt(i).toFixed(1)},${yAt(p.actualValue).toFixed(1)}`
        : null
    )
    .filter(Boolean);
  const actualPath = histPts.length > 0 ? `M ${histPts.join(' L ')}` : '';

  // Fitted + Forecast continuous path
  const modelPts = series.map(
    (p, i) => `${xAt(i).toFixed(1)},${yAt(p.fittedOrForecastValue).toFixed(1)}`
  );
  const modelPath = modelPts.length > 0 ? `M ${modelPts.join(' L ')}` : '';

  const splitIdx = series.findIndex((p) => !p.isHistorical);
  const effectiveIdx =
    selectedIdx !== null && series[selectedIdx]
      ? selectedIdx
      : hoverIdx !== null && series[hoverIdx]
      ? hoverIdx
      : series.length - 1;
  const active = series[effectiveIdx];
  const pinnedForecast = selectedIdx !== null && series[selectedIdx] ? series[selectedIdx] : null;

  const resolveForecastIndexFromClientX = (clientX: number, targetSvg: SVGSVGElement | null) => {
    if (!targetSvg || series.length === 0) return null;
    const rect = targetSvg.getBoundingClientRect();
    if (rect.width <= 0) return null;
    const relX = ((clientX - rect.left) / rect.width) * width;
    const clampedPlotX = Math.max(0, Math.min(plotW, relX - padLeft));
    if (series.length === 1) return 0;
    const ratio = clampedPlotX / plotW;
    return Math.min(
      series.length - 1,
      Math.max(0, Math.round(ratio * (series.length - 1)))
    );
  };

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            {isAr ? 'المبيعات الفعلية التاريخية' : 'Historical Actuals'}
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-amber-400">
            <span className="w-3 h-0.5 bg-amber-400 inline-block" />
            {isAr ? 'مسار التنبؤ الإحصائي' : 'Statistical Forecast'}
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber-300/80">
            <span className="w-3 h-2 rounded-sm bg-amber-500/30 inline-block" />
            {isAr
              ? 'نطاقات عدم يقين تقديرية (80% / 95%)'
              : '80% & 95% Estimated Uncertainty Ranges'}
          </span>
        </div>
        {active && (
          <div className="px-2.5 py-1 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] font-mono text-slate-200 flex items-center gap-3">
            <span className="text-amber-300 font-bold">{active.dateKey}</span>
            {active.isHistorical ? (
              <span className="text-emerald-400 font-bold">
                {isAr ? 'فعلي:' : 'Actual:'}{' '}
                {formatCurrency(active.actualValue ?? 0, currency, language)}
              </span>
            ) : (
              <>
                <span className="text-amber-400 font-bold">
                  {isAr ? 'متوقع:' : 'Forecast:'}{' '}
                  {formatCurrency(active.fittedOrForecastValue, currency, language)}
                </span>
                <span className="text-slate-400">
                  80%: [{active.lowerBound80} – {active.upperBound80}]
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-60 select-none cursor-pointer touch-manipulation"
        onClick={(e) => {
          const idx = resolveForecastIndexFromClientX(e.clientX, e.currentTarget);
          if (idx !== null) {
            setSelectedIdx(idx);
            setHoverIdx(idx);
          }
        }}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((r) => {
          const val = maxVal * r;
          const y = yAt(val);
          return (
            <g key={r}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="currentColor"
                className="text-slate-700/30"
                strokeDasharray="3 3"
              />
              <text
                x={padLeft - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-slate-400 text-[9px] font-mono"
              >
                {Math.round(val)}
              </text>
            </g>
          );
        })}

        {/* Forecast horizon divider */}
        {splitIdx > 0 && (
          <g>
            <line
              x1={xAt(splitIdx)}
              y1={padTop}
              x2={xAt(splitIdx)}
              y2={padTop + plotH}
              stroke="#fbbf24"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={xAt(splitIdx) + 6}
              y={padTop + 10}
              className="fill-amber-400 text-[9px] font-semibold"
            >
              {isAr ? 'بداية التوقعات المستقبلية ←' : 'Forecast Horizon →'}
            </text>
          </g>
        )}

        {/* Confidence Bands */}
        {band95Path && <path d={band95Path} fill="#f59e0b" opacity="0.12" />}
        {band80Path && <path d={band80Path} fill="#f59e0b" opacity="0.22" />}

        {/* Model Fit + Forecast Line */}
        {modelPath && (
          <path
            d={modelPath}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeDasharray="5 3"
          />
        )}

        {/* Historical Actual Line */}
        {actualPath && (
          <path d={actualPath} fill="none" stroke="#10b981" strokeWidth="2.5" />
        )}

        {series.map((pt, i) => {
          const cx = xAt(i);
          const cy = yAt(
            pt.isHistorical && pt.actualValue !== null
              ? pt.actualValue
              : pt.fittedOrForecastValue
          );
          const isSelected = effectiveIdx === i;
          const showTick =
            series.length <= 14 ||
            i === 0 ||
            i === series.length - 1 ||
            i % Math.ceil(series.length / 8) === 0;

          return (
            <g key={`${pt.dateKey}-${i}`}>
              {isSelected && (
                <line
                  x1={cx}
                  y1={padTop}
                  x2={cx}
                  y2={padTop + plotH}
                  stroke="#fbbf24"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? 5.5 : 2.8}
                fill={pt.isHistorical ? '#10b981' : '#fbbf24'}
              />
              {showTick && (
                <text
                  x={cx}
                  y={height - 10}
                  textAnchor="middle"
                  className="fill-slate-400 text-[9px] font-mono"
                >
                  {pt.label}
                </text>
              )}
              <rect
                x={cx - plotW / Math.max(2, series.length) / 2}
                y={padTop}
                width={plotW / Math.max(1, series.length)}
                height={plotH}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverIdx(i)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIdx(i);
                  setHoverIdx(i);
                }}
              />
            </g>
          );
        })}
      </svg>

      {pinnedForecast && selectedIdx !== null && (
        <div className="p-3 rounded-xl bg-neutral-900/95 border border-amber-500/40 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3 font-mono">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-neutral-950 font-bold">
              {pinnedForecast.dateKey}
            </span>
            {pinnedForecast.isHistorical ? (
              <span className="text-emerald-400 font-bold">
                {isAr ? 'مبيعات فعلية:' : 'Actual Sales:'}{' '}
                {formatCurrency(pinnedForecast.actualValue ?? 0, currency, language)}
              </span>
            ) : (
              <>
                <span className="text-amber-400 font-bold">
                  {isAr ? 'توقع المبيعات:' : 'Forecast Sales:'}{' '}
                  {formatCurrency(pinnedForecast.fittedOrForecastValue, currency, language)}
                </span>
                <span className="text-slate-300">
                  80%: [{pinnedForecast.lowerBound80} – {pinnedForecast.upperBound80}]
                </span>
                <span className="text-slate-400">
                  95%: [{pinnedForecast.lowerBound95} – {pinnedForecast.upperBound95}]
                </span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSelectedIdx(null)}
            className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

interface AbcParetoChartProps {
  products: ProductInventoryAnalyticsItem[];
  language: AppLanguage;
}

export function AbcParetoChart({ products, language }: AbcParetoChartProps) {
  const isAr = language === 'ar';
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const topItems = products.slice(0, 10);
  if (topItems.length === 0) return null;

  const width = 760;
  const height = 210;
  const padLeft = 48;
  const padRight = 48;
  const padTop = 18;
  const padBottom = 38;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const maxBasis = Math.max(1, ...topItems.map((p) => p.abcBasisValue));
  const stepW = plotW / topItems.length;
  const barW = Math.max(14, Math.min(38, stepW * 0.55));

  const yPct = (pct: number) => padTop + plotH - (Math.min(100, Math.max(0, pct)) / 100) * plotH;

  const paretoPts = topItems.map(
    (p, i) =>
      `${(padLeft + i * stepW + stepW / 2).toFixed(1)},${yPct(
        p.abcCumulativeSharePercent
      ).toFixed(1)}`
  );
  const paretoPath = paretoPts.length > 0 ? `M ${paretoPts.join(' L ')}` : '';
  const selectedItem = selectedIdx !== null ? topItems[selectedIdx] : topItems[0];

  return (
    <div className="space-y-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-52 select-none cursor-pointer">
        {/* 80% Pareto cutoff line */}
        <line
          x1={padLeft}
          y1={yPct(80)}
          x2={width - padRight}
          y2={yPct(80)}
          stroke="#10b981"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.6"
        />
        <text
          x={width - padRight + 4}
          y={yPct(80) + 3}
          className="fill-emerald-400 text-[9px] font-mono"
        >
          80%
        </text>

        {topItems.map((item, i) => {
          const cx = padLeft + i * stepW + stepW / 2;
          const bh = Math.max(3, (item.abcBasisValue / maxBasis) * plotH);
          const by = padTop + plotH - bh;
          const isSelected = selectedIdx === i;
          const fill =
            item.abcClass === 'A'
              ? '#10b981'
              : item.abcClass === 'B'
              ? '#f59e0b'
              : '#64748b';

          return (
            <g
              key={item.productId}
              className="cursor-pointer"
              onClick={() => setSelectedIdx(i)}
            >
              <rect
                x={cx - barW / 2}
                y={by}
                width={barW}
                height={bh}
                rx={4}
                fill={fill}
                opacity={isSelected ? 1 : 0.82}
                stroke={isSelected ? '#fbbf24' : 'none'}
                strokeWidth={isSelected ? 2 : 0}
              />
              <text
                x={cx}
                y={by - 4}
                textAnchor="middle"
                className="fill-slate-300 text-[9px] font-mono font-bold"
              >
                {item.abcClass}
              </text>
              <text
                x={cx}
                y={height - 12}
                textAnchor="middle"
                className="fill-slate-400 text-[9px] font-mono"
              >
                {item.sku}
              </text>
            </g>
          );
        })}

        {paretoPath && (
          <path d={paretoPath} fill="none" stroke="#38bdf8" strokeWidth="2" />
        )}
        {topItems.map((item, i) => {
          const cx = padLeft + i * stepW + stepW / 2;
          const cy = yPct(item.abcCumulativeSharePercent);
          return (
            <circle
              key={`pt-${item.productId}`}
              cx={cx}
              cy={cy}
              r={selectedIdx === i ? 5.5 : 3.5}
              fill="#38bdf8"
              className="cursor-pointer"
              onClick={() => setSelectedIdx(i)}
            />
          );
        })}
        <text
          x={padLeft}
          y={12}
          className="fill-sky-400 text-[10px] font-semibold"
        >
          {isAr
            ? 'الأعمدة: قيمة مساهمة الصنف (A/B/C) • الخط الأزرق: النسبة التراكمية لباريتو %'
            : 'Bars: SKU Value Contribution (Class A/B/C) • Blue Curve: Cumulative Pareto Share %'}
        </text>
      </svg>

      {selectedItem && (
        <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold text-white">
            {isAr ? selectedItem.nameAr || selectedItem.name : selectedItem.name} (
            <span className="font-mono text-amber-400">{selectedItem.sku}</span>)
          </span>
          <span className="font-mono text-slate-300">
            {isAr ? 'الفئة:' : 'Class:'}{' '}
            <strong className="text-emerald-400">{selectedItem.abcClass}</strong> •{' '}
            {isAr ? 'المساهمة التراكمية:' : 'Cumulative Share:'}{' '}
            <strong className="text-sky-400">{selectedItem.abcCumulativeSharePercent}%</strong>
          </span>
        </div>
      )}
    </div>
  );
}
