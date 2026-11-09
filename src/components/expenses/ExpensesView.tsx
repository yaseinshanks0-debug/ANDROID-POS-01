/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { usePOS } from '../../context/POSContext';
import {
  EXPENSE_CATEGORIES,
  computeExpensesSummary,
  computeNetFinancialPosition,
  formatExpenseCategoryLabel,
  getConvertedExpenseView,
  getExpenseCategoryMeta,
} from '../../lib/expense-calculations';
import {
  computeStoreReportAnalytics,
  formatCurrency,
  formatPaymentMethodLabel,
} from '../../lib/pos-calculations';
import {
  ExpenseCategory,
  ExpenseRecord,
  PaymentMethod,
  SalesRateValuationMode,
  SupportedCurrency,
} from '../../lib/types';
import { AppCard } from '../ui/AppCard';
import { TactileButton } from '../ui/TactileButton';
import { triggerUniversalFileDownload } from '../../lib/native-file-download';
import {
  Wallet,
  Plus,
  Search,
  Download,
  TrendingDown,
  TrendingUp,
  Calendar,
  FileText,
  Edit3,
  Trash2,
  RotateCcw,
  Ban,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  User,
  Hash,
  Banknote,
  CreditCard,
  QrCode,
  Eye,
  Printer,
  Filter,
} from 'lucide-react';

const QUICK_EXPENSE_PRESETS: {
  titleAr: string;
  titleEn: string;
  category: ExpenseCategory;
}[] = [
  { titleAr: 'إيجار المحل الشهري', titleEn: 'Monthly Store Rent', category: 'rent' },
  { titleAr: 'شحن كهرباء ومياه', titleEn: 'Electricity & Water Top-up', category: 'utilities' },
  { titleAr: 'اشتراك الإنترنت الشهري', titleEn: 'Monthly Internet Subscription', category: 'utilities' },
  { titleAr: 'ترحيل ونقل بضائع', titleEn: 'Goods Transport & Delivery', category: 'transport' },
  { titleAr: 'رواتب ويوميات الموظفين', titleEn: 'Staff Wages & Salaries', category: 'salaries' },
  { titleAr: 'أكياس تغليف ورول فواتير', titleEn: 'Packaging Bags & Receipt Rolls', category: 'supplies' },
  { titleAr: 'صيانة وإصلاحات بالمحل', titleEn: 'Store Maintenance & Repairs', category: 'maintenance' },
  { titleAr: 'رسوم محلية وضرائب', titleEn: 'Local Fees & Taxes', category: 'taxes_fees' },
  { titleAr: 'منصرفات ضيافة ونثريات', titleEn: 'Hospitality & Petty Cash', category: 'other' },
];

