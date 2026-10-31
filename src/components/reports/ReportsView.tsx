/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { usePOS } from '../../context/POSContext';
import { getTranslation } from '../../lib/translations';
import { formatCurrency } from '../../lib/pos-calculations';
import { AppCard } from '../ui/AppCard';
import { TactileButton } from '../ui/TactileButton';
import {
  BarChart3,
  Download,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Banknote,
  QrCode,
  Award,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { transactions, products, settings } = usePOS();
  const t = getTranslation(settings.language);

  // Compute analytics exclusively from actual stored transactions
  const analytics = useMemo(() => {
    const completedTx = transactions.filter((t) => t.status === 'completed');

    let grossSales = 0;
    let totalTaxCollected = 0;
    let totalDiscountsGiven = 0;
    let estimatedCost = 0;

    const paymentCounts: Record<string, { count: number; total: number }> = {
      bank_transfer: { count: 0, total: 0 },
      cash: { count: 0, total: 0 },
      qr_nfc: { count: 0, total: 0 },
    };

    const productSalesMap: Record<
      string,
      { name: string; sku: string; units: number; revenue: number }
    > = {};

    completedTx.forEach((tx) => {
      grossSales += tx.grandTotal;
      totalTaxCollected += tx.taxAmount;
      totalDiscountsGiven += tx.discountAmount;

      const methodKey = tx.paymentMethod === 'card' ? 'bank_transfer' : tx.paymentMethod;
      if (paymentCounts[methodKey]) {
        paymentCounts[methodKey].count += 1;
        paymentCounts[methodKey].total += tx.grandTotal;
      }

      tx.items.forEach((item) => {
        const prod = products.find((p) => p.id === item.productId);
        if (prod) {
          estimatedCost += prod.costPrice * item.quantity;
        }

        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            name: item.productName,
            sku: item.sku,
            units: 0,
            revenue: 0,
          };
        }
        productSalesMap[item.productId].units += item.quantity;
        productSalesMap[item.productId].revenue += item.total;
      });
    });

    const avgOrderValue = completedTx.length > 0 ? grossSales / completedTx.length : 0;
    const netGrossProfit = Math.max(0, grossSales - estimatedCost - totalTaxCollected);

    const topProducts = Object.values(productSalesMap).sort((a, b) => b.units - a.units);

    return {
      grossSales: Math.round(grossSales * 100) / 100,
      netGrossProfit: Math.round(netGrossProfit * 100) / 100,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      totalOrders: completedTx.length,
      totalTaxCollected: Math.round(totalTaxCollected * 100) / 100,
      paymentCounts,
      topProducts,
    };
  }, [transactions, products]);

  // Export Sales to CSV
  const exportSalesCsv = () => {
    const headers = ['Transaction ID', 'Date', 'Customer', 'Payment Method', 'Items Count', 'Grand Total', 'Status'];
    const rows = transactions.map((t) => [
      t.id,
      new Date(t.timestamp).toISOString(),
      `"${t.customerName || 'Walk-in'}"`,
      t.paymentMethod,
      t.items.reduce((acc, i) => acc + i.quantity, 0),
      t.grandTotal.toFixed(2),
      t.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dqnamo_pos_sales_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Inventory to CSV
  const exportInventoryCsv = () => {
    const headers = ['SKU', 'Name', 'Category', 'Barcode', 'Cost Price', 'Selling Price', 'Stock Qty', 'Asset Value'];
    const rows = products.map((p) => [
      p.sku,
      `"${p.name}"`,
      `"${p.category}"`,
      p.barcode,
      p.costPrice.toFixed(2),
      p.sellingPrice.toFixed(2),
      p.stock,
      (p.costPrice * p.stock).toFixed(2),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dqnamo_pos_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {t.analyticsAndReports}
          </h2>
          <span className="text-xs text-neutral-400">
            Real performance figures aggregated from active local journal
          </span>
        </div>

        <div className="flex items-center gap-2">
          <TactileButton
            variant="secondary"
            size="sm"
            onClick={exportSalesCsv}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            {t.exportCsv}
          </TactileButton>

          <TactileButton
            variant="secondary"
            size="sm"
            onClick={exportInventoryCsv}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            {t.exportInventoryCsv}
          </TactileButton>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <AppCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-400">{t.grossSales}</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {formatCurrency(analytics.grossSales, settings.currency, settings.language)}
          </div>
          <span className="text-[11px] text-neutral-500">
            Across {analytics.totalOrders} completed transactions
          </span>
        </AppCard>

        <AppCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-400">{t.netProfit}</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {formatCurrency(analytics.netGrossProfit, settings.currency, settings.language)}
          </div>
          <span className="text-[11px] text-neutral-500">Gross revenue minus COGS & VAT</span>
        </AppCard>

        <AppCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-400">{t.averageOrderValue}</span>
            <ShoppingBag className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {formatCurrency(analytics.avgOrderValue, settings.currency, settings.language)}
          </div>
          <span className="text-[11px] text-neutral-500">Per customer checkout ticket</span>
        </AppCard>
      </div>

      {/* Payment Distribution */}
      <AppCard>
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-white">{t.salesByMethod}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          <div className="p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-white block">{t.bankTransfer}</span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {analytics.paymentCounts.bank_transfer.count} orders
                </span>
              </div>
            </div>
            <span className="font-mono font-bold text-sm text-white tabular-nums">
              {formatCurrency(analytics.paymentCounts.bank_transfer.total, settings.currency, settings.language)}
            </span>
          </div>

          <div className="p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Banknote className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-white block">Cash Tender</span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {analytics.paymentCounts.cash.count} orders
                </span>
              </div>
            </div>
            <span className="font-mono font-bold text-sm text-white tabular-nums">
              {formatCurrency(analytics.paymentCounts.cash.total, settings.currency, settings.language)}
            </span>
          </div>

          <div className="p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <QrCode className="w-5 h-5 text-blue-400" />
              <div>
                <span className="text-xs font-bold text-white block">Digital Wallet (NFC)</span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {analytics.paymentCounts.qr_nfc.count} orders
                </span>
              </div>
            </div>
            <span className="font-mono font-bold text-sm text-white tabular-nums">
              {formatCurrency(analytics.paymentCounts.qr_nfc.total, settings.currency, settings.language)}
            </span>
          </div>
        </div>
      </AppCard>

      {/* Top Products Table */}
      <AppCard>
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-white">{t.topSellingProducts}</h3>
          </div>
        </div>

        <div className="divide-y divide-neutral-800/80 mt-1">
          {analytics.topProducts.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              No sales data recorded yet.
            </div>
          ) : (
            analytics.topProducts.map((p, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-mono font-bold text-neutral-500">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-white block">{p.name}</span>
                    <span className="text-[11px] font-mono text-neutral-400">{p.sku}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-400 block tabular-nums">
                    {formatCurrency(p.revenue, settings.currency, settings.language)}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {p.units} units sold
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </AppCard>
    </div>
  );
};
