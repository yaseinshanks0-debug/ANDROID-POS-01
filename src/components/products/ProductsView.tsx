/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { usePOS } from '../../context/POSContext';
import { getTranslation } from '../../lib/translations';
import {
  formatCurrency,
  convertCurrencyAmount,
  getProductPricesInCurrency,
} from '../../lib/pos-calculations';
import {
  generateBarcode,
  normalizeProductBarcodes,
  getAllProductBarcodes,
  matchesProductBarcode,
} from '../../lib/inventory-rules';
import { normalizeNumberInput, parseNormalizedNumber } from '../../lib/number-utils';
import { Product, SupportedCurrency } from '../../lib/types';
import { AppCard } from '../ui/AppCard';
import { AppInput } from '../ui/AppInput';
import { TactileButton } from '../ui/TactileButton';
import { HoldToConfirm } from '../ui/HoldToConfirm';
import { AppModal } from '../ui/AppModal';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Barcode,
  AlertTriangle,
  RefreshCw,
  X,
  Image as ImageIcon,
  Upload,
  Coins,
  TrendingUp,
  ArrowRightLeft,
  Check,
} from 'lucide-react';
import { playTactileClick } from '../../lib/sound-fx';

/**
 * Resizes an uploaded image File into a compact Data URL for reliable persistence.
 */
