/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { usePOS } from '../../context/POSContext';
import { getTranslation } from '../../lib/translations';
import { formatCurrency, getProductPricesInCurrency } from '../../lib/pos-calculations';
import { matchesProductBarcode } from '../../lib/inventory-rules';
import { Product, Transaction } from '../../lib/types';
import { TactileButton } from '../ui/TactileButton';
import { DynamicButton } from '../ui/DynamicButton';
import { HoldToConfirm } from '../ui/HoldToConfirm';
import { AppInput } from '../ui/AppInput';
import { AppCard } from '../ui/AppCard';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { PaymentModal } from './PaymentModal';
import { ReceiptModal } from './ReceiptModal';
import {
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  X,
  Tag,
} from 'lucide-react';
import { playTactileClick } from '../../lib/sound-fx';

export const CheckoutView: React.FC<{ isCartDrawerOpen?: boolean; onCloseCartDrawer?: () => void }> = ({
  isCartDrawerOpen = false,
  onCloseCartDrawer,
}) => {
  const {
    products,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotals,
    settings,
    exchangeRates,
    globalDiscountPercent,
    setGlobalDiscountPercent,
  } = usePOS();

  const t = getTranslation(settings.language);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Derive unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const cat = settings.language === 'ar' && p.categoryAr ? p.categoryAr : p.category;
      set.add(cat);
    });
    return Array.from(set);
  }, [products, settings.language]);

  // Filter products by category & search query (name, any barcode, SKU)
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const nameMatch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prod.nameAr && prod.nameAr.includes(searchQuery));
      const skuMatch = prod.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const barcodeMatch = matchesProductBarcode(prod, searchQuery, false);

      const matchesSearch = searchQuery === '' || nameMatch || skuMatch || barcodeMatch;

      const prodCat = settings.language === 'ar' && prod.categoryAr ? prod.categoryAr : prod.category;
      const matchesCat = selectedCategory === 'all' || prodCat === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory, settings.language]);

  const handleBarcodeScanned = (code: string) => {
    const item = products.find(
      (p) => matchesProductBarcode(p, code, true) || p.sku.toLowerCase() === code.toLowerCase()
    );
    if (item) {
      addToCart(item, 1);
    }
  };

  const handlePaymentSuccess = (transaction: Transaction) => {
    setIsPaymentOpen(false);
    setCompletedTransaction(transaction);
    setIsReceiptOpen(true);
    onCloseCartDrawer?.();
  };

  const handleNewSale = () => {
    setIsReceiptOpen(false);
    setCompletedTransaction(null);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
      {/* Left Column: Product Workstation */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Search Bar + Barcode Scanner Trigger */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <AppInput
              placeholder={t.searchProducts}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              rightIcon={
                searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 hover:text-white"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : undefined
              }
            />
          </div>

          <TactileButton
            variant="amber"
            size="md"
            onClick={() => setIsScannerOpen(true)}
            leftIcon={<Barcode className="w-5 h-5" />}
            aria-label="Scan barcode"
            className="shrink-0"
          >
            <span className="hidden sm:inline">{t.scanBarcode}</span>
          </TactileButton>
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          <button
            onClick={() => {
              playTactileClick(settings.soundEnabled);
              setSelectedCategory('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === 'all'
                ? 'bg-white text-neutral-950 border-white shadow-sm'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
            }`}
          >
            {t.allCategories}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playTactileClick(settings.soundEnabled);
                setSelectedCategory(cat);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.stock <= 0;
            const isLow = product.stock > 0 && product.stock <= product.minStockAlert;
            const inCartQty = cart.find((i) => i.product.id === product.id)?.quantity || 0;
            const convertedPrice = getProductPricesInCurrency(
              product,
              settings.currency,
              exchangeRates
            ).sellingPrice;
            const productImg = product.image || product.imageUrl || product.customFields?.image;

            return (
              <button
                type="button"
                key={product.id}
                disabled={isOutOfStock}
                onClick={() => !isOutOfStock && addToCart(product, 1)}
                className={`group relative flex flex-col justify-between p-3.5 rounded-2xl border text-left transition-all select-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                  isOutOfStock
                    ? 'opacity-40 cursor-not-allowed bg-neutral-900/50 border-neutral-850'
                    : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-800 hover:border-neutral-700 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98]'
                }`}
                aria-label={`Add ${product.name} to cart`}
              >
                {/* Visual Top Slot with Image / Emoji & Badges */}
                <div className="flex items-start justify-between gap-1 mb-2 w-full">
                  {productImg ? (
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-neutral-800 border border-white/10 shrink-0">
                      <img
                        src={productImg}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-inner border border-white/5"
                      style={{ backgroundColor: `${product.colorHex || '#d97706'}22` }}
                    >
                      <span>{product.emoji || '📦'}</span>
                    </div>
                  )}

                  <div className="flex flex-col items-end gap-1">
                    {inCartQty > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-bold text-[10px] font-mono">
                        {settings.language === 'ar' ? `${inCartQty} بالسلة` : `${inCartQty} in cart`}
                      </span>
                    )}
                    {isLow && (
                      <span className="text-[10px] text-amber-400 font-medium font-mono flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>{settings.language === 'ar' ? `متبقي ${product.stock}` : `${product.stock} left`}</span>
                      </span>
                    )}
                    {isOutOfStock && (
                      <span className="text-[10px] text-rose-400 font-medium">
                        {settings.language === 'ar' ? 'نفد' : 'Out'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Name & SKU */}
                <div className="mb-2 w-full">
                  <h4 className="text-sm font-semibold text-white group-hover:text-amber-200 transition-colors line-clamp-2 leading-snug">
                    {settings.language === 'ar' && product.nameAr ? product.nameAr : product.name}
                  </h4>
                  <span className="text-[11px] font-mono text-neutral-400 block mt-0.5">
                    {product.sku}
                  </span>
                </div>

                {/* Price & Add Trigger */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 w-full">
                  <span className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                    {formatCurrency(convertedPrice, settings.currency, settings.language)}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-neutral-800 group-hover:bg-amber-500 group-hover:text-neutral-950 text-neutral-300 flex items-center justify-center transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-900/40 rounded-2xl border border-neutral-800">
            <ShoppingBag className="w-10 h-10 text-neutral-600 mb-2" />
            <p className="text-sm font-medium text-neutral-400">No products match your search.</p>
          </div>
        )}
      </div>

      {/* Right Column / Mobile Drawer: Live Shopping Cart Panel */}
      <div
        className={`lg:w-96 shrink-0 flex flex-col bg-neutral-900/95 border border-neutral-800 rounded-3xl p-5 shadow-xl ${
          isCartDrawerOpen
            ? 'fixed inset-x-0 bottom-0 top-16 z-50 rounded-t-3xl rounded-b-none p-5 overflow-y-auto max-w-lg mx-auto bg-neutral-900'
            : 'hidden lg:flex'
        }`}
      >
        {/* Cart Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-white">{t.cart}</h3>
            <span className="text-xs font-mono text-neutral-400">
              ({cartTotals.totalItemsCount})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <HoldToConfirm
                onConfirm={clearCart}
                label={t.clearCart}
                confirmingLabel="Clearing..."
                variant="danger"
                className="py-1 px-2.5 text-xs min-h-[34px]"
                allowUndo={false}
              />
            )}
            {isCartDrawerOpen && (
              <button
                onClick={onCloseCartDrawer}
                className="p-1 text-neutral-400 hover:text-white lg:hidden"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 min-h-[160px] max-h-[45vh] lg:max-h-[50vh]">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-44 text-center text-neutral-500 px-4">
              <ShoppingBag className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs">{t.cartEmpty}</p>
            </div>
          ) : (
            cart.map((item) => {
              const unitSellingPrice = getProductPricesInCurrency(
                item.product,
                settings.currency,
                exchangeRates
              ).sellingPrice;

              return (
                <div
                  key={item.product.id}
                  className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-2xl flex items-center justify-between gap-3 group"
                >
                  <div className="flex-1 min-w-0 pr-1">
                    <h5 className="text-xs font-semibold text-white truncate">
                      {settings.language === 'ar' && item.product.nameAr
                        ? item.product.nameAr
                        : item.product.name}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 mt-0.5">
                      <span className="text-emerald-400 font-bold tabular-nums">
                        {formatCurrency(unitSellingPrice, settings.currency, settings.language)}
                      </span>
                      <span>× {item.quantity}</span>
                      <span>=</span>
                      <span className="font-semibold text-white tabular-nums">
                        {formatCurrency(
                          unitSellingPrice * item.quantity,
                          settings.currency,
                          settings.language
                        )}
                      </span>
                    </div>
                  </div>

                {/* Tactile Quantity Stepper */}
                <div className="flex items-center gap-1 shrink-0 bg-neutral-850 p-1 rounded-xl border border-neutral-750">
                  <button
                    onClick={() => updateCartQuantity(item.product.id, -1)}
                    className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 flex items-center justify-center font-bold"
                    aria-label={`Decrease ${item.product.name} quantity`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-7 text-center font-mono font-bold text-xs tabular-nums text-white">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateCartQuantity(item.product.id, 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 flex items-center justify-center font-bold disabled:opacity-30 disabled:pointer-events-none"
                    aria-label={`Increase ${item.product.name} quantity`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="w-7 h-7 ml-1 rounded-lg text-neutral-500 hover:text-rose-400 flex items-center justify-center"
                    aria-label={`Remove ${item.product.name} from cart`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              );
            })
          )}
        </div>

        {/* Global Cart Discount Input */}
        {cart.length > 0 && (
          <div className="pt-2 pb-1 border-t border-neutral-800/80 flex items-center justify-between gap-2">
            <span className="text-xs text-neutral-400 flex items-center gap-1 font-medium">
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              <span>Discount %:</span>
            </span>
            <div className="flex gap-1">
              {[0, 5, 10, 15].map((d) => (
                <button
                  key={d}
                  onClick={() => setGlobalDiscountPercent(d)}
                  className={`px-2 py-0.5 text-[11px] font-mono rounded-lg border ${
                    globalDiscountPercent === d
                      ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400'
                      : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                  }`}
                >
                  {d}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Summary Breakdown */}
        <div className="pt-3 border-t border-neutral-800 space-y-1.5 text-xs text-neutral-400">
          <div className="flex justify-between">
            <span>{t.subtotal}</span>
            <span className="font-mono tabular-nums text-white">
              {formatCurrency(cartTotals.subtotal, settings.currency, settings.language)}
            </span>
          </div>

          {cartTotals.discountAmount > 0 && (
            <div className="flex justify-between text-rose-400">
              <span>{t.discount}</span>
              <span className="font-mono tabular-nums">
                -{formatCurrency(cartTotals.discountAmount, settings.currency, settings.language)}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span>
              {t.tax} ({settings.taxRatePercent}%)
              {settings.isTaxInclusive && ' (incl.)'}
            </span>
            <span className="font-mono tabular-nums text-white">
              {formatCurrency(cartTotals.taxAmount, settings.currency, settings.language)}
            </span>
          </div>

          <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-neutral-800">
            <span>{t.total}</span>
            <span className="font-mono tabular-nums text-amber-400 text-xl">
              {formatCurrency(cartTotals.grandTotal, settings.currency, settings.language)}
            </span>
          </div>
        </div>

        {/* DynamicButton Pay Trigger */}
        <div className="pt-4">
          <DynamicButton
            status="ready"
            onClick={() => setIsPaymentOpen(true)}
            readyLabel={`${t.payNow} • ${formatCurrency(
              cartTotals.grandTotal,
              settings.currency,
              settings.language
            )}`}
            readyIcon={<CreditCard className="w-5 h-5 text-current" />}
            variant="emerald"
            disabled={cart.length === 0}
            className="w-full text-base py-3.5 shadow-lg"
          />
        </div>
      </div>

      {/* Modals */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleBarcodeScanned}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        transaction={completedTransaction}
        onNewSale={handleNewSale}
      />
    </div>
  );
};
