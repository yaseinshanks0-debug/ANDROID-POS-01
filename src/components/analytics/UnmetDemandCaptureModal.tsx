/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 10 (Part 4A & 4B): Fast Customer Unmet Demand Request Capture Modal
 * Enables cashiers and inventory staff to record unavailable/out-of-stock/expired/unregistered
 * customer product requests in 2–3 clicks without mutating sales, stock, or accounting ledgers.
 * Includes the searchable Unavailable Products Knowledge Base (`قاعدة المنتجات غير المتوفرة`)
 * supporting multi-word, partial-word, and single-character Arabic/English search.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Barcode,
  Building2,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  Database,
  History,
  Layers,
  PackagePlus,
  PackageX,
  Plus,
  Search,
  User,
  X,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { DEFAULT_ANALYTICS_BRANCHES as DEFAULT_BRANCHES } from '../../analytics/analytics.snapshot';
import {
  UnavailabilityReason,
} from '../../analytics/analytics.types';
import {
  UnavailableProductKnowledgeItem,
  buildUnavailableProductsKnowledgeBase,
  matchesUnavailableProductQuery,
  normalizeUnavailableSearchText,
  searchUnavailableProductsKnowledgeBase,
} from '../../analytics/unmet-demand.validation';
import { getProductPackaging } from '../../lib/pos-calculations';

const REASON_OPTIONS: Array<{
  value: UnavailabilityReason;
  labelEn: string;
  labelAr: string;
  badgeClass: string;
}> = [
  {
    value: 'OUT_OF_STOCK',
    labelEn: 'Out of Stock (Zero / Insufficient Inventory)',
    labelAr: 'نفاد المخزون (الرصيد صفر أو غير كافٍ)',
    badgeClass: 'border-rose-500/40 bg-rose-500/15 text-rose-300',
  },
  {
    value: 'EXPIRED',
    labelEn: 'Expired Batch on Shelf',
    labelAr: 'المنتج منتهي الصلاحية على الرف',
    badgeClass: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
  },
  {
    value: 'NOT_STOCKED',
    labelEn: 'Not Stocked / Unregistered Product',
    labelAr: 'غير مسجل أو غير متوفر بالمتجر',
    badgeClass: 'border-violet-500/40 bg-violet-500/15 text-violet-300',
  },
  {
    value: 'TEMPORARILY_UNAVAILABLE',
    labelEn: 'Temporarily Unavailable / In Transit',
    labelAr: 'غير متوفر مؤقتاً / قيد التوريد',
    badgeClass: 'border-sky-500/40 bg-sky-500/15 text-sky-300',
  },
  {
    value: 'OTHER',
    labelEn: 'Other Reason',
    labelAr: 'سبب آخر',
    badgeClass: 'border-neutral-500/40 bg-neutral-500/15 text-neutral-300',
  },
];

function formatInquiryDateTime(iso: string, isAr: boolean): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 16).replace('T', ' ');
  try {
    return d.toLocaleString(isAr ? 'ar-SD' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso.slice(0, 16).replace('T', ' ');
  }
}