function compressImageFileToDataUrl(file: File, maxDim = 360): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onerror = () => resolve(dataUrl);
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.84);
          resolve(compressed);
        } catch {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export const ProductsView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    settings,
    updateSettings,
    currencies,
    exchangeRates,
  } = usePOS();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formNameAr, setFormNameAr] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formBarcode, setFormBarcode] = useState('');
  const [formAdditionalBarcodes, setFormAdditionalBarcodes] = useState<string[]>([]);
  const [newBarcodeInput, setNewBarcodeInput] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formPriceCurrency, setFormPriceCurrency] = useState<SupportedCurrency>(settings.currency || 'SDG');
  const [formCostPrice, setFormCostPrice] = useState('1000');
  const [formSellingPrice, setFormSellingPrice] = useState('1500');
  const [formStock, setFormStock] = useState('20');
  const [formMinStockAlert, setFormMinStockAlert] = useState('5');
  const [formEmoji, setFormEmoji] = useState('📦');
  const [formColorHex, setFormColorHex] = useState('#d97706');
  const [formImage, setFormImage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active currencies list
  const activeCurrencies = useMemo(() => {
    if (currencies && currencies.length > 0) {
      return currencies.filter((c) => c.isActive !== false);
    }
    return [
      { code: 'SDG', name: 'Sudanese Pound', nameAr: 'جنيه سوداني', symbol: 'ج.س', decimalPlaces: 2, isBase: true, isActive: true },
      { code: 'USD', name: 'US Dollar', nameAr: 'دولار أمريكي', symbol: '$', decimalPlaces: 2, isBase: false, isActive: true },
      { code: 'SAR', name: 'Saudi Riyal', nameAr: 'ريال سعودي', symbol: 'ر.س', decimalPlaces: 2, isBase: false, isActive: true },
      { code: 'AED', name: 'UAE Dirham', nameAr: 'درهم إماراتي', symbol: 'د.إ', decimalPlaces: 2, isBase: false, isActive: true },
    ];
  }, [currencies]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.nameAr && p.nameAr.includes(searchQuery)) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        matchesProductBarcode(p, searchQuery, false);

      const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, categoryFilter]);

  // Combined deduplicated barcodes in modal
  const allModalBarcodes = useMemo(() => {
    return normalizeProductBarcodes(formBarcode, formAdditionalBarcodes);
  }, [formBarcode, formAdditionalBarcodes]);

  // Live parsed cost & selling prices in modal
  const numericCostPrice = parseNormalizedNumber(formCostPrice, 0);
  const numericSellingPrice = parseNormalizedNumber(formSellingPrice, 0);
  const unitProfit = Math.round((numericSellingPrice - numericCostPrice) * 100) / 100;
  const profitMarginPercent =
    numericSellingPrice > 0
      ? Math.round(((numericSellingPrice - numericCostPrice) / numericSellingPrice) * 1000) / 10
      : 0;

  // Switch pricing currency inside the Add/Edit modal and automatically convert the entered cost & selling prices
  const handleModalCurrencyChange = (targetCurrCode: string) => {
    playTactileClick(settings.soundEnabled);
    const nextCode = targetCurrCode.toUpperCase();
    if (nextCode === formPriceCurrency) return;

    const currentCost = parseNormalizedNumber(formCostPrice, 0);
    const currentSelling = parseNormalizedNumber(formSellingPrice, 0);

    const convertedCost = convertCurrencyAmount(
      currentCost,
      formPriceCurrency,
      nextCode,
      exchangeRates
    );
    const convertedSelling = convertCurrencyAmount(
      currentSelling,
      formPriceCurrency,
      nextCode,
      exchangeRates
    );

    setFormPriceCurrency(nextCode);
    setFormCostPrice(String(convertedCost));
    setFormSellingPrice(String(convertedSelling));
  };

  // Add an additional barcode to the product in the modal
  const handleAddExtraBarcode = (customCode?: string) => {
    playTactileClick(settings.soundEnabled);
    const candidate = (customCode !== undefined ? customCode : newBarcodeInput).trim() || generateBarcode();

    if (!formBarcode.trim()) {
      setFormBarcode(candidate);
      setNewBarcodeInput('');
      return;
    }

    if (allModalBarcodes.includes(candidate)) {
      setErrorMessage(
        isAr
          ? `الباركود "${candidate}" مضاف بالفعل لهذا المنتج.`
          : `Barcode "${candidate}" is already added to this product.`
      );
      return;
    }

    // Check against other products
    const conflict = products.find(
      (p) => (!editingProduct || p.id !== editingProduct.id) && matchesProductBarcode(p, candidate, true)
    );
    if (conflict) {
      setErrorMessage(
        isAr
          ? `الباركود "${candidate}" مستخدم بالفعل للمنتج "${conflict.nameAr || conflict.name}".`
          : `Barcode "${candidate}" is already assigned to "${conflict.name}".`
      );
      return;
    }

    setErrorMessage(null);
    setFormAdditionalBarcodes((prev) => [...prev, candidate]);
    if (customCode === undefined) {
      setNewBarcodeInput('');
    }
  };

  const handleRemoveBarcode = (codeToRemove: string) => {
    playTactileClick(settings.soundEnabled);
    if (codeToRemove === formBarcode) {
      if (formAdditionalBarcodes.length > 0) {
        const [nextPrimary, ...rest] = formAdditionalBarcodes;
        setFormBarcode(nextPrimary);
        setFormAdditionalBarcodes(rest);
      } else {
        setFormBarcode(generateBarcode());
      }
    } else {
      setFormAdditionalBarcodes((prev) => prev.filter((c) => c !== codeToRemove));
    }
  };

  const handleSetPrimaryBarcode = (codeToPromote: string) => {
    playTactileClick(settings.soundEnabled);
    if (codeToPromote === formBarcode) return;
    const previousPrimary = formBarcode;
    setFormBarcode(codeToPromote);
    setFormAdditionalBarcodes((prev) =>
      normalizeProductBarcodes(
        previousPrimary,
        prev.filter((c) => c !== codeToPromote)
      )
    );
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFileToDataUrl(file);
      setFormImage(dataUrl);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process product image');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setErrorMessage(null);
    setFormName('');
    setFormNameAr('');
    const skuRand = Math.floor(100 + Math.random() * 900);
    setFormSku(`SKU-${skuRand}`);
    setFormBarcode(generateBarcode());
    setFormAdditionalBarcodes([]);
    setNewBarcodeInput('');
    setFormCategory(categories[0] || 'Beverages');
    const activeCurr = settings.currency || 'SDG';
    setFormPriceCurrency(activeCurr);
    const defaultCostSdg = 2700;
    const defaultSellSdg = 5400;
    setFormCostPrice(
      String(convertCurrencyAmount(defaultCostSdg, 'SDG', activeCurr, exchangeRates))
    );
    setFormSellingPrice(
      String(convertCurrencyAmount(defaultSellSdg, 'SDG', activeCurr, exchangeRates))
    );
    setFormStock('25');
    setFormMinStockAlert('5');
    setFormEmoji('☕');
    setFormColorHex('#d97706');
    setFormImage('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setErrorMessage(null);
    setFormName(p.name);
    setFormNameAr(p.nameAr || '');
    setFormSku(p.sku);
    const allCodes = getAllProductBarcodes(p);
    setFormBarcode(allCodes[0] || p.barcode);
    setFormAdditionalBarcodes(allCodes.slice(1));
    setNewBarcodeInput('');
    setFormCategory(p.category);

    // Load prices in the current active store currency so the user can edit or switch currencies seamlessly
    const displayCurr = settings.currency || p.priceCurrency || 'SDG';
    const converted = getProductPricesInCurrency(p, displayCurr, exchangeRates);
    setFormPriceCurrency(displayCurr);
    setFormCostPrice(converted.costPrice.toString());
    setFormSellingPrice(converted.sellingPrice.toString());
    setFormStock(p.stock.toString());
    setFormMinStockAlert(p.minStockAlert.toString());
    setFormEmoji(p.emoji || '📦');
    setFormColorHex(p.colorHex || '#d97706');
    setFormImage(p.image || p.imageUrl || p.customFields?.image || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setErrorMessage(null);

    // If user typed a barcode in the extra barcode box and didn't click "+", include it automatically
    const pendingExtra = newBarcodeInput.trim();
    const finalBarcodes = normalizeProductBarcodes(
      formBarcode.trim() || generateBarcode(),
      pendingExtra ? [...formAdditionalBarcodes, pendingExtra] : formAdditionalBarcodes
    );

    // Validate barcode uniqueness across other products
    for (const code of finalBarcodes) {
      const conflict = products.find(
        (p) => (!editingProduct || p.id !== editingProduct.id) && matchesProductBarcode(p, code, true)
      );
      if (conflict) {
        setErrorMessage(
          isAr
            ? `الباركود "${code}" مستخدم بالفعل للمنتج "${conflict.nameAr || conflict.name}".`
            : `Duplicate barcode: "${code}" is already assigned to "${conflict.name}".`
        );
        return;
      }
    }

    const rawCost = Math.max(0, parseNormalizedNumber(formCostPrice, 0));
    const rawSelling = Math.max(0, parseNormalizedNumber(formSellingPrice, 0));

    // Store prices in the selected pricing currency (and record priceCurrency so all currencies stay linked via exchangeRates)
    const cleanImage = formImage.trim() || undefined;

    const payload: Omit<Product, 'id' | 'updatedAt'> = {
      name: formName.trim(),
      nameAr: formNameAr.trim() || undefined,
      sku: formSku.trim() || `SKU-${Date.now()}`,
      barcode: finalBarcodes[0],
      barcodes: finalBarcodes,
      category: formCategory.trim() || 'General',
      costPrice: rawCost,
      sellingPrice: rawSelling,
      priceCurrency: formPriceCurrency,
      stock: Math.max(0, Math.floor(parseNormalizedNumber(formStock, 0))),
      minStockAlert: Math.max(0, Math.floor(parseNormalizedNumber(formMinStockAlert, 0))),
      image: cleanImage,
      imageUrl: cleanImage || null,
      emoji: formEmoji || '📦',
      colorHex: formColorHex || '#d97706',
      customFields: {
        ...(editingProduct?.customFields || {}),
        barcodes: finalBarcodes,
        priceCurrency: formPriceCurrency,
        ...(cleanImage ? { image: cleanImage } : {}),
      },
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await addProduct(payload);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete product');
    }
  };

  const activeRateToSdg =
    settings.currency === 'SDG' ? 1 : exchangeRates[settings.currency] || 1;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-5 pb-24">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {t.productCatalog}
          </h2>
          <span className="text-xs text-neutral-400">
            {isAr
              ? `${products.length} منتج مسجل • الأسعار مرتبطة تلقائياً بسعر الصرف`
              : `${products.length} registered catalog items • Prices dynamically linked to exchange rates`}
          </span>
        </div>

        <TactileButton
          variant="amber"
          size="md"
          onClick={openCreateModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {t.createProduct}
        </TactileButton>
      </div>

      {/* Live Currency Switcher Bar (Links all product prices with active currency & exchange rate) */}
      <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              {isAr
                ? 'عملة عرض وتسعير المنتجات (مرتبطة بسعر الصرف)'
                : 'Active Product Pricing Currency (Exchange Rate Linked)'}
            </div>
            <div className="text-[11px] font-mono text-neutral-400">
              {settings.currency === 'SDG'
                ? isAr
                  ? 'العملة الأساسية: الجنيه السوداني (SDG)'
                  : 'Base Accounting Currency: SDG (1.00)'
                : isAr
                ? `سعر الصرف الفعال: 1 ${settings.currency} = ${activeRateToSdg.toLocaleString()} ج.س (SDG)`
                : `Active Rate: 1 ${settings.currency} = ${activeRateToSdg.toLocaleString()} SDG`}
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-1.5">
          {activeCurrencies.map((curr) => {
            const isSelected = settings.currency === curr.code;
            const rateVal = curr.code === 'SDG' ? 1 : exchangeRates[curr.code] || 1;
            return (
              <button
                key={curr.code}
                type="button"
                onClick={() => {
                  playTactileClick(settings.soundEnabled);
                  updateSettings({ currency: curr.code });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-sm'
                    : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
                }`}
              >
                <span>{curr.code}</span>
                {curr.code !== 'SDG' && (
                  <span
                    className={`text-[10px] px-1 rounded ${
                      isSelected ? 'bg-neutral-950/20 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {rateVal}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <AppInput
            placeholder={
              isAr
                ? 'ابحث بالاسم، رمز الصنف SKU، أو أي باركود مضاف للمنتج...'
                : 'Search by name, SKU, or any product barcode...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={
              searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : undefined
            }
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="min-h-[46px] px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-amber-500"
        >
          <option value="all">{t.allCategories}</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredProducts.map((p) => {
          const isLow = p.stock <= p.minStockAlert;
          const isOut = p.stock <= 0;
          const allCodes = getAllProductBarcodes(p);
          const extraBarcodeCount = Math.max(0, allCodes.length - 1);
          const convertedPrices = getProductPricesInCurrency(p, settings.currency, exchangeRates);
          const productImg = p.image || p.imageUrl || p.customFields?.image;

          return (
            <AppCard key={p.id} className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    {productImg ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700/60 shrink-0">
                        <img
                          src={productImg}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <span
                        className="w-12 h-12 flex items-center justify-center text-2xl bg-neutral-800/80 rounded-xl border border-neutral-700/60 shrink-0"
                        style={{ backgroundColor: `${p.colorHex || '#d97706'}22` }}
                      >
                        {p.emoji || '📦'}
                      </span>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {settings.language === 'ar' && p.nameAr ? p.nameAr : p.name}
                      </h4>
                      <span className="text-xs text-neutral-400 font-mono">{p.sku}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold shrink-0 ${
                      isOut
                        ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                        : isLow
                        ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {isOut ? t.outOfStock : `${p.stock} ${isAr ? 'بالمخزون' : 'in stock'}`}
                  </span>
                </div>

                {/* Barcode & Extra Barcodes Badges */}
                <div className="flex items-center flex-wrap gap-1.5 text-xs font-mono text-neutral-400 my-2">
                  <div className="flex items-center gap-1.5 bg-neutral-950/80 px-2 py-1 rounded-lg border border-neutral-800">
                    <Barcode className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-neutral-200">{allCodes[0] || p.barcode}</span>
                  </div>
                  {extraBarcodeCount > 0 && (
                    <span
                      className="px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold"
                      title={allCodes.slice(1).join(', ')}
                    >
                      +{extraBarcodeCount} {isAr ? 'باركود' : 'barcodes'}
                    </span>
                  )}
                  <span className="text-neutral-600">·</span>
                  <span className="text-neutral-300 font-sans text-xs">{p.category}</span>
                </div>
              </div>

              {/* Purchase (Cost) Price, Selling Price & Edit Trigger */}
              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">
                      {isAr ? 'سعر الشراء (التكلفة)' : 'Purchase / Cost'}
                    </span>
                    <span className="text-xs font-bold font-mono text-neutral-200 tabular-nums">
                      {formatCurrency(convertedPrices.costPrice, settings.currency, settings.language)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">
                      {isAr ? 'سعر البيع' : 'Selling Price'}
                    </span>
                    <span className="text-sm font-extrabold font-mono text-emerald-400 tabular-nums">
                      {formatCurrency(convertedPrices.sellingPrice, settings.currency, settings.language)}
                    </span>
                  </div>
                </div>

                <TactileButton
                  variant="secondary"
                  size="sm"
                  onClick={() => openEditModal(p)}
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                >
                  {isAr ? 'تعديل' : 'Edit'}
                </TactileButton>
              </div>
            </AppCard>
          );
        })}
      </div>

      {/* Product Edit/Create Modal */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? t.editProduct : t.createProduct}
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4 max-h-[78vh] overflow-y-auto pr-1">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Product Names & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AppInput
              label={isAr ? 'اسم المنتج (انجليزي / افتراضي)' : t.productName}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder={isAr ? 'مثال: Specialty Coffee Beans' : 'e.g. Specialty Coffee Beans'}
              required
              autoFocus
            />

            <AppInput
              label={isAr ? 'الاسم بالعربية' : 'Arabic Name (الاسم بالعربية)'}
              value={formNameAr}
              onChange={(e) => setFormNameAr(e.target.value)}
              placeholder="مثال: بن قهوة مختصة"
            />
          </div>

          {/* 2. SKU & Multi-Barcode Management */}
          <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Barcode className="w-4 h-4" />
                <span>
                  {isAr
                    ? 'إدارة الباركود ورمز الصنف (يدعم عدة باركودات للمنتج الواحد)'
                    : 'SKU & Multi-Barcode Manager (Multiple Barcodes per Product)'}
                </span>
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                {isAr
                  ? `عدد الباركودات: ${allModalBarcodes.length}`
                  : `${allModalBarcodes.length} barcode(s)`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <AppInput
                label={t.sku}
                value={formSku}
                onChange={(e) => setFormSku(e.target.value)}
                required
              />

              <div className="sm:col-span-2 min-w-0">
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  {isAr ? 'الباركود الأساسي للمنتج' : 'Primary Product Barcode'}
                </label>
                <div className="flex gap-2 min-w-0">
                  <input
                    type="text"
                    dir="ltr"
                    value={formBarcode}
                    onChange={(e) => setFormBarcode(e.target.value)}
                    placeholder="200123456789"
                    className="flex-1 min-w-0 min-h-[44px] px-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      playTactileClick(settings.soundEnabled);
                      setFormBarcode(generateBarcode());
                    }}
                    className="px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 shrink-0 border border-neutral-700 whitespace-nowrap"
                    title={isAr ? 'توليد باركود أساسي جديد' : 'Generate new primary barcode'}
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'توليد باركود' : 'Generate'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Add Additional Barcode Input & Button */}
            <div className="pt-2 border-t border-neutral-800/80">
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                {isAr
                  ? 'إضافة باركود إضافي للمنتج (عبوة، كرتون، باركود بديل)'
                  : 'Add Additional Barcode (Box, Pack, or Alternate Barcode)'}
              </label>
              <div className="flex flex-col sm:flex-row gap-2 min-w-0">
                <input
                  type="text"
                  dir="ltr"
                  value={newBarcodeInput}
                  onChange={(e) => setNewBarcodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddExtraBarcode();
                    }
                  }}
                  placeholder={
                    isAr
                      ? 'اكتب أو امسح الباركود الإضافي أو اضغط إضافة للتوليد التلقائي...'
                      : 'Type/scan extra barcode or click Add Barcode to auto-generate...'
                  }
                  className="flex-1 min-w-0 min-h-[42px] px-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddExtraBarcode()}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إضافة باركود' : 'Add Barcode'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddExtraBarcode(generateBarcode())}
                    className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Barcode className="w-3.5 h-3.5" />
                    <span>{isAr ? '+ توليد باركود إضافي' : '+ Auto Barcode'}</span>
                  </button>
                </div>
              </div>

              {/* List of all attached barcodes */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {allModalBarcodes.map((code, idx) => {
                  const isPrimary = idx === 0;
                  return (
                    <div
                      key={code}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border ${
                        isPrimary
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold'
                          : 'bg-neutral-900 border-neutral-700 text-neutral-200'
                      }`}
                    >
                      <Barcode className="w-3 h-3 shrink-0" />
                      <span>{code}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded ${
                          isPrimary
                            ? 'bg-amber-500 text-neutral-950 font-bold'
                            : 'bg-neutral-800 text-neutral-400 cursor-pointer hover:text-white'
                        }`}
                        onClick={() => !isPrimary && handleSetPrimaryBarcode(code)}
                        title={
                          isPrimary
                            ? isAr
                              ? 'الباركود الأساسي'
                              : 'Primary Barcode'
                            : isAr
                            ? 'اضغط لجعله الباركود الأساسي'
                            : 'Click to set as primary'
                        }
                      >
                        {isPrimary ? (isAr ? 'أساسي' : 'Primary') : `#${idx + 1}`}
                      </span>
                      {allModalBarcodes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBarcode(code)}
                          className="text-neutral-400 hover:text-rose-400 p-0.5"
                          aria-label={`Remove barcode ${code}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Purchase (Cost) Price, Selling Price & Dynamic Multi-Currency Linking */}
          <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4" />
                <span>
                  {isAr
                    ? 'تحديد سعر الشراء وسعر البيع وربط العملات حسب سعر الصرف'
                    : 'Purchase & Selling Price (Multi-Currency Exchange Rate Linked)'}
                </span>
              </span>

              {/* Currency selector inside modal - switching converts prices immediately */}
              <div className="flex items-center flex-wrap gap-1">
                <span className="text-[11px] text-neutral-400 mr-1">
                  {isAr ? 'عملة الإدخال:' : 'Currency:'}
                </span>
                {activeCurrencies.map((curr) => (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => handleModalCurrencyChange(curr.code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                      formPriceCurrency === curr.code
                        ? 'bg-emerald-500 text-neutral-950 border-emerald-400 shadow-sm'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {curr.code}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <AppInput
                label={t.category}
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                required
              />

              <AppInput
                label={
                  isAr
                    ? `سعر الشراء / التكلفة (${formPriceCurrency})`
                    : `${t.costPrice} (${formPriceCurrency})`
                }
                type="text"
                inputMode="decimal"
                dir="ltr"
                value={formCostPrice}
                onChange={(e) => setFormCostPrice(normalizeNumberInput(e.target.value))}
                required
              />

              <AppInput
                label={
                  isAr
                    ? `سعر البيع (${formPriceCurrency})`
                    : `${t.sellingPrice} (${formPriceCurrency})`
                }
                type="text"
                inputMode="decimal"
                dir="ltr"
                value={formSellingPrice}
                onChange={(e) => setFormSellingPrice(normalizeNumberInput(e.target.value))}
                required
              />
            </div>

            {/* Profit Margin Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp
                  className={`w-4 h-4 ${unitProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
                />
                <span className="text-neutral-300 font-medium">
                  {isAr ? 'صافي الربح للوحدة:' : 'Unit Profit:'}
                </span>
                <span
                  className={`font-mono font-bold ${
                    unitProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatCurrency(unitProfit, formPriceCurrency, settings.language)}
                </span>
              </div>
              <div className="font-mono text-xs">
                <span className="text-neutral-400">
                  {isAr ? 'نسبة هامش الربح: ' : 'Profit Margin: '}
                </span>
                <span
                  className={`font-bold ${
                    profitMarginPercent >= 0 ? 'text-amber-400' : 'text-rose-400'
                  }`}
                >
                  {profitMarginPercent}%
                </span>
              </div>
            </div>

            {/* Live Multi-Currency Price Equivalents Table */}
            <div>
              <span className="text-[11px] font-semibold text-neutral-400 block mb-1.5">
                {isAr
                  ? 'الأسعار المعادلة تلقائياً بجميع العملات المفعلة (اضغط على أي عملة للتحويل إليها):'
                  : 'Automatic Equivalent Prices Across Active Currencies (Click any currency to switch):'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activeCurrencies.map((curr) => {
                  const eqCost = convertCurrencyAmount(
                    numericCostPrice,
                    formPriceCurrency,
                    curr.code,
                    exchangeRates
                  );
                  const eqSell = convertCurrencyAmount(
                    numericSellingPrice,
                    formPriceCurrency,
                    curr.code,
                    exchangeRates
                  );
                  const isCurrent = curr.code === formPriceCurrency;
                  const rateToSdg = curr.code === 'SDG' ? 1 : exchangeRates[curr.code] || 1;

                  return (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => handleModalCurrencyChange(curr.code)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? 'bg-emerald-950/40 border-emerald-500/60'
                          : 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                        <span className="font-bold text-white flex items-center gap-1">
                          {curr.code}
                          {isCurrent && <Check className="w-3 h-3 text-emerald-400" />}
                        </span>
                        <span className="text-neutral-400 text-[10px]">
                          {curr.code === 'SDG' ? 'Base' : `1=${rateToSdg} SDG`}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400 flex justify-between">
                        <span>{isAr ? 'شراء:' : 'Cost:'}</span>
                        <span className="text-neutral-200 font-semibold">
                          {formatCurrency(eqCost, curr.code, settings.language)}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400 flex justify-between mt-0.5">
                        <span>{isAr ? 'بيع:' : 'Sell:'}</span>
                        <span className="text-emerald-400 font-bold">
                          {formatCurrency(eqSell, curr.code, settings.language)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Product Image Upload / URL & Stock Quantities */}
          <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                <span>{isAr ? 'صورة المنتج والمخزون' : 'Product Image & Inventory Stock'}</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Image Preview Thumbnail */}
              <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center overflow-hidden shrink-0 relative">
                {formImage ? (
                  <>
                    <img
                      src={formImage}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormImage('')}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow"
                      title={isAr ? 'حذف الصورة' : 'Remove image'}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <span className="text-3xl">{formEmoji || '📦'}</span>
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex flex-wrap gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'رفع صورة من الجهاز' : 'Upload Product Image'}</span>
                  </button>
                  {formImage && (
                    <button
                      type="button"
                      onClick={() => setFormImage('')}
                      className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-800/60 text-xs font-semibold text-rose-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إزالة الصورة' : 'Remove Image'}</span>
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  dir="ltr"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder={
                    isAr
                      ? 'أو الصق رابط صورة المنتج مباشر (https://...)'
                      : 'Or paste direct product image URL (https://...)'
                  }
                  className="w-full min-h-[38px] px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-800/80">
              <AppInput
                label={t.stockQty}
                type="text"
                inputMode="numeric"
                dir="ltr"
                value={formStock}
                onChange={(e) => setFormStock(normalizeNumberInput(e.target.value))}
                required
              />

              <AppInput
                label={t.minStockAlert}
                type="text"
                inputMode="numeric"
                dir="ltr"
                value={formMinStockAlert}
                onChange={(e) => setFormMinStockAlert(normalizeNumberInput(e.target.value))}
                required
              />

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  {isAr ? 'أيقونة بديلة (Emoji)' : 'Fallback Icon Emoji'}
                </label>
                <input
                  type="text"
                  value={formEmoji}
                  onChange={(e) => setFormEmoji(e.target.value)}
                  maxLength={4}
                  className="w-full min-h-[46px] px-3 text-center text-xl rounded-xl bg-neutral-900 border border-neutral-800"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-800">
            {editingProduct ? (
              <HoldToConfirm
                onConfirm={() => handleDelete(editingProduct.id)}
                label={t.deleteProduct}
                confirmingLabel="Deleting product..."
                variant="danger"
                className="w-full sm:w-auto"
              />
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <TactileButton variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
                {t.cancel}
              </TactileButton>

              <TactileButton variant="amber" type="submit">
                {t.saveProduct}
              </TactileButton>
            </div>
          </div>
        </form>
      </AppModal>
    </div>
  );
};