export const ExpensesView: React.FC = () => {
  const {
    expenses,
    addExpense,
    updateExpense,
    voidExpense,
    deleteExpense,
    transactions,
    products,
    stockMovements,
    settings,
    currencies,
    exchangeRates,
  } = usePOS();

  const isAr = settings.language === 'ar';

  // Display & filter state
  const [displayCurrency, setDisplayCurrency] = useState<SupportedCurrency>(
    settings.currency || 'SDG'
  );
  const [valuationMode, setValuationMode] = useState<SalesRateValuationMode>('historical');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<ExpenseCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'recorded' | 'voided'>('all');

  // Form & Modal state (open by default so cashiers can immediately record expenses)
  const [isFormOpen, setIsFormOpen] = useState<boolean>(true);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<ExpenseCategory>('utilities');
  const [amountInput, setAmountInput] = useState('');
  const [currencyInput, setCurrencyInput] = useState<SupportedCurrency>(
    settings.currency || 'SDG'
  );
  const [paymentMethodInput, setPaymentMethodInput] = useState<PaymentMethod>('cash');
  const [transferReferenceInput, setTransferReferenceInput] = useState('');
  const [beneficiaryInput, setBeneficiaryInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [receiptImageInput, setReceiptImageInput] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  // Voucher inspection modal
  const [inspectedVoucher, setInspectedVoucher] = useState<ExpenseRecord | null>(null);

  const availableCurrencies = useMemo(() => {
    const activeCodes =
      currencies && currencies.length > 0
        ? currencies.filter((c) => c.isActive !== false).map((c) => c.code.toUpperCase())
        : ['SDG', 'USD', 'SAR', 'AED', 'EUR', 'GBP'];
    return Array.from(new Set(['SDG', settings.currency || 'SDG', ...activeCodes]));
  }, [currencies, settings.currency]);

  // Compute Expenses Summary
  const expenseSummary = useMemo(() => {
    return computeExpensesSummary(
      expenses,
      displayCurrency,
      exchangeRates,
      valuationMode,
      'USD'
    );
  }, [expenses, displayCurrency, exchangeRates, valuationMode]);

  // Compute Store Sales & Gross Profit to show Net Operating Profit After Expenses
  const storeAnalytics = useMemo(() => {
    return computeStoreReportAnalytics(
      transactions,
      products,
      stockMovements,
      displayCurrency,
      exchangeRates,
      valuationMode,
      'USD'
    );
  }, [transactions, products, stockMovements, displayCurrency, exchangeRates, valuationMode]);

  const netFinancials = useMemo(() => {
    return computeNetFinancialPosition({
      grossSales: storeAnalytics.grossSales,
      collectedSales: storeAnalytics.collectedSales,
      grossProfitBeforeExpenses: storeAnalytics.netGrossProfit,
      totalExpenses: expenseSummary.totalExpenses,
    });
  }, [storeAnalytics, expenseSummary.totalExpenses]);

  // Filtered expenses list
  const filteredExpenses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return expenses.filter((exp) => {
      if (selectedCategoryFilter !== 'all' && exp.category !== selectedCategoryFilter) {
        return false;
      }
      if (statusFilter !== 'all' && exp.status !== statusFilter) {
        return false;
      }
      if (!q) return true;
      const catMeta = getExpenseCategoryMeta(exp.category);
      return (
        exp.title.toLowerCase().includes(q) ||
        exp.id.toLowerCase().includes(q) ||
        (exp.beneficiary && exp.beneficiary.toLowerCase().includes(q)) ||
        (exp.transferReference && exp.transferReference.toLowerCase().includes(q)) ||
        (exp.notes && exp.notes.toLowerCase().includes(q)) ||
        catMeta.labelAr.toLowerCase().includes(q) ||
        catMeta.labelEn.toLowerCase().includes(q)
      );
    });
  }, [expenses, selectedCategoryFilter, statusFilter, searchQuery]);

  // Chart data for Recharts Category Breakdown
  const categoryChartData = useMemo(() => {
    return expenseSummary.byCategory.map((item) => ({
      category: item.category,
      name: isAr ? item.labelAr : item.labelEn,
      shortName: isAr ? item.labelAr.split(' ')[0] : item.labelEn.split(' ')[0],
      emoji: item.emoji,
      amount: item.totalAmount,
      count: item.count,
      sharePercent: item.sharePercent,
      colorHex: item.colorHex,
    }));
  }, [expenseSummary.byCategory, isAr]);

  const resetFormFields = () => {
    setEditingExpenseId(null);
    setTitleInput('');
    setCategoryInput('utilities');
    setAmountInput('');
    setCurrencyInput(settings.currency || 'SDG');
    setPaymentMethodInput('cash');
    setTransferReferenceInput('');
    setBeneficiaryInput('');
    setNotesInput('');
    setReceiptImageInput('');
    setFormError(null);
  };

  const handleOpenNewExpenseForm = () => {
    resetFormFields();
    setIsFormOpen(true);
    setTimeout(() => {
      const inputEl = document.getElementById('expense-title-input');
      if (inputEl) inputEl.focus();
    }, 50);
  };

  const handleOpenEditExpenseForm = (exp: ExpenseRecord) => {
    setEditingExpenseId(exp.id);
    setTitleInput(exp.title);
    setCategoryInput(exp.category);
    setAmountInput(String(exp.amount));
    setCurrencyInput(exp.currency || settings.currency || 'SDG');
    setPaymentMethodInput(exp.paymentMethod || 'cash');
    setTransferReferenceInput(exp.transferReference || '');
    setBeneficiaryInput(exp.beneficiary || '');
    setNotesInput(exp.notes || '');
    setReceiptImageInput(exp.receiptImage || '');
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleReceiptImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setReceiptImageInput(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedAmount = parseFloat(amountInput);
    if (!titleInput.trim()) {
      setFormError(
        isAr ? 'يرجى إدخال بيان أو وصف المنصرف.' : 'Please enter an expense description.'
      );
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFormError(
        isAr
          ? 'يرجى إدخال مبلغ صحيح أكبر من الصفر للمنصرف.'
          : 'Please enter a valid amount greater than zero.'
      );
      return;
    }

    if (editingExpenseId) {
      updateExpense(editingExpenseId, {
        title: titleInput.trim(),
        category: categoryInput,
        amount: parsedAmount,
        currency: currencyInput,
        paymentMethod: paymentMethodInput,
        transferReference: transferReferenceInput.trim() || undefined,
        beneficiary: beneficiaryInput.trim() || undefined,
        notes: notesInput.trim() || undefined,
        receiptImage: receiptImageInput || undefined,
      });
      setFeedbackBanner(
        isAr ? 'تم تحديث بيانات سند المنصرف بنجاح.' : 'Expense voucher updated successfully.'
      );
    } else {
      const result = addExpense({
        title: titleInput.trim(),
        category: categoryInput,
        amount: parsedAmount,
        currency: currencyInput,
        paymentMethod: paymentMethodInput,
        transferReference: transferReferenceInput.trim() || undefined,
        beneficiary: beneficiaryInput.trim() || undefined,
        notes: notesInput.trim() || undefined,
        receiptImage: receiptImageInput || undefined,
      });
      if (!result.ok) {
        setFormError(result.error || (isAr ? 'بيانات المنصرف غير مكتملة.' : 'Invalid expense data.'));
        return;
      }
      setFeedbackBanner(
        isAr
          ? `تم تسجيل المنصرف (${result.expense?.title}) بقيمة ${formatCurrency(
              parsedAmount,
              currencyInput,
              settings.language
            )} بنجاح.`
          : `Recorded expense (${result.expense?.title}) successfully.`
      );
    }

    resetFormFields();
    setIsFormOpen(false);
    setTimeout(() => setFeedbackBanner(null), 4000);
  };

  const handleExportExpensesCsv = () => {
    const headers = [
      'Expense ID',
      'Date',
      'Title',
      'Category',
      'Beneficiary',
      'Payment Method',
      'Reference #',
      'Original Amount',
      'Original Currency',
      `Converted Amount (${displayCurrency})`,
      'Recorded By',
      'Status',
      'Notes',
    ];

    const rows = filteredExpenses.map((exp) => {
      const view = getConvertedExpenseView(
        exp,
        displayCurrency,
        exchangeRates,
        valuationMode,
        'USD'
      );
      return [
        exp.id,
        new Date(exp.timestamp).toISOString(),
        `"${(exp.title || '').replace(/"/g, '""')}"`,
        `"${formatExpenseCategoryLabel(exp.category, settings.language)}"`,
        `"${(exp.beneficiary || '').replace(/"/g, '""')}"`,
        exp.paymentMethod,
        `"${(exp.transferReference || '').replace(/"/g, '""')}"`,
        exp.amount.toFixed(2),
        exp.currency,
        view.convertedAmount.toFixed(2),
        `"${(exp.recordedBy || '').replace(/"/g, '""')}"`,
        exp.status,
        `"${(exp.notes || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    triggerUniversalFileDownload(
      csvContent,
      `dqnamo_pos_expenses_${new Date().toISOString().slice(0, 10)}.csv`,
      'text/csv;charset=utf-8'
    );
  };

  return (
    <div
      data-testid="expenses-view"
      className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6 pb-24"
    >
      {/* Top Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-5 rounded-3xl">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {isAr ? 'إدارة المنصرفات والمصروفات التشغيلية' : 'Operating Expenses & Vouchers'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                {expenseSummary.activeCount} {isAr ? 'سند صرف' : 'Vouchers'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {isAr
                ? 'تسجيل ومتابعة كافة بنود المنصرفات اليومية والشهرية وخصمها تلقائياً لحساب صافي الربح التشغيلي والسيولة النقدية'
                : 'Track daily and monthly store operating expenses and automatically calculate net operating profit and cash balance'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Display Currency Selector */}
          <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-neutral-400">
              {isAr ? 'عملة العرض:' : 'Currency:'}
            </span>
            <select
              aria-label={isAr ? 'عملة عرض المنصرفات' : 'Expenses display currency'}
              value={displayCurrency}
              onChange={(e) => setDisplayCurrency(e.target.value as SupportedCurrency)}
              className="bg-transparent text-xs font-bold text-amber-400 focus:outline-none cursor-pointer"
            >
              {availableCurrencies.map((code) => (
                <option key={code} value={code} className="bg-neutral-900 text-white">
                  {code}
                </option>
              ))}
            </select>
          </div>

          <TactileButton
            variant="secondary"
            size="md"
            onClick={handleExportExpensesCsv}
            leftIcon={<Download className="w-4 h-4" />}
          >
            {isAr ? 'تصدير المنصرفات CSV' : 'Export CSV'}
          </TactileButton>

          <TactileButton
            data-testid="open-add-expense-btn"
            variant="amber"
            size="md"
            onClick={handleOpenNewExpenseForm}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {isAr ? 'إضافة منصرف جديد' : 'Add New Expense'}
          </TactileButton>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackBanner && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackBanner(null)}
            aria-label={isAr ? 'إغلاق التنبيه' : 'Dismiss notification'}
            className="text-emerald-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Expenses */}
        <AppCard className="border-rose-500/30 bg-gradient-to-br from-neutral-900 via-neutral-900 to-rose-950/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-400">
              {isAr ? 'إجمالي المنصرفات المعتمدة' : 'Total Active Expenses'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div
            data-testid="kpi-total-expenses"
            className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono tabular-nums"
          >
            {formatCurrency(expenseSummary.totalExpenses, displayCurrency, settings.language)}
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-neutral-400">
            <span>
              {expenseSummary.activeCount} {isAr ? 'عملية صرف معتمدة' : 'active records'}
            </span>
            {expenseSummary.voidedCount > 0 && (
              <span className="text-neutral-500">
                ({expenseSummary.voidedCount} {isAr ? 'ملغاة' : 'voided'})
              </span>
            )}
          </div>
        </AppCard>

        {/* Today's Expenses */}
        <AppCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-400">
              {isAr ? 'منصرفات اليوم' : "Today's Expenses"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div
            data-testid="kpi-today-expenses"
            className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums"
          >
            {formatCurrency(expenseSummary.todayExpenses, displayCurrency, settings.language)}
          </div>
          <div className="mt-2 text-[11px] text-neutral-400">
            {expenseSummary.todayCount}{' '}
            {isAr ? 'سندات صرف مسجلة اليوم' : 'expenses recorded today'}
          </div>
        </AppCard>

        {/* This Month's Expenses */}
        <AppCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-400">
              {isAr ? 'منصرفات هذا الشهر' : "This Month's Expenses"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {formatCurrency(expenseSummary.thisMonthExpenses, displayCurrency, settings.language)}
          </div>
          <div className="mt-2 text-[11px] text-neutral-400">
            {isAr ? 'متوسط السند:' : 'Avg voucher:'}{' '}
            <span className="font-mono text-neutral-300">
              {formatCurrency(
                expenseSummary.averageExpenseAmount,
                displayCurrency,
                settings.language
              )}
            </span>
          </div>
        </AppCard>

        {/* Net Operating Profit After Expenses */}
        <AppCard
          className={
            netFinancials.netOperatingProfit >= 0
              ? 'border-emerald-500/30 bg-emerald-950/10'
              : 'border-rose-500/40 bg-rose-950/20'
          }
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-400">
              {isAr ? 'صافي الربح بعد المنصرفات' : 'Net Profit After Expenses'}
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                netFinancials.netOperatingProfit >= 0
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-rose-500/15 text-rose-400'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div
            data-testid="kpi-net-profit-after-expenses"
            className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${
              netFinancials.netOperatingProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatCurrency(
              netFinancials.netOperatingProfit,
              displayCurrency,
              settings.language
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
            <span>
              {isAr ? 'مجمل الربح:' : 'Gross Profit:'}{' '}
              {formatCurrency(
                netFinancials.grossProfitBeforeExpenses,
                displayCurrency,
                settings.language
              )}
            </span>
            <span className="font-mono text-amber-400">
              {netFinancials.expenseToSalesRatioPercent}% {isAr ? 'من المبيعات' : 'of sales'}
            </span>
          </div>
        </AppCard>
      </div>

      {/* Add / Edit Expense Form Panel */}
      {isFormOpen && (
        <AppCard
          data-testid="expense-form-card"
          className="border-amber-500/40 bg-neutral-900/95 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                {editingExpenseId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">
                  {editingExpenseId
                    ? isAr
                      ? 'تعديل سند المنصرف'
                      : 'Edit Expense Voucher'
                    : isAr
                    ? 'تسجيل سند منصرف جديد'
                    : 'Record New Expense Voucher'}
                </h2>
                <p className="text-[11px] text-neutral-400">
                  {isAr
                    ? 'اختر بند المنصرف سريعاً أو أدخل التفاصيل والمبلغ وطريقة الدفع'
                    : 'Choose a quick preset or fill in the expense details, amount, and payment method'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                resetFormFields();
                setIsFormOpen(false);
              }}
              aria-label={isAr ? 'إغلاق نموذج المنصرف' : 'Close expense form'}
              className="p-2 rounded-xl bg-neutral-800/80 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Expense Presets */}
          <div>
            <span className="text-[11px] font-bold text-neutral-400 block mb-2">
              {isAr ? 'اختيار سريع لبند المنصرف الشائع:' : 'Quick Expense Presets:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_EXPENSE_PRESETS.map((preset, idx) => {
                const meta = getExpenseCategoryMeta(preset.category);
                const label = isAr ? preset.titleAr : preset.titleEn;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTitleInput(label);
                      setCategoryInput(preset.category);
                    }}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-amber-500/40 transition-all flex items-center gap-1.5"
                  >
                    <span>{meta.emoji}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {formError && (
            <div
              role="alert"
              data-testid="expense-form-error"
              className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs font-semibold"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmitExpense} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Expense Title */}
              <div className="md:col-span-2">
                <label
                  htmlFor="expense-title-input"
                  className="block text-xs font-bold text-neutral-300 mb-1.5"
                >
                  {isAr ? 'بيان / وصف المنصرف *' : 'Expense Title / Description *'}
                </label>
                <input
                  id="expense-title-input"
                  data-testid="expense-title-input"
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder={
                    isAr
                      ? 'مثال: فاتورة كهرباء المحل، إيجار الشهر، ترحيل بضاعة...'
                      : 'e.g., Store electricity bill, monthly rent, freight...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Expense Category */}
              <div>
                <label
                  htmlFor="expense-category-select"
                  className="block text-xs font-bold text-neutral-300 mb-1.5"
                >
                  {isAr ? 'بند / تصنيف المنصرف *' : 'Expense Category *'}
                </label>
                <select
                  id="expense-category-select"
                  data-testid="expense-category-select"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value as ExpenseCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-neutral-900 text-white">
                      {cat.emoji} {isAr ? cat.labelAr : cat.labelEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Expense Amount */}
              <div>
                <label
                  htmlFor="expense-amount-input"
                  className="block text-xs font-bold text-neutral-300 mb-1.5"
                >
                  {isAr ? 'المبلغ *' : 'Amount *'}
                </label>
                <input
                  id="expense-amount-input"
                  data-testid="expense-amount-input"
                  type="number"
                  step="any"
                  min="0"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-mono font-bold text-amber-400 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Currency */}
              <div>
                <label
                  htmlFor="expense-currency-select"
                  className="block text-xs font-bold text-neutral-300 mb-1.5"
                >
                  {isAr ? 'العملة' : 'Currency'}
                </label>
                <select
                  id="expense-currency-select"
                  data-testid="expense-currency-select"
                  value={currencyInput}
                  onChange={(e) => setCurrencyInput(e.target.value as SupportedCurrency)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                >
                  {availableCurrencies.map((code) => (
                    <option key={code} value={code} className="bg-neutral-900 text-white">
                      {code}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <span className="block text-xs font-bold text-neutral-300 mb-1.5">
                  {isAr ? 'طريقة الصرف' : 'Payment Method'}
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: 'cash', labelAr: 'كاش', labelEn: 'Cash', icon: Banknote },
                      {
                        id: 'bank_transfer',
                        labelAr: 'تحويل بنكي',
                        labelEn: 'Transfer',
                        icon: CreditCard,
                      },
                      { id: 'qr_nfc', labelAr: 'محفظة', labelEn: 'Wallet', icon: QrCode },
                    ] as const
                  ).map((pm) => {
                    const Icon = pm.icon;
                    const active = paymentMethodInput === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethodInput(pm.id)}
                        className={`flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                          active
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{isAr ? pm.labelAr : pm.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Beneficiary */}
              <div>
                <label
                  htmlFor="expense-beneficiary-input"
                  className="block text-xs font-bold text-neutral-300 mb-1.5"
                >
                  {isAr ? 'المستفيد / الجهة المستلمة (اختياري)' : 'Beneficiary / Payee (Optional)'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute top-3 start-3 pointer-events-none" />
                  <input
                    id="expense-beneficiary-input"
                    type="text"
                    value={beneficiaryInput}
                    onChange={(e) => setBeneficiaryInput(e.target.value)}
                    placeholder={isAr ? 'اسم المستلم أو الجهة...' : 'Payee or vendor name...'}
                    className="w-full ps-9 pe-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Operation / Reference Number */}
              <div>
                <label
                  htmlFor="expense-reference-input"
                  className="block text-xs font-bold text-neutral-300 mb-1.5"
                >
                  {isAr
                    ? 'رقم العملية / الإيصال (اختياري)'
                    : 'Transfer / Receipt Reference # (Optional)'}
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-neutral-500 absolute top-3 start-3 pointer-events-none" />
                  <input
                    id="expense-reference-input"
                    type="text"
                    value={transferReferenceInput}
                    onChange={(e) => setTransferReferenceInput(e.target.value)}
                    placeholder={isAr ? 'رقم إشعار بنكك أو الإيصال...' : 'Bank ref or voucher #...'}
                    className="w-full ps-9 pe-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Receipt Image Attachment */}
              <div>
                <span className="block text-xs font-bold text-neutral-300 mb-1.5">
                  {isAr ? 'صورة الإشعار أو الفاتورة (اختياري)' : 'Receipt Image (Optional)'}
                </span>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 cursor-pointer transition-all">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span className="truncate">
                      {receiptImageInput
                        ? isAr
                          ? 'تغيير الصورة المرفقة'
                          : 'Change Attached Image'
                        : isAr
                        ? 'إرفاق صورة الإشعار'
                        : 'Attach Receipt Image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptImageChange}
                      className="hidden"
                    />
                  </label>
                  {receiptImageInput && (
                    <button
                      type="button"
                      onClick={() => setReceiptImageInput('')}
                      aria-label={isAr ? 'إزالة الصورة' : 'Remove image'}
                      className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="expense-notes-input"
                className="block text-xs font-bold text-neutral-300 mb-1.5"
              >
                {isAr ? 'ملاحظات إضافية' : 'Additional Notes'}
              </label>
              <input
                id="expense-notes-input"
                type="text"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder={
                  isAr ? 'أي تفاصيل إضافية حول سبب الصرف...' : 'Any extra details about this expense...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-800">
              <TactileButton
                type="button"
                variant="secondary"
                size="md"
                onClick={() => {
                  resetFormFields();
                  setIsFormOpen(false);
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </TactileButton>
              <TactileButton
                data-testid="submit-expense-btn"
                type="submit"
                variant="amber"
                size="md"
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                {editingExpenseId
                  ? isAr
                    ? 'حفظ تعديلات السند'
                    : 'Save Changes'
                  : isAr
                  ? 'حفظ واعتماد سند الصرف'
                  : 'Save Expense Voucher'}
              </TactileButton>
            </div>
          </form>
        </AppCard>
      )}

      {/* Visual Breakdown by Category & Cash Flow Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recharts Category Bar Chart */}
        <AppCard className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                {isAr ? 'تحليل المنصرفات حسب البنود (Recharts)' : 'Expenses Breakdown by Category'}
              </h2>
              <p className="text-[11px] text-neutral-400">
                {isAr
                  ? 'مقارنة حجم الصرف الفعلي لكل بند تشغيلي بعملة العرض المختارة'
                  : 'Visual comparison of spending across each operating category'}
              </p>
            </div>
            {expenseSummary.topCategory && (
              <div className="px-3 py-1 rounded-xl bg-rose-950/50 border border-rose-500/30 text-xs">
                <span className="text-neutral-400">
                  {isAr ? 'أعلى بند صرف: ' : 'Top Category: '}
                </span>
                <span className="font-bold text-rose-300">
                  {expenseSummary.topCategory.emoji}{' '}
                  {isAr
                    ? expenseSummary.topCategory.labelAr
                    : expenseSummary.topCategory.labelEn}{' '}
                  ({expenseSummary.topCategory.sharePercent}%)
                </span>
              </div>
            )}
          </div>

          <div className="w-full h-[230px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryChartData}
                margin={{ top: 10, right: 16, left: 4, bottom: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 4"
                  stroke="#1f2937"
                  strokeOpacity={0.7}
                  vertical={false}
                />
                <XAxis
                  dataKey="shortName"
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#1f2937' }}
                />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                />
                <Tooltip
                  cursor={{ fill: '#ffffff', opacity: 0.04 }}
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const row = payload[0]?.payload;
                    if (!row) return null;
                    return (
                      <div
                        className="bg-neutral-950/95 border border-neutral-700 rounded-2xl p-3 shadow-2xl text-xs space-y-1"
                        dir={isAr ? 'rtl' : 'ltr'}
                      >
                        <div className="font-extrabold text-white flex items-center gap-1.5">
                          <span>{row.emoji}</span>
                          <span>{row.name}</span>
                        </div>
                        <div className="text-rose-400 font-mono font-bold">
                          {formatCurrency(row.amount, displayCurrency, settings.language)}
                        </div>
                        <div className="text-neutral-400 text-[11px]">
                          {row.count} {isAr ? 'سندات' : 'vouchers'} • {row.sharePercent}%
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={42}>
                  {categoryChartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.colorHex} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AppCard>

        {/* Category Progress List & Payment Methods */}
        <AppCard className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-white border-b border-neutral-800 pb-2.5">
              {isAr ? 'توزيع نسب البنود وطرق الصرف' : 'Category Shares & Payment Methods'}
            </h3>

            <div className="space-y-2.5 max-h-[165px] overflow-y-auto pe-1">
              {expenseSummary.byCategory
                .filter((c) => c.totalAmount > 0)
                .map((cat) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-200 flex items-center gap-1.5 truncate">
                        <span>{cat.emoji}</span>
                        <span className="truncate">{isAr ? cat.labelAr : cat.labelEn}</span>
                      </span>
                      <span className="font-mono font-bold text-rose-400 shrink-0">
                        {formatCurrency(cat.totalAmount, displayCurrency, settings.language)} (
                        {cat.sharePercent}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, Math.max(4, cat.sharePercent))}%`,
                          backgroundColor: cat.colorHex,
                        }}
                      />
                    </div>
                  </div>
                ))}

              {expenseSummary.totalExpenses === 0 && (
                <div className="text-xs text-neutral-500 py-6 text-center">
                  {isAr
                    ? 'لا توجد منصرفات مسجلة بعد لعرض التوزيع النسبي.'
                    : 'No expenses recorded yet.'}
                </div>
              )}
            </div>
          </div>

          {/* Net Cash After Expenses Box */}
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">
                {isAr ? 'المبيعات المحصلة نقداً/بنكياً:' : 'Collected Sales:'}
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {formatCurrency(
                  netFinancials.collectedSales,
                  displayCurrency,
                  settings.language
                )}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">
                {isAr ? 'إجمالي المنصرفات المخصومة:' : 'Less Operating Expenses:'}
              </span>
              <span className="font-mono font-bold text-rose-400">
                -{formatCurrency(expenseSummary.totalExpenses, displayCurrency, settings.language)}
              </span>
            </div>
            <div className="pt-1.5 border-t border-neutral-800 flex items-center justify-between text-xs font-extrabold">
              <span className="text-white">
                {isAr ? 'صافي السيولة بعد المنصرفات:' : 'Net Cash After Expenses:'}
              </span>
              <span
                className={`font-mono ${
                  netFinancials.netCashAfterExpenses >= 0 ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {formatCurrency(
                  netFinancials.netCashAfterExpenses,
                  displayCurrency,
                  settings.language
                )}
              </span>
            </div>
          </div>
        </AppCard>
      </div>

      {/* Filters & Search Bar */}
      <AppCard className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute top-3 start-3.5 pointer-events-none" />
            <input
              data-testid="expenses-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAr
                  ? 'ابحث في المنصرفات بالبيان، رقم السند، المستفيد، أو رقم العملية...'
                  : 'Search expenses by title, voucher ID, beneficiary, or reference...'
              }
              className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Status & Valuation Mode Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-1 gap-1">
              {(
                [
                  { id: 'all', labelAr: 'الكل', labelEn: 'All' },
                  { id: 'recorded', labelAr: 'معتمد', labelEn: 'Active' },
                  { id: 'voided', labelAr: 'ملغي', labelEn: 'Voided' },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === st.id
                      ? 'bg-amber-500 text-neutral-950'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {isAr ? st.labelAr : st.labelEn}
                </button>
              ))}
            </div>

            <select
              aria-label={isAr ? 'طريقة تقييم سعر الصرف' : 'Exchange rate valuation mode'}
              value={valuationMode}
              onChange={(e) => setValuationMode(e.target.value as SalesRateValuationMode)}
              className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-semibold text-neutral-300 focus:outline-none"
            >
              <option value="historical">
                {isAr ? 'سعر الصرف وقت السند' : 'Historical Voucher Rate'}
              </option>
              <option value="live">
                {isAr ? 'سعر الصرف الحالي المباشر' : 'Current Live Rate'}
              </option>
              <option value="indexed">
                {isAr ? 'مربوط بسعر الدولار الحالي' : 'USD-Indexed Rate'}
              </option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Filter className="w-3.5 h-3.5 text-neutral-500 shrink-0 me-1" />
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition-all ${
              selectedCategoryFilter === 'all'
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {isAr ? 'جميع البنود' : 'All Categories'} ({expenses.length})
          </button>

          {EXPENSE_CATEGORIES.map((cat) => {
            const active = selectedCategoryFilter === cat.id;
            const count = expenses.filter((e) => e.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                {count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-md bg-neutral-800 text-[10px] text-neutral-300">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Expenses List / Table */}
        <div className="space-y-2.5 pt-2">
          {filteredExpenses.length === 0 ? (
            <div className="py-12 text-center bg-neutral-950/60 border border-neutral-800/80 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 flex items-center justify-center mx-auto">
                <Wallet className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-neutral-300">
                  {isAr
                    ? 'لا توجد سندات منصرفات مطابقة للبحث الحالي'
                    : 'No expense vouchers match the current filter'}
                </p>
                <p className="text-xs text-neutral-500">
                  {isAr
                    ? 'اضغط على زر "إضافة منصرف جديد" لتسجيل أول سند صرف في النظام'
                    : 'Click "Add New Expense" above to record an operating expense'}
                </p>
              </div>
            </div>
          ) : (
            filteredExpenses.map((exp) => {
              const catMeta = getExpenseCategoryMeta(exp.category);
              const view = getConvertedExpenseView(
                exp,
                displayCurrency,
                exchangeRates,
                valuationMode,
                'USD'
              );
              const isVoided = exp.status === 'voided';
              const isDifferentCurrency =
                exp.currency.toUpperCase() !== displayCurrency.toUpperCase();

              return (
                <div
                  key={exp.id}
                  data-testid={`expense-row-${exp.id}`}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isVoided
                      ? 'bg-neutral-950/40 border-neutral-800/50 opacity-60'
                      : 'bg-neutral-950/90 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg shrink-0 border"
                      style={{
                        backgroundColor: `${catMeta.colorHex}18`,
                        borderColor: `${catMeta.colorHex}45`,
                      }}
                    >
                      {catMeta.emoji}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm font-extrabold truncate ${
                            isVoided ? 'line-through text-neutral-400' : 'text-white'
                          }`}
                        >
                          {exp.title}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-lg text-[10px] font-bold border"
                          style={{
                            backgroundColor: `${catMeta.colorHex}15`,
                            borderColor: `${catMeta.colorHex}40`,
                            color: catMeta.colorHex,
                          }}
                        >
                          {isAr ? catMeta.labelAr : catMeta.labelEn}
                        </span>
                        {isVoided && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-700/50">
                            {isAr ? 'ملغي' : 'VOIDED'}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-400">
                        <span className="font-mono text-neutral-500">{exp.id}</span>
                        <span>•</span>
                        <span>
                          {new Date(exp.timestamp).toLocaleString(
                            isAr ? 'ar-SA' : 'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </span>
                        <span>•</span>
                        <span className="text-neutral-300 font-semibold">
                          {formatPaymentMethodLabel(exp.paymentMethod, settings.language)}
                        </span>
                        {exp.transferReference && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-amber-400">
                              #{exp.transferReference}
                            </span>
                          </>
                        )}
                        {exp.beneficiary && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-300">
                              {isAr ? 'المستفيد:' : 'To:'} {exp.beneficiary}
                            </span>
                          </>
                        )}
                      </div>

                      {exp.notes && (
                        <p className="text-[11px] text-neutral-500 truncate max-w-xl">
                          {exp.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Amount & Action Buttons */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 border-neutral-800/80 pt-2.5 sm:pt-0">
                    <div className="text-end">
                      <div
                        className={`text-base sm:text-lg font-extrabold font-mono tabular-nums ${
                          isVoided ? 'line-through text-neutral-500' : 'text-rose-400'
                        }`}
                      >
                        -{formatCurrency(view.convertedAmount, displayCurrency, settings.language)}
                      </div>
                      {isDifferentCurrency && (
                        <div className="text-[10px] font-mono text-neutral-400">
                          {isAr ? 'أصل السند:' : 'Orig:'}{' '}
                          {formatCurrency(exp.amount, exp.currency, settings.language)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setInspectedVoucher(exp)}
                        aria-label={
                          isAr ? `عرض سند الصرف ${exp.title}` : `View voucher ${exp.title}`
                        }
                        className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-all"
                        title={isAr ? 'عرض وطباعة السند' : 'View & Print Voucher'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditExpenseForm(exp)}
                        aria-label={isAr ? `تعديل المنصرف ${exp.title}` : `Edit ${exp.title}`}
                        className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-amber-400 hover:text-amber-300 transition-all"
                        title={isAr ? 'تعديل' : 'Edit'}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => voidExpense(exp.id)}
                        aria-label={
                          isVoided
                            ? isAr
                              ? `استعادة المنصرف ${exp.title}`
                              : `Restore ${exp.title}`
                            : isAr
                            ? `إلغاء المنصرف ${exp.title}`
                            : `Void ${exp.title}`
                        }
                        className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-amber-300 transition-all"
                        title={
                          isVoided
                            ? isAr
                              ? 'استعادة السند'
                              : 'Restore Voucher'
                            : isAr
                            ? 'إلغاء السند'
                            : 'Void Voucher'
                        }
                      >
                        {isVoided ? (
                          <RotateCcw className="w-3.5 h-3.5" />
                        ) : (
                          <Ban className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteExpense(exp.id)}
                        aria-label={isAr ? `حذف المنصرف ${exp.title}` : `Delete ${exp.title}`}
                        className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-400 hover:text-rose-200 transition-all"
                        title={isAr ? 'حذف نهائي' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </AppCard>

      {/* Expense Voucher Details & Print Modal */}
      {inspectedVoucher && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isAr ? 'تفاصيل سند الصرف' : 'Expense Voucher Details'}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-neutral-900 border border-neutral-700 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 block">
                  {isAr ? 'سند صرف مالي' : 'EXPENSE VOUCHER'}
                </span>
                <h3 className="text-lg font-extrabold text-white">{inspectedVoucher.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedVoucher(null)}
                aria-label={isAr ? 'إغلاق السند' : 'Close voucher'}
                className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">{isAr ? 'البيان:' : 'Description:'}</span>
                <span className="font-bold text-white">{inspectedVoucher.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">{isAr ? 'البند / التصنيف:' : 'Category:'}</span>
                <span className="font-semibold text-amber-400">
                  {formatExpenseCategoryLabel(inspectedVoucher.category, settings.language)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">{isAr ? 'المبلغ:' : 'Amount:'}</span>
                <span className="text-base font-extrabold font-mono text-rose-400">
                  {formatCurrency(
                    inspectedVoucher.amount,
                    inspectedVoucher.currency,
                    settings.language
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">{isAr ? 'طريقة الدفع:' : 'Payment Method:'}</span>
                <span className="font-semibold text-neutral-200">
                  {formatPaymentMethodLabel(inspectedVoucher.paymentMethod, settings.language)}
                </span>
              </div>
              {inspectedVoucher.transferReference && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">{isAr ? 'رقم العملية:' : 'Reference #:'}</span>
                  <span className="font-mono text-amber-300">
                    {inspectedVoucher.transferReference}
                  </span>
                </div>
              )}
              {inspectedVoucher.beneficiary && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">{isAr ? 'المستفيد:' : 'Beneficiary:'}</span>
                  <span className="font-semibold text-emerald-300">
                    {inspectedVoucher.beneficiary}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">{isAr ? 'التاريخ والوقت:' : 'Timestamp:'}</span>
                <span className="font-mono text-neutral-300">
                  {new Date(inspectedVoucher.timestamp).toLocaleString(
                    isAr ? 'ar-SA' : 'en-US'
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">{isAr ? 'بواسطة:' : 'Recorded By:'}</span>
                <span className="text-neutral-300">{inspectedVoucher.recordedBy}</span>
              </div>
              {inspectedVoucher.notes && (
                <div className="pt-2 border-t border-neutral-800">
                  <span className="text-neutral-400 block mb-1">
                    {isAr ? 'ملاحظات:' : 'Notes:'}
                  </span>
                  <p className="text-neutral-200">{inspectedVoucher.notes}</p>
                </div>
              )}
              {inspectedVoucher.receiptImage && (
                <div className="pt-2 border-t border-neutral-800 space-y-1.5">
                  <span className="text-neutral-400 block">
                    {isAr ? 'صورة الإشعار / الفاتورة المرفقة:' : 'Attached Receipt Image:'}
                  </span>
                  <img
                    src={inspectedVoucher.receiptImage}
                    alt={inspectedVoucher.title}
                    className="w-full max-h-48 object-contain rounded-xl border border-neutral-800 bg-neutral-900"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <TactileButton
                variant="secondary"
                size="md"
                onClick={() => window.print()}
                leftIcon={<Printer className="w-4 h-4" />}
              >
                {isAr ? 'طباعة السند' : 'Print Voucher'}
              </TactileButton>
              <TactileButton
                variant="amber"
                size="md"
                onClick={() => setInspectedVoucher(null)}
              >
                {isAr ? 'إغلاق' : 'Close'}
              </TactileButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