export const UnmetDemandCaptureModal: React.FC = () => {
  const {
    products,
    customers,
    settings,
    currentUser,
    selectedCustomer,
    unmetDemandRequests,
    isUnmetDemandModalOpen,
    unmetDemandModalInitialData,
    closeUnmetDemandModal,
    recordUnmetDemandRequest,
  } = usePOS();

  const isAr = settings.language === 'ar';

  const [mode, setMode] = useState<'registered' | 'unregistered'>('registered');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [productSearch, setProductSearch] = useState<string>('');
  const [unregisteredName, setUnregisteredName] = useState<string>('');
  const [unregisteredNameAr, setUnregisteredNameAr] = useState<string>('');
  const [barcode, setBarcode] = useState<string>('');
  const [categorySnapshot, setCategorySnapshot] = useState<string>('General');
  const [requestedQuantity, setRequestedQuantity] = useState<number>(1);
  const [saleUnitMode, setSaleUnitMode] = useState<'unit' | 'pack'>('unit');
  const [unavailabilityReason, setUnavailabilityReason] =
    useState<UnavailabilityReason>('OUT_OF_STOCK');
  const [confirmedPurchaseIntent, setConfirmedPurchaseIntent] =
    useState<boolean>(true);
  const [branchId, setBranchId] = useState<string>('branch-main');
  const [customerId, setCustomerId] = useState<string>('');
  const [customerReference, setCustomerReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [sourceScreen, setSourceScreen] = useState<
    'checkout' | 'products' | 'analytics' | 'other'
  >('checkout');
  const [selectedKnowledgeKey, setSelectedKnowledgeKey] = useState<string | null>(
    null
  );

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'duplicate' | 'error';
    message: string;
  } | null>(null);

  // Build the Unified Unavailable Products Knowledge Base (`قاعدة المنتجات غير المتوفرة`)
  const unavailableKnowledgeBase = useMemo(
    () =>
      buildUnavailableProductsKnowledgeBase(
        unmetDemandRequests || [],
        products || []
      ),
    [unmetDemandRequests, products]
  );

  useEffect(() => {
    if (!isUnmetDemandModalOpen) return;
    setFeedback(null);
    setSelectedKnowledgeKey(null);

    const init = unmetDemandModalInitialData || {};
    const initialProdId = init.productId || '';
    const hasInitialProduct = Boolean(
      initialProdId && products.some((p) => p.id === initialProdId)
    );

    if (
      init.isRegisteredProduct === false ||
      (!hasInitialProduct && init.productNameSnapshot)
    ) {
      setMode('unregistered');
      setSelectedProductId('');
      setUnregisteredName(init.productNameSnapshot || '');
      setUnregisteredNameAr(init.productNameArSnapshot || '');
      setBarcode(init.barcode || '');
      setCategorySnapshot(init.categorySnapshot || 'General');
      setUnavailabilityReason(
        (init.unavailabilityReason as UnavailabilityReason) || 'NOT_STOCKED'
      );
    } else {
      setMode('registered');
      if (hasInitialProduct) {
        setSelectedProductId(initialProdId!);
      } else {
        const lowOrZero =
          products.find((p) => p.stock <= 0) ||
          products.find((p) => p.stock <= (p.minStockAlert || 5)) ||
          products[0];
        setSelectedProductId(lowOrZero ? lowOrZero.id : '');
      }
      setUnregisteredName('');
      setUnregisteredNameAr('');
      setBarcode(init.barcode || '');
      setUnavailabilityReason(
        (init.unavailabilityReason as UnavailabilityReason) || 'OUT_OF_STOCK'
      );
    }

    setProductSearch('');
    setRequestedQuantity(
      init.requestedQuantity && init.requestedQuantity > 0
        ? init.requestedQuantity
        : 1
    );
    setSaleUnitMode(init.saleUnitMode === 'pack' ? 'pack' : 'unit');
    setConfirmedPurchaseIntent(init.confirmedPurchaseIntent ?? true);
    setBranchId(init.branchId || 'branch-main');
    setCustomerId(init.customerId || selectedCustomer?.id || '');
    setCustomerReference(init.customerReference || selectedCustomer?.name || '');
    setNotes(init.notes || '');
    setSourceScreen(
      (init.sourceScreen as 'checkout' | 'products' | 'analytics' | 'other') ||
        'checkout'
    );
  }, [
    isUnmetDemandModalOpen,
    unmetDemandModalInitialData,
    products,
    selectedCustomer,
  ]);

  const activeProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || null,
    [products, selectedProductId]
  );

  const activePackaging = useMemo(
    () => (activeProduct ? getProductPackaging(activeProduct) : null),
    [activeProduct]
  );

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim();
    const sorted = [...products].sort((a, b) => a.stock - b.stock);
    if (!q) return sorted;
    return sorted.filter((p) =>
      matchesUnavailableProductQuery(
        [
          p.name,
          p.nameAr,
          p.sku,
          p.barcode,
          ...(Array.isArray(p.barcodes) ? p.barcodes : []),
          p.category,
        ],
        q
      )
    );
  }, [products, productSearch]);

  // Search results from the Unavailable Products Knowledge Base (`قاعدة المنتجات غير المتوفرة`)
  // Searches by any word, partial word, or single character in the product name!
  const activeSearchQuery =
    mode === 'unregistered' ? unregisteredName : productSearch;

  const matchingKnowledgeItems = useMemo(() => {
    return searchUnavailableProductsKnowledgeBase(
      unavailableKnowledgeBase,
      activeSearchQuery,
      {
        onlyUnregisteredOrPreviouslyAsked: true,
        limit: 10,
      }
    );
  }, [unavailableKnowledgeBase, activeSearchQuery]);

  const selectedKnowledgeItem = useMemo(() => {
    if (selectedKnowledgeKey) {
      return (
        unavailableKnowledgeBase.find((i) => i.key === selectedKnowledgeKey) ||
        null
      );
    }
    if (mode === 'unregistered' && unregisteredName.trim()) {
      const normTyped = normalizeUnavailableSearchText(unregisteredName);
      return (
        unavailableKnowledgeBase.find(
          (i) =>
            i.inquiryCount > 0 &&
            (normalizeUnavailableSearchText(i.productName) === normTyped ||
              (i.productNameAr &&
                normalizeUnavailableSearchText(i.productNameAr) === normTyped))
        ) || null
      );
    }
    return null;
  }, [
    selectedKnowledgeKey,
    unavailableKnowledgeBase,
    mode,
    unregisteredName,
  ]);

  const handleSelectKnowledgeItem = (item: UnavailableProductKnowledgeItem) => {
    setFeedback(null);
    setSelectedKnowledgeKey(item.key);
    if (item.isRegisteredProduct && item.productId) {
      const existsInCatalog = products.some((p) => p.id === item.productId);
      if (existsInCatalog) {
        setMode('registered');
        setSelectedProductId(item.productId);
        setUnavailabilityReason(
          item.unavailabilityReason === 'NOT_STOCKED'
            ? 'OUT_OF_STOCK'
            : item.unavailabilityReason
        );
        return;
      }
    }
    setMode('unregistered');
    setUnregisteredName(item.productName);
    setUnregisteredNameAr(item.productNameAr || item.productName);
    if (item.barcode) setBarcode(item.barcode);
    if (item.category && item.category !== 'Unregistered') {
      setCategorySnapshot(item.category);
    }
    setUnavailabilityReason(item.unavailabilityReason || 'NOT_STOCKED');
  };

  if (!isUnmetDemandModalOpen) return null;

  const submitDemandRecord = async (forceAllowRapidRepeat = false) => {
    setSubmitting(true);
    setFeedback(null);

    try {
      const isRegistered = mode === 'registered' && Boolean(activeProduct);
      const selectedCust = customers.find((c) => c.id === customerId);

      // If the user explicitly selected an item from the Unavailable Products Knowledge Base,
      // use its canonical name so repeat inquiries aggregate under the exact same product!
      const canonicalUnregisteredName =
        !isRegistered && selectedKnowledgeItem
          ? selectedKnowledgeItem.productName
          : unregisteredName.trim();

      const res = await recordUnmetDemandRequest({
        branchId,
        productId: isRegistered ? activeProduct!.id : null,
        isRegisteredProduct: isRegistered,
        productNameSnapshot: isRegistered
          ? activeProduct!.name
          : canonicalUnregisteredName,
        productNameArSnapshot: isRegistered
          ? activeProduct!.nameAr || null
          : unregisteredNameAr.trim() ||
            selectedKnowledgeItem?.productNameAr ||
            canonicalUnregisteredName ||
            null,
        barcode: isRegistered
          ? activeProduct!.barcode
          : barcode.trim() || selectedKnowledgeItem?.barcode || null,
        categorySnapshot: isRegistered
          ? activeProduct!.category
          : categorySnapshot.trim() ||
            selectedKnowledgeItem?.category ||
            'General',
        requestedQuantity,
        saleUnitMode:
          isRegistered && activePackaging?.enablePackaging
            ? saleUnitMode
            : 'unit',
        unavailabilityReason:
          mode === 'unregistered' && unavailabilityReason === 'OUT_OF_STOCK'
            ? 'NOT_STOCKED'
            : unavailabilityReason,
        confirmedPurchaseIntent,
        customerId: customerId || null,
        customerReference:
          customerReference.trim() || selectedCust?.name || null,
        notes: notes.trim() || null,
        sourceScreen,
        allowRapidRepeat:
          forceAllowRapidRepeat || Boolean(selectedKnowledgeItem),
      });

      if (!res.ok) {
        if (res.isDuplicateRapidSubmission) {
          setFeedback({
            type: 'duplicate',
            message: isAr
              ? 'تم تسجيل نفس السؤال خلال آخر 60 ثانية. اضغط "تأكيد تسجيل سؤال جديد لنفس المنتج" لتسجيله بوقت منفصل.'
              : 'Identical inquiry logged within the last 60 seconds. Click "Confirm Repeat Inquiry" to log it again.',
          });
          setSubmitting(false);
          return;
        }
        setFeedback({
          type: 'error',
          message: isAr
            ? res.errorAr || 'تعذر تسجيل الطلب'
            : res.errorEn || 'Could not record request',
        });
        setSubmitting(false);
        return;
      }

      const prevCount = selectedKnowledgeItem?.inquiryCount ?? 0;
      setFeedback({
        type: 'success',
        message: isAr
          ? prevCount > 0
            ? `تم تسجيل السؤال رقم (${prevCount + 1}) للمنتج "${canonicalUnregisteredName || activeProduct?.name}" بنجاح وإضافته لتقارير دعم اتخاذ القرار!`
            : 'تم تسجيل المنتج في قاعدة المنتجات غير المتوفرة وتقارير دعم اتخاذ القرار بنجاح!'
          : prevCount > 0
          ? `Recorded inquiry #${prevCount + 1} for "${canonicalUnregisteredName || activeProduct?.name}" in Decision Support Reports!`
          : 'Customer unmet demand inquiry recorded in Unavailable Products Database!',
      });

      setTimeout(() => {
        closeUnmetDemandModal();
      }, 900);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitDemandRecord(false);
  };

  const canChangeBranch =
    currentUser.role === 'admin' || currentUser.role === 'manager';

  const previouslyAskedCount = unavailableKnowledgeBase.filter(
    (i) => i.inquiryCount > 0
  ).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      dir={isAr ? 'rtl' : 'ltr'}
      data-testid="unmet-demand-modal"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950/70 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400">
              <PackageX className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  {isAr
                    ? 'تسجيل منتج غير متوفر وقاعدة المنتجات المطلوبة'
                    : 'Unavailable Product Capture & Knowledge Base'}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                  <Database className="h-3 w-3" />
                  {isAr
                    ? `${previouslyAskedCount} منتج في قاعدة غير المتوفر`
                    : `${previouslyAskedCount} in Unavailable DB`}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {isAr
                  ? 'ابحث بأي كلمة أو حرف في اسم المنتج لاختيار منتج سُئل عنه سابقاً بدلاً من تكرار إضافته، ليظهر بتواريخه في التقارير'
                  : 'Search by any word or character to select a previously requested item and track repeat inquiries across timestamps'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeUnmetDemandModal}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            data-testid="close-unmet-demand-modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto p-5"
        >
          {/* Mode Switch: Registered Catalog Product vs Unavailable / Unregistered Knowledge Base */}
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-neutral-800 bg-neutral-950 p-1.5">
            <button
              type="button"
              onClick={() => {
                setMode('registered');
                if (unavailabilityReason === 'NOT_STOCKED') {
                  setUnavailabilityReason('OUT_OF_STOCK');
                }
              }}
              data-testid="unmet-mode-registered"
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                mode === 'registered'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <ClipboardList className="h-4 w-4" />
              {isAr
                ? 'منتج مسجل بالكتالوج (نافد / منتهي)'
                : 'Registered Product (Out of Stock / Expired)'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('unregistered');
                setUnavailabilityReason('NOT_STOCKED');
              }}
              data-testid="unmet-mode-unregistered"
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                mode === 'unregistered'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <PackagePlus className="h-4 w-4" />
              {isAr
                ? 'قاعدة المنتجات غير المتوفرة / منتج جديد'
                : 'Unavailable Products DB / New Item'}
            </button>
          </div>

          {mode === 'registered' ? (
            <div className="space-y-3 rounded-xl border border-neutral-800/80 bg-neutral-950/50 p-3.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-300">
                  {isAr
                    ? 'ابحث في الكتالوج أو قاعدة المنتجات غير المتوفرة (بأي كلمة أو حرف)'
                    : 'Search Catalog or Unavailable Products DB (by any word or letter)'}
                </label>
                {activeProduct && (
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${
                      activeProduct.stock <= 0
                        ? 'border-rose-500/40 bg-rose-500/15 text-rose-300'
                        : activeProduct.stock <= (activeProduct.minStockAlert || 5)
                        ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                        : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                    }`}
                  >
                    {isAr
                      ? `الرصيد الحالي: ${activeProduct.stock}`
                      : `Current Stock: ${activeProduct.stock}`}
                  </span>
                )}
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute top-2.5 start-3 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  data-testid="unmet-product-search"
                  placeholder={
                    isAr
                      ? 'اكتب أي كلمة أو حرف (مثال: كريم باريس، كريم، باريس، أو الباركود)...'
                      : 'Type any word, letter, or barcode...'
                  }
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 py-2 ps-9 pe-3 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                data-testid="unmet-product-select"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm font-medium text-white focus:border-amber-500 focus:outline-none"
              >
                {filteredProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.emoji} {isAr && p.nameAr ? p.nameAr : p.name} ({p.sku}) —{' '}
                    {isAr ? `المخزون: ${p.stock}` : `Stock: ${p.stock}`}
                  </option>
                ))}
              </select>

              {/* Cross-search results from Unavailable Products Knowledge Base when searching in Registered tab */}
              {productSearch.trim().length > 0 && matchingKnowledgeItems.length > 0 && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-2.5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <Database className="h-3.5 w-3.5" />
                      {isAr
                        ? 'نتائج مطابقة من قاعدة المنتجات غير المتوفرة المسجلة سابقاً:'
                        : 'Matches from Unavailable Products Knowledge Base:'}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {isAr ? 'اضغط لاختيار المنتج' : 'Click to select'}
                    </span>
                  </div>
                  <div className="max-h-36 space-y-1.5 overflow-y-auto">
                    {matchingKnowledgeItems.slice(0, 5).map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => handleSelectKnowledgeItem(item)}
                        className="flex w-full items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/90 px-3 py-2 text-start text-xs transition hover:border-amber-500/60 hover:bg-neutral-800"
                      >
                        <div>
                          <div className="font-bold text-white">{item.productName}</div>
                          <div className="text-[10px] text-neutral-400">
                            {item.category}
                            {item.lastRequestedAt
                              ? ` • ${isAr ? 'آخر سؤال:' : 'Last asked:'} ${formatInquiryDateTime(item.lastRequestedAt, isAr)}`
                              : ''}
                          </div>
                        </div>
                        <span className="rounded-md border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-300">
                          {isAr
                            ? `سُئل عنه ${item.inquiryCount} مرة`
                            : `Asked ${item.inquiryCount}x`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 rounded-xl border border-amber-500/30 bg-neutral-950/70 p-3.5">
              <div>
                <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5" />
                    {isAr
                      ? 'ابحث في قاعدة المنتجات غير المتوفرة أو اكتب اسم المنتج *'
                      : 'Search Unavailable Products DB or Type Product Name *'}
                  </label>
                  <span className="text-[11px] text-neutral-400">
                    {isAr
                      ? 'البحث يعمل بأي كلمة أو حرف (مثال: كريم، باريس، باري، كريم باريس)'
                      : 'Matches by any word, partial word, or character'}
                  </span>
                </div>
                <div className="relative">
                  <Search className="pointer-events-none absolute top-2.5 start-3 h-4 w-4 text-amber-400" />
                  <input
                    type="text"
                    required={mode === 'unregistered'}
                    value={unregisteredName}
                    onChange={(e) => {
                      setUnregisteredName(e.target.value);
                      if (
                        selectedKnowledgeItem &&
                        normalizeUnavailableSearchText(e.target.value) !==
                          normalizeUnavailableSearchText(
                            selectedKnowledgeItem.productName
                          )
                      ) {
                        setSelectedKnowledgeKey(null);
                      }
                    }}
                    data-testid="unmet-unregistered-name"
                    placeholder={
                      isAr
                        ? 'اكتب أي كلمة أو حرف للبحث أو الإضافة (مثال: كريم باريس الابيض / كريم / باريس)...'
                        : 'Type any word or letter to search or add (e.g., Paris Cream)...'
                    }
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-900 py-2.5 ps-9 pe-3 text-sm font-medium text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Banner when an existing Unavailable Product is selected from the Knowledge Base */}
              {selectedKnowledgeItem && selectedKnowledgeItem.inquiryCount > 0 && (
                <div
                  data-testid="selected-kb-product-banner"
                  className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-bold text-emerald-300">
                        {isAr
                          ? `تم اختيار المنتج من قاعدة غير المتوفر: "${selectedKnowledgeItem.productName}"`
                          : `Selected from Unavailable Products DB: "${selectedKnowledgeItem.productName}"`}
                      </span>
                    </div>
                    <span className="rounded-md border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 font-mono text-[11px] font-extrabold text-amber-300">
                      {isAr
                        ? `سُئل عنه ${selectedKnowledgeItem.inquiryCount} مرات سابقاً → سيصبح ${selectedKnowledgeItem.inquiryCount + 1} مرات`
                        : `Asked ${selectedKnowledgeItem.inquiryCount}x previously → Will become ${selectedKnowledgeItem.inquiryCount + 1}x`}
                    </span>
                  </div>

                  {selectedKnowledgeItem.inquiryTimestamps.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-300">
                      <History className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span className="text-neutral-400">
                        {isAr ? 'أوقات السؤال السابقة:' : 'Previous inquiry times:'}
                      </span>
                      {selectedKnowledgeItem.inquiryTimestamps
                        .slice(0, 4)
                        .map((ts, idx) => (
                          <span
                            key={`${ts}-${idx}`}
                            className="rounded bg-neutral-900/90 border border-neutral-800 px-1.5 py-0.5 font-mono text-[10px] text-neutral-300"
                          >
                            {formatInquiryDateTime(ts, isAr)}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Live Searchable Unavailable Products Knowledge Base List (`قاعدة المنتجات غير المتوفرة`) */}
              <div
                data-testid="unavailable-knowledge-base-panel"
                className="rounded-xl border border-neutral-800 bg-neutral-900/90 p-3 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Database className="h-3.5 w-3.5 text-amber-400" />
                    <span>
                      {isAr
                        ? unregisteredName.trim()
                          ? `نتائج البحث في قاعدة المنتجات غير المتوفرة (${matchingKnowledgeItems.length})`
                          : `قاعدة المنتجات غير المتوفرة المسجلة سابقاً (${matchingKnowledgeItems.length})`
                        : unregisteredName.trim()
                        ? `Matching Unavailable Products (${matchingKnowledgeItems.length})`
                        : `Previously Requested Unavailable Products (${matchingKnowledgeItems.length})`}
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-300/90 font-medium">
                    {isAr
                      ? 'اضغط على المنتج لاختياره وتسجيل سؤال جديد بنفس الاسم'
                      : 'Click an item to select it and log a repeat inquiry'}
                  </span>
                </div>

                {matchingKnowledgeItems.length > 0 ? (
                  <div className="max-h-44 space-y-1.5 overflow-y-auto pe-1">
                    {matchingKnowledgeItems.map((item) => {
                      const isSelected =
                        selectedKnowledgeItem?.key === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          data-testid={`kb-item-${item.key}`}
                          onClick={() => handleSelectKnowledgeItem(item)}
                          className={`flex w-full flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border p-2.5 text-start transition ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-950/30 shadow-sm'
                              : 'border-neutral-800 bg-neutral-950/80 hover:border-amber-500/60 hover:bg-neutral-900'
                          }`}
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-white">
                                {item.productName}
                              </span>
                              <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-neutral-300">
                                {item.category}
                              </span>
                              {item.barcode && (
                                <span className="font-mono text-[10px] text-neutral-400">
                                  #{item.barcode}
                                </span>
                              )}
                            </div>

                            {item.inquiryTimestamps.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 text-[10px] text-neutral-400">
                                <Clock className="h-3 w-3 text-amber-400/80" />
                                <span>
                                  {isAr ? 'آخر سؤال:' : 'Last asked:'}{' '}
                                  <strong className="font-mono text-neutral-300">
                                    {formatInquiryDateTime(
                                      item.lastRequestedAt,
                                      isAr
                                    )}
                                  </strong>
                                </span>
                                {item.inquiryTimestamps.length > 1 && (
                                  <span className="text-neutral-500">
                                    (
                                    {isAr
                                      ? `في ${item.inquiryTimestamps.length} أوقات مختلفة`
                                      : `across ${item.inquiryTimestamps.length} timestamps`}
                                    )
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="rounded-lg border border-amber-500/40 bg-amber-500/15 px-2.5 py-1 font-mono text-xs font-extrabold text-amber-300">
                              {isAr
                                ? `سُئل عنه ${item.inquiryCount} مرة`
                                : `Asked ${item.inquiryCount}x`}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${
                                isSelected
                                  ? 'bg-emerald-500 text-neutral-950'
                                  : 'bg-neutral-800 text-neutral-200'
                              }`}
                            >
                              {isSelected ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  {isAr ? 'محدد' : 'Selected'}
                                </>
                              ) : isAr ? (
                                'اختيار'
                              ) : (
                                'Select'
                              )}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-3 text-center text-xs text-neutral-400">
                    {isAr
                      ? 'لا يوجد منتج مطابق في قاعدة غير المتوفر — سيتم حفظ ما كتبته كمنتج جديد في قاعدة المنتجات غير المتوفرة.'
                      : 'No matching product in Unavailable DB — will be saved as a new entry in the Unavailable Products Database.'}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 flex items-center gap-1 text-xs font-medium text-neutral-400">
                    <Barcode className="h-3.5 w-3.5" />
                    {isAr ? 'الباركود الممسوح (اختياري)' : 'Scanned Barcode (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    data-testid="unmet-unregistered-barcode"
                    placeholder="490101099281"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-1 text-xs font-medium text-neutral-400">
                    <Layers className="h-3.5 w-3.5" />
                    {isAr ? 'التصنيف المتوقع' : 'Expected Category'}
                  </label>
                  <input
                    type="text"
                    value={categorySnapshot}
                    onChange={(e) => setCategorySnapshot(e.target.value)}
                    placeholder={
                      isAr
                        ? 'مستحضرات تجميل / عناية / مشروبات...'
                        : 'Cosmetics / Hair Care / Drinks'
                    }
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Quantity & Sale Unit Row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-3">
              <label className="mb-1.5 block text-xs font-semibold text-neutral-300">
                {isAr ? 'الكمية المطلوبة من العميل' : 'Requested Quantity'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={requestedQuantity}
                  onChange={(e) =>
                    setRequestedQuantity(Math.max(1, Number(e.target.value) || 1))
                  }
                  data-testid="unmet-quantity-input"
                  className="w-24 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-center text-sm font-bold text-white focus:border-amber-500 focus:outline-none"
                />
                <div className="flex flex-wrap gap-1">
                  {[1, 2, 3, 5, 10].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setRequestedQuantity(q)}
                      className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${
                        requestedQuantity === q
                          ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              {mode === 'registered' &&
                activePackaging?.enablePackaging &&
                activePackaging.unitsPerPack > 1 && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] text-neutral-400">
                      {isAr ? 'وحدة الطلب:' : 'Unit Mode:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSaleUnitMode('unit')}
                      className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                        saleUnitMode === 'unit'
                          ? 'bg-amber-500 text-neutral-950'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {isAr ? activePackaging.unitNameAr : activePackaging.unitName}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSaleUnitMode('pack')}
                      className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                        saleUnitMode === 'pack'
                          ? 'bg-amber-500 text-neutral-950'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {isAr ? activePackaging.packNameAr : activePackaging.packName}{' '}
                      ({activePackaging.unitsPerPack})
                    </button>
                  </div>
                )}
            </div>

            {/* Unavailability Reason */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-3">
              <label className="mb-1.5 block text-xs font-semibold text-neutral-300">
                {isAr ? 'سبب عدم التوفر' : 'Unavailability Reason'}
              </label>
              <select
                value={unavailabilityReason}
                onChange={(e) =>
                  setUnavailabilityReason(e.target.value as UnavailabilityReason)
                }
                data-testid="unmet-reason-select"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-medium text-white focus:border-amber-500 focus:outline-none"
              >
                {REASON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {isAr ? opt.labelAr : opt.labelEn}
                  </option>
                ))}
              </select>

              {/* Confirmed Purchase Intent Toggle */}
              <label className="mt-2.5 flex cursor-pointer items-center gap-2 text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={confirmedPurchaseIntent}
                  onChange={(e) => setConfirmedPurchaseIntent(e.target.checked)}
                  data-testid="unmet-confirmed-intent"
                  className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-amber-500"
                />
                <span>
                  {isAr
                    ? 'نية شراء مؤكدة (العميل كان مستعداً للدفع فوراً)'
                    : 'Confirmed Purchase Intent (Customer ready to buy)'}
                </span>
              </label>
            </div>
          </div>

          {/* Branch & Optional Customer / Notes */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 flex items-center gap-1 text-xs font-medium text-neutral-400">
                <Building2 className="h-3.5 w-3.5" />
                {isAr ? 'الفرع المسجل للطلب' : 'Store Branch'}
              </label>
              <select
                value={branchId}
                disabled={!canChangeBranch}
                onChange={(e) => setBranchId(e.target.value)}
                data-testid="unmet-branch-select"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white disabled:opacity-60"
              >
                {DEFAULT_BRANCHES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {isAr ? b.nameAr : b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-xs font-medium text-neutral-400">
                <User className="h-3.5 w-3.5" />
                {isAr ? 'العميل (اختياري)' : 'Customer (Optional)'}
              </label>
              <select
                value={customerId}
                onChange={(e) => {
                  const cId = e.target.value;
                  setCustomerId(cId);
                  const found = customers.find((c) => c.id === cId);
                  if (found) setCustomerReference(found.name);
                }}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white"
              >
                <option value="">
                  {isAr ? 'عميل نقدي عابر (بدون تحديد)' : 'Walk-in Customer (Unspecified)'}
                </option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">
              {isAr
                ? 'ملاحظات إضافية (مثل: العميل سأل عن نوع بالكرياتين أو طلب توفيره غداً)'
                : 'Notes (e.g., Customer asked for Keratin variant or restock by tomorrow)'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              data-testid="unmet-notes-input"
              placeholder={
                isAr
                  ? 'أضف ملاحظة مختصرة لفريق المشتريات والمخزون...'
                  : 'Short note for purchasing & inventory team...'
              }
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {feedback && (
            <div
              data-testid="unmet-feedback-banner"
              className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 text-xs font-medium ${
                feedback.type === 'success'
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                  : feedback.type === 'duplicate'
                  ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                  : 'border-rose-500/40 bg-rose-500/15 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
              {feedback.type === 'duplicate' && (
                <button
                  type="button"
                  onClick={() => submitDemandRecord(true)}
                  data-testid="confirm-repeat-inquiry-btn"
                  className="rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-neutral-950 hover:bg-amber-400"
                >
                  {isAr
                    ? 'تأكيد تسجيل سؤال جديد لنفس المنتج'
                    : 'Confirm Repeat Inquiry'}
                </button>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-neutral-800 pt-3">
            <button
              type="button"
              onClick={closeUnmetDemandModal}
              className="rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-800"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={submitting}
              data-testid="submit-unmet-demand-btn"
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-neutral-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {submitting
                ? isAr
                  ? 'جاري التسجيل...'
                  : 'Recording...'
                : selectedKnowledgeItem && selectedKnowledgeItem.inquiryCount > 0
                ? isAr
                  ? `تسجيل سؤال جديد (${selectedKnowledgeItem.inquiryCount + 1})`
                  : `Record Repeat Inquiry (#${selectedKnowledgeItem.inquiryCount + 1})`
                : isAr
                ? 'تسجيل الطلب غير المتوفر'
                : 'Record Unmet Demand'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
