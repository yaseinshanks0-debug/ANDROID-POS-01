/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useCallback, useRef } from 'react';
import {
  AppSettings,
  CartItem,
  CheckoutPaymentDetails,
  CompanyProfile,
  Customer,
  DebtSettlementInput,
  ExpenseInput,
  ExpenseRecord,
  GoodsReceiptInput,
  InvoiceFulfillmentStatus,
  InvoiceFulfillmentType,
  POSUser,
  PaymentMethod,
  Product,
  ProductSaleUnitMode,
  StockMovement,
  StockMovementType,
  Transaction,
} from '../../lib/types';
import {
  AtomicCheckoutCommitPayload,
  applyDebtSettlementPayment,
  calculateCartTotals,
  calculateDebtBreakdown,
  convertCurrencyAmount,
  getCartItemUnitPricing,
  getProductPackaging,
  lockTransactionSaleExchangeRate,
  repriceTransactionToNewRate,
  validateCheckout,
} from '../../lib/pos-calculations';
import {
  buildProductAuditTrail,
  calculateStockAdjustment,
  generateIdempotencyKey,
  generateTransactionId,
  getNextProductSerialNumber,
  getProductSerialNumber,
} from '../../lib/inventory-rules';
import {
  generateExpenseId,
  validateExpenseInput,
} from '../../lib/expense-calculations';
import { DEFAULT_EXCHANGE_RATES_MAP } from '../../lib/exchange-rate-storage';
import { offlineSqliteStorage } from '../../lib/offline-sqlite-storage';
import { playSuccessChime, triggerHaptic } from '../../lib/sound-fx';
import { api } from '../../services/api';

interface UseCatalogAndCartDomainParams {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseRecord[]>>;
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  setStockMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>;
  selectedCustomer: Customer | null;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
  globalDiscountPercent: number;
  setGlobalDiscountPercentState: React.Dispatch<React.SetStateAction<number>>;
  globalDiscountAmount: number;
  setGlobalDiscountAmountState: React.Dispatch<React.SetStateAction<number>>;
  settings: AppSettings;
  exchangeRates: Record<string, number>;
  currentUser: POSUser;
  currentCompany: CompanyProfile;
  activeBranchId: string;
  commitCheckoutAtomic: (payload: AtomicCheckoutCommitPayload) => void;
  voidTransactionAtomic: (transactionId: string, nowIso?: string) => void;
}

export function useCatalogAndCartDomain({
  products,
  setProducts,
  cart,
  setCart,
  transactions,
  setTransactions,
  setExpenses,
  setCustomers,
  setStockMovements,
  selectedCustomer,
  setSelectedCustomer,
  globalDiscountPercent,
  setGlobalDiscountPercentState,
  globalDiscountAmount,
  setGlobalDiscountAmountState,
  settings,
  exchangeRates,
  currentUser,
  currentCompany,
  activeBranchId,
  commitCheckoutAtomic,
  voidTransactionAtomic,
}: UseCatalogAndCartDomainParams) {
  const deletedProductIdsRef = useRef<Set<string>>(new Set());
  const deletedCustomerIdsRef = useRef<Set<string>>(new Set());

  const cartTotals = useMemo(() => {
    return calculateCartTotals(
      cart,
      settings.taxRatePercent,
      globalDiscountPercent,
      settings.isTaxInclusive,
      settings.currency,
      exchangeRates,
      globalDiscountAmount
    );
  }, [
    cart,
    settings.taxRatePercent,
    globalDiscountPercent,
    globalDiscountAmount,
    settings.isTaxInclusive,
    settings.currency,
    exchangeRates,
  ]);

  const addToCart = useCallback(
    (product: Product, quantity = 1, saleUnit?: ProductSaleUnitMode) => {
      const currentProduct = products.find((p) => p.id === product.id) || product;
      const pkg = getProductPackaging(currentProduct);
      const existingItem = cart.find((item) => item.product.id === currentProduct.id);

      const resolvedUnit: ProductSaleUnitMode =
        pkg.enablePackaging && pkg.unitsPerPack > 1
          ? saleUnit || existingItem?.selectedSaleUnit || pkg.defaultSaleUnit
          : 'unit';

      const stockPerItem = resolvedUnit === 'pack' ? pkg.unitsPerPack : 1;

      const currentQtyInResolvedUnit =
        existingItem && (existingItem.selectedSaleUnit || 'unit') === resolvedUnit
          ? existingItem.quantity
          : 0;
      const newQty = currentQtyInResolvedUnit + quantity;
      const requiredStock = newQty * stockPerItem;

      if (requiredStock > currentProduct.stock) {
        triggerHaptic('warning', settings.hapticsEnabled);
        return false;
      }

      setCart((prev) => {
        if (existingItem) {
          return prev.map((item) =>
            item.product.id === currentProduct.id
              ? {
                  ...item,
                  product: currentProduct,
                  quantity: newQty,
                  selectedSaleUnit: resolvedUnit,
                }
              : item
          );
        }
        return [
          ...prev,
          {
            product: currentProduct,
            quantity,
            itemDiscountPercent: 0,
            selectedSaleUnit: resolvedUnit,
          },
        ];
      });

      triggerHaptic('light', settings.hapticsEnabled);
      return true;
    },
    [cart, products, settings.hapticsEnabled, setCart]
  );

  const updateCartQuantity = useCallback(
    (productId: string, delta: number) => {
      setCart((prev) => {
        return prev
          .map((item) => {
            if (item.product.id === productId) {
              const freshProduct = products.find((p) => p.id === productId) || item.product;
              const pkg = getProductPackaging(freshProduct);
              const isPack =
                pkg.enablePackaging &&
                pkg.unitsPerPack > 1 &&
                (item.selectedSaleUnit || pkg.defaultSaleUnit) === 'pack';
              const stockPerItem = isPack ? pkg.unitsPerPack : 1;
              const newQty = item.quantity + delta;
              if (newQty <= 0) return null;
              if (newQty * stockPerItem > freshProduct.stock) {
                triggerHaptic('warning', settings.hapticsEnabled);
                return item;
              }
              return { ...item, product: freshProduct, quantity: newQty };
            }
            return item;
          })
          .filter((item): item is CartItem => item !== null);
      });
      triggerHaptic('light', settings.hapticsEnabled);
    },
    [products, settings.hapticsEnabled, setCart]
  );

  const setCartItemSaleUnit = useCallback(
    (productId: string, saleUnit: ProductSaleUnitMode) => {
      setCart((prev) =>
        prev.map((item) => {
          if (item.product.id !== productId) return item;
          const freshProduct = products.find((p) => p.id === productId) || item.product;
          const pkg = getProductPackaging(freshProduct);
          if (!pkg.enablePackaging || pkg.unitsPerPack <= 1) {
            return { ...item, product: freshProduct, selectedSaleUnit: 'unit' };
          }
          const stockPerItem = saleUnit === 'pack' ? pkg.unitsPerPack : 1;
          const maxAffordableQty = Math.max(1, Math.floor(freshProduct.stock / stockPerItem));
          const clampedQty = Math.min(item.quantity, maxAffordableQty);
          return {
            ...item,
            product: freshProduct,
            selectedSaleUnit: saleUnit,
            quantity: clampedQty,
          };
        })
      );
      triggerHaptic('light', settings.hapticsEnabled);
    },
    [products, settings.hapticsEnabled, setCart]
  );

  const setCartItemDiscount = useCallback(
    (productId: string, discountPercent: number) => {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? { ...item, itemDiscountPercent: Math.max(0, Math.min(100, discountPercent)) }
            : item
        )
      );
    },
    [setCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      triggerHaptic('medium', settings.hapticsEnabled);
    },
    [settings.hapticsEnabled, setCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCustomer(null);
    setGlobalDiscountPercentState(0);
    setGlobalDiscountAmountState(0);
    triggerHaptic('medium', settings.hapticsEnabled);
  }, [
    settings.hapticsEnabled,
    setCart,
    setSelectedCustomer,
    setGlobalDiscountPercentState,
    setGlobalDiscountAmountState,
  ]);

  const processCheckout = useCallback(
    async (
      paymentMethod: PaymentMethod,
      amountTendered: number,
      details?: CheckoutPaymentDetails
    ): Promise<{ success: boolean; transaction?: Transaction; error?: string }> => {
      // Refresh cart items against the latest authoritative products slice before validating stock
      const liveSyncedCart: CartItem[] = cart.map((item) => {
        const latestProd = products.find((p) => p.id === item.product.id);
        return latestProd ? { ...item, product: latestProd } : item;
      });

      const validation = validateCheckout(
        liveSyncedCart,
        paymentMethod,
        amountTendered,
        cartTotals.grandTotal,
        details,
        {
          currency: settings.currency,
          language: settings.language,
        }
      );
      if (!validation.valid) {
        triggerHaptic('warning', settings.hapticsEnabled);
        return { success: false, error: validation.error };
      }

      const idempotencyKey = generateIdempotencyKey();
      const transactionId = generateTransactionId();
      const nowIso = new Date().toISOString();

      const requestedStatus = details?.paymentStatus || 'paid';
      const breakdown = calculateDebtBreakdown(
        cartTotals.grandTotal,
        requestedStatus,
        details?.amountPaid !== undefined ? details.amountPaid : amountTendered
      );

      const changeDue =
        paymentMethod === 'cash' && breakdown.paymentStatus === 'paid'
          ? Math.max(0, amountTendered - cartTotals.grandTotal)
          : 0;

      const activeCurrency = (settings.currency || 'SDG').toUpperCase().trim();
      const baseSnapshot: Record<string, number> = {
        ...DEFAULT_EXCHANGE_RATES_MAP,
        ...exchangeRates,
        ...(details?.exchangeRatesSnapshot || {}),
        SDG: 1,
      };
      const rateUsedAtSale =
        details?.exchangeRateUsed && details.exchangeRateUsed > 0
          ? Number(details.exchangeRateUsed)
          : activeCurrency === 'SDG'
          ? Number(baseSnapshot['USD'] || 2700)
          : Number(baseSnapshot[activeCurrency] || 1);

      const activeRateSnapshot: Record<string, number> = {
        ...baseSnapshot,
        [activeCurrency === 'SDG' ? 'USD' : activeCurrency]: rateUsedAtSale,
        SDG: 1,
      };

      const newTransaction: Transaction = {
        id: transactionId,
        idempotencyKey,
        timestamp: nowIso,
        currency: activeCurrency,
        exchangeRateUsed: rateUsedAtSale,
        exchangeRatesSnapshot: activeRateSnapshot,
        items: liveSyncedCart.map((item) => {
          const unitPricing = getCartItemUnitPricing(
            item,
            settings.currency,
            exchangeRates,
            settings.language
          );
          return {
            productId: item.product.id,
            productName: item.product.name,
            sku: item.product.sku,
            quantity: item.quantity,
            unitPrice: unitPricing.unitPrice,
            discountPercent: item.itemDiscountPercent,
            total:
              unitPricing.unitPrice *
              item.quantity *
              (1 - item.itemDiscountPercent / 100),
            saleUnit: unitPricing.saleUnit,
            saleUnitLabel: unitPricing.unitLabel,
            unitsPerPack: unitPricing.packaging.unitsPerPack,
            stockDeducted: unitPricing.totalStockUnitsRequired,
          };
        }),
        subtotal: cartTotals.subtotal,
        taxRatePercent: settings.taxRatePercent,
        taxAmount: cartTotals.taxAmount,
        discountAmount: cartTotals.discountAmount,
        grandTotal: cartTotals.grandTotal,
        paymentMethod,
        amountTendered:
          breakdown.paymentStatus === 'paid' && paymentMethod === 'cash'
            ? amountTendered
            : breakdown.amountPaid,
        changeDue: Math.round(changeDue * 100) / 100,
        paymentStatus: breakdown.paymentStatus,
        amountPaid: breakdown.amountPaid,
        debtAmount: breakdown.debtAmount,
        transferReference: details?.transferReference?.trim() || undefined,
        transferReceiptImage:
          details?.transferReceiptImage ||
          (details?.transferReceiptImages && details.transferReceiptImages[0]) ||
          undefined,
        transferReceiptImages:
          details?.transferReceiptImages && details.transferReceiptImages.length > 0
            ? details.transferReceiptImages
            : details?.transferReceiptImage
            ? [details.transferReceiptImage]
            : undefined,
        fulfillmentType: details?.fulfillmentType || 'goods_and_invoice',
        fulfillmentStatus:
          details?.fulfillmentStatus ||
          (details?.fulfillmentType === 'invoice_only'
            ? 'pending_goods'
            : details?.fulfillmentType === 'goods_only'
            ? 'pending_invoice'
            : 'received'),
        fulfilledAt:
          !details?.fulfillmentType || details?.fulfillmentType === 'goods_and_invoice'
            ? nowIso
            : undefined,
        customerId: selectedCustomer?.id,
        customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
        cashierName: `${
          settings.language === 'ar'
            ? currentUser.nameAr || currentUser.name
            : currentUser.name
        } (${
          settings.language === 'ar'
            ? currentUser.terminalNameAr || currentUser.terminalName
            : currentUser.terminalName
        })`,
        status: 'completed',
        syncStatus: 'synced',
      };

      // Atomically commit product stock deduction, stock movements, customer balance, and transaction record in a single reducer action
      commitCheckoutAtomic({
        cart: liveSyncedCart,
        newTransaction,
        selectedCustomerId: selectedCustomer?.id || null,
        grandTotal: cartTotals.grandTotal,
        debtAmount: breakdown.debtAmount,
        currency: settings.currency,
        exchangeRates,
        language: settings.language,
        nowIso,
      });

      setCart([]);
      setSelectedCustomer(null);
      setGlobalDiscountPercentState(0);
      setGlobalDiscountAmountState(0);

      playSuccessChime(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);

      return { success: true, transaction: newTransaction };
    },
    [
      cart,
      products,
      cartTotals,
      selectedCustomer,
      settings,
      exchangeRates,
      currentUser,
      commitCheckoutAtomic,
      setCart,
      setSelectedCustomer,
      setGlobalDiscountPercentState,
      setGlobalDiscountAmountState,
    ]
  );

  const settleTransactionDebt = useCallback(
    (
      transactionId: string,
      useIndexedNewRate: boolean = false,
      anchorCurrency: string = 'USD',
      settlementDetails?: DebtSettlementInput
    ): boolean => {
      const txn = transactions.find((t) => t.id === transactionId);
      if (!txn || txn.status === 'voided') {
        return false;
      }
      if (!settlementDetails && (!txn.debtAmount || txn.debtAmount <= 0)) {
        return false;
      }

      const { updatedTransaction, settledDeltaInTxCurrency } = applyDebtSettlementPayment(
        txn,
        {
          ...settlementDetails,
          useIndexedNewRate:
            settlementDetails?.useIndexedNewRate !== undefined
              ? settlementDetails.useIndexedNewRate
              : useIndexedNewRate,
          anchorCurrency: settlementDetails?.anchorCurrency || anchorCurrency,
        },
        exchangeRates
      );

      setTransactions((prev) =>
        prev.map((t) => (t.id === transactionId ? updatedTransaction : t))
      );

      if (txn.customerId && Math.abs(settledDeltaInTxCurrency) > 0.0001) {
        setCustomers((prev) =>
          prev.map((cust) => {
            if (cust.id === txn.customerId) {
              const prevDebt = cust.totalDebt || 0;
              return {
                ...cust,
                totalDebt: Math.max(
                  0,
                  Math.round((prevDebt - settledDeltaInTxCurrency) * 100) / 100
                ),
              };
            }
            return cust;
          })
        );
      }

      playSuccessChime(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);
      return true;
    },
    [
      transactions,
      exchangeRates,
      settings.soundEnabled,
      settings.hapticsEnabled,
      setTransactions,
      setCustomers,
    ]
  );

  const updateTransactionFulfillment = useCallback(
    (
      transactionId: string,
      fulfillmentStatus: InvoiceFulfillmentStatus,
      fulfillmentType?: InvoiceFulfillmentType
    ): boolean => {
      const txn = transactions.find((t) => t.id === transactionId);
      if (!txn || txn.status === 'voided') return false;

      setTransactions((prev) =>
        prev.map((t) => {
          if (t.id !== transactionId) return t;
          return {
            ...t,
            fulfillmentStatus,
            fulfillmentType:
              fulfillmentType ||
              (fulfillmentStatus === 'received'
                ? 'goods_and_invoice'
                : fulfillmentStatus === 'pending_goods'
                ? 'invoice_only'
                : 'goods_only'),
            fulfilledAt:
              fulfillmentStatus === 'received' ? new Date().toISOString() : t.fulfilledAt,
          };
        })
      );

      playSuccessChime(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);
      return true;
    },
    [transactions, settings.soundEnabled, settings.hapticsEnabled, setTransactions]
  );

  const applyNewRateToTransaction = useCallback(
    (transactionId: string, anchorCurrency: string = 'USD'): boolean => {
      const txn = transactions.find((t) => t.id === transactionId);
      if (!txn || txn.status === 'voided') return false;

      const repriced = repriceTransactionToNewRate(txn, exchangeRates, anchorCurrency);
      const oldDebt = txn.debtAmount || 0;
      const newDebt = repriced.debtAmount || 0;
      const debtDelta = Math.round((newDebt - oldDebt) * 100) / 100;

      setTransactions((prev) => prev.map((t) => (t.id === transactionId ? repriced : t)));

      if (txn.customerId && Math.abs(debtDelta) > 0.0001) {
        setCustomers((prev) =>
          prev.map((cust) => {
            if (cust.id === txn.customerId) {
              const prevDebt = cust.totalDebt || 0;
              return {
                ...cust,
                totalDebt: Math.max(0, Math.round((prevDebt + debtDelta) * 100) / 100),
              };
            }
            return cust;
          })
        );
      }

      playSuccessChime(settings.soundEnabled);
      triggerHaptic('light', settings.hapticsEnabled);
      return true;
    },
    [
      transactions,
      exchangeRates,
      settings.soundEnabled,
      settings.hapticsEnabled,
      setTransactions,
      setCustomers,
    ]
  );

  const lockTransactionSaleRate = useCallback(
    (transactionId: string, saleRateToSdg: number, referenceCurrency: string = 'USD'): boolean => {
      const txn = transactions.find((t) => t.id === transactionId);
      if (!txn || txn.status === 'voided' || !Number.isFinite(saleRateToSdg) || saleRateToSdg <= 0) {
        return false;
      }

      const updated = lockTransactionSaleExchangeRate(txn, saleRateToSdg, referenceCurrency);
      setTransactions((prev) => prev.map((t) => (t.id === transactionId ? updated : t)));

      playSuccessChime(settings.soundEnabled);
      triggerHaptic('light', settings.hapticsEnabled);
      return true;
    },
    [transactions, settings.soundEnabled, settings.hapticsEnabled, setTransactions]
  );

  const applyNewRateToAllTransactions = useCallback(
    (onlyDebt: boolean = false, anchorCurrency: string = 'USD'): number => {
      let updatedCount = 0;
      const customerDebtDeltas: Record<string, number> = {};

      setTransactions((prev) =>
        prev.map((t) => {
          if (t.status === 'voided') return t;
          if (onlyDebt && (!t.debtAmount || t.debtAmount <= 0)) return t;

          const repriced = repriceTransactionToNewRate(t, exchangeRates, anchorCurrency);
          const changed =
            Math.abs(repriced.grandTotal - t.grandTotal) > 0.0001 ||
            Math.abs((repriced.debtAmount || 0) - (t.debtAmount || 0)) > 0.0001 ||
            repriced.exchangeRateUsed !== t.exchangeRateUsed;

          if (changed) {
            updatedCount += 1;
            if (t.customerId) {
              const delta = (repriced.debtAmount || 0) - (t.debtAmount || 0);
              customerDebtDeltas[t.customerId] = (customerDebtDeltas[t.customerId] || 0) + delta;
            }
          }
          return repriced;
        })
      );

      if (Object.keys(customerDebtDeltas).length > 0) {
        setCustomers((prev) =>
          prev.map((cust) => {
            const delta = customerDebtDeltas[cust.id];
            if (!delta) return cust;
            const prevDebt = cust.totalDebt || 0;
            return {
              ...cust,
              totalDebt: Math.max(0, Math.round((prevDebt + delta) * 100) / 100),
            };
          })
        );
      }

      if (updatedCount > 0) {
        playSuccessChime(settings.soundEnabled);
        triggerHaptic('success', settings.hapticsEnabled);
      }
      return updatedCount;
    },
    [exchangeRates, settings.soundEnabled, settings.hapticsEnabled, setTransactions, setCustomers]
  );

  const voidTransaction = useCallback(
    (transactionId: string): boolean => {
      const txn = transactions.find((t) => t.id === transactionId);
      if (!txn || txn.status === 'voided') return false;

      voidTransactionAtomic(transactionId, new Date().toISOString());

      triggerHaptic('medium', settings.hapticsEnabled);
      return true;
    },
    [transactions, settings.hapticsEnabled, voidTransactionAtomic]
  );

  const addProduct = useCallback(
    async (productData: Omit<Product, 'id' | 'updatedAt'>): Promise<Product> => {
      const nowIso = new Date().toISOString();
      const actorName =
        settings.language === 'ar'
          ? currentUser.nameAr || currentUser.name
          : currentUser.name;
      const nextSerial =
        productData.serialNumber && Number(productData.serialNumber) > 0
          ? Math.floor(Number(productData.serialNumber))
          : getNextProductSerialNumber(products);
      const audit = buildProductAuditTrail({
        existingProduct: null,
        nextProduct: productData,
        changedBy: actorName,
        nowIso,
      });

      const enrichedPayload: Omit<Product, 'id' | 'updatedAt'> = {
        ...productData,
        serialNumber: nextSerial,
        createdAt: productData.createdAt || audit.createdAt,
        priceUpdatedAt: audit.priceUpdatedAt,
        priceHistory:
          productData.priceHistory && productData.priceHistory.length > 0
            ? productData.priceHistory
            : audit.priceHistory,
        modificationHistory:
          productData.modificationHistory && productData.modificationHistory.length > 0
            ? productData.modificationHistory
            : audit.modificationHistory,
        customFields: {
          ...(productData.customFields || {}),
          serialNumber: nextSerial,
          description: productData.description || productData.customFields?.description,
          descriptionAr: productData.descriptionAr || productData.customFields?.descriptionAr,
          createdAt: productData.createdAt || audit.createdAt,
          priceUpdatedAt: audit.priceUpdatedAt,
          priceHistory:
            productData.priceHistory && productData.priceHistory.length > 0
              ? productData.priceHistory
              : audit.priceHistory,
          modificationHistory:
            productData.modificationHistory && productData.modificationHistory.length > 0
              ? productData.modificationHistory
              : audit.modificationHistory,
          changedBy: actorName,
        },
      };

      let created: Product;
      try {
        const apiRes = await api.createProduct(enrichedPayload);
        created = {
          ...apiRes,
          ...enrichedPayload,
          id: apiRes.id,
          updatedAt: apiRes.updatedAt || nowIso,
        };
      } catch (err: any) {
        if (err?.message?.includes('Duplicate')) {
          throw err;
        }
        console.warn('Backend API createProduct failed, saving locally:', err);
        created = {
          ...enrichedPayload,
          id: `prod-${Date.now()}`,
          updatedAt: nowIso,
        };
      }

      setProducts((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);

      if (created.stock > 0) {
        setStockMovements((prev) => [
          {
            id: `mov_init_${created.id}`,
            timestamp: nowIso,
            productId: created.id,
            productName: created.name,
            type: 'restock',
            quantityChange: created.stock,
            previousStock: 0,
            newStock: created.stock,
            reason: `Initial Product Stock In (${actorName})`,
          },
          ...prev,
        ]);
      }

      triggerHaptic('success', settings.hapticsEnabled);
      return created;
    },
    [products, currentUser, settings.language, settings.hapticsEnabled, setProducts, setStockMovements]
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      const existing = products.find((p) => p.id === id) || null;
      const nowIso = new Date().toISOString();
      const actorName =
        settings.language === 'ar'
          ? currentUser.nameAr || currentUser.name
          : currentUser.name;

      const audit = buildProductAuditTrail({
        existingProduct: existing,
        nextProduct: updates,
        changedBy: actorName,
        nowIso,
      });

      const nextSerial =
        updates.serialNumber !== undefined
          ? Number(updates.serialNumber)
          : existing
          ? getProductSerialNumber(existing)
          : undefined;

      const enrichedUpdates: Partial<Product> = {
        ...updates,
        serialNumber: nextSerial,
        createdAt: existing?.createdAt || audit.createdAt,
        previousCostPrice: audit.previousCostPrice,
        previousSellingPrice: audit.previousSellingPrice,
        priceUpdatedAt: audit.priceUpdatedAt,
        priceHistory: audit.priceHistory,
        modificationHistory: audit.modificationHistory,
        customFields: {
          ...(existing?.customFields || {}),
          ...(updates.customFields || {}),
          serialNumber: nextSerial,
          description:
            updates.description !== undefined
              ? updates.description
              : existing?.description || existing?.customFields?.description,
          descriptionAr:
            updates.descriptionAr !== undefined
              ? updates.descriptionAr
              : existing?.descriptionAr || existing?.customFields?.descriptionAr,
          createdAt: existing?.createdAt || audit.createdAt,
          previousCostPrice: audit.previousCostPrice,
          previousSellingPrice: audit.previousSellingPrice,
          priceUpdatedAt: audit.priceUpdatedAt,
          priceHistory: audit.priceHistory,
          modificationHistory: audit.modificationHistory,
          changedBy: actorName,
        },
      };

      try {
        const apiUpdated = await api.updateProduct(id, enrichedUpdates);
        const mergedUpdated: Product = {
          ...(existing || ({} as Product)),
          ...apiUpdated,
          ...enrichedUpdates,
          updatedAt: nowIso,
        };
        setProducts((prev) => prev.map((p) => (p.id === id ? mergedUpdated : p)));
        setCart((prev) =>
          prev.map((item) => (item.product.id === id ? { ...item, product: mergedUpdated } : item))
        );
        triggerHaptic('light', settings.hapticsEnabled);
        return mergedUpdated;
      } catch (err: any) {
        if (err?.message?.includes('Duplicate')) {
          throw err;
        }
        console.warn('Backend API updateProduct failed, applying local update:', err);
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, ...enrichedUpdates, updatedAt: nowIso } : p
          )
        );
        setCart((prev) =>
          prev.map((item) =>
            item.product.id === id
              ? { ...item, product: { ...item.product, ...enrichedUpdates, updatedAt: nowIso } }
              : item
          )
        );
        triggerHaptic('light', settings.hapticsEnabled);
      }
    },
    [products, currentUser, settings.language, settings.hapticsEnabled, setProducts, setCart]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      deletedProductIdsRef.current.add(id);
      try {
        await api.deleteProduct(id);
      } catch (err) {
        console.warn('Backend API deleteProduct failed, removing locally:', err);
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setCart((prev) => prev.filter((item) => item.product.id !== id));
      triggerHaptic('medium', settings.hapticsEnabled);
    },
    [settings.hapticsEnabled, setProducts, setCart]
  );

  const recordStockAdjustment = useCallback(
    (productId: string, type: StockMovementType, amount: number, reason: string) => {
      const prod = products.find((p) => p.id === productId);
      if (!prod) return;

      const newStock = calculateStockAdjustment(prod.stock, type, amount);
      const delta = type === 'audit' ? newStock - prod.stock : newStock - prod.stock;

      const movement: StockMovement = {
        id: `mov_${Date.now()}`,
        timestamp: new Date().toISOString(),
        productId: prod.id,
        productName: prod.name,
        type,
        quantityChange: delta,
        previousStock: prod.stock,
        newStock,
        reason: reason || 'Manual Stock Adjustment',
      };

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, stock: newStock, updatedAt: new Date().toISOString() } : p
        )
      );
      setStockMovements((prev) => [movement, ...prev]);
      triggerHaptic('medium', settings.hapticsEnabled);
    },
    [products, settings.hapticsEnabled, setProducts, setStockMovements]
  );

  const recordGoodsReceipt = useCallback(
    (input: GoodsReceiptInput): boolean => {
      const prod = products.find((p) => p.id === input.productId);
      if (!prod || input.quantity <= 0) return false;

      const qty = Math.round(input.quantity);
      const newStock =
        input.receiptMode === 'invoice_only' ? prod.stock : prod.stock + qty;

      const receiptCurrency = (input.currency || settings.currency || 'SDG')
        .toString()
        .toUpperCase()
        .trim();
      const prodCurrency = (
        prod.priceCurrency ||
        prod.customFields?.priceCurrency ||
        'SDG'
      )
        .toString()
        .toUpperCase()
        .trim();

      let nextCostPrice = prod.costPrice;
      if (input.updateProductCost && input.unitCost && input.unitCost > 0) {
        nextCostPrice = convertCurrencyAmount(
          input.unitCost,
          receiptCurrency,
          prodCurrency,
          exchangeRates
        );
      }

      const modeLabel =
        input.receiptMode === 'goods_and_invoice'
          ? 'Goods & Invoice Receipt'
          : input.receiptMode === 'goods_only'
          ? 'Goods Receipt Only'
          : 'Purchase Invoice Recorded (Goods Pending)';

      const reasonParts = [modeLabel];
      if (input.invoiceNumber?.trim()) reasonParts.push(`#${input.invoiceNumber.trim()}`);
      if (input.supplierName?.trim()) reasonParts.push(`Supplier: ${input.supplierName.trim()}`);
      if (input.notes?.trim()) reasonParts.push(input.notes.trim());

      const movement: StockMovement = {
        id: `mov_rcpt_${Date.now()}`,
        timestamp: new Date().toISOString(),
        productId: prod.id,
        productName: prod.name,
        type: 'restock',
        quantityChange: input.receiptMode === 'invoice_only' ? 0 : qty,
        previousStock: prod.stock,
        newStock,
        reason: reasonParts.join(' • '),
        referenceId: input.invoiceNumber?.trim() || undefined,
        receiptMode: input.receiptMode,
        supplierName: input.supplierName?.trim() || undefined,
        invoiceNumber: input.invoiceNumber?.trim() || undefined,
        unitCost: input.unitCost,
        currency: receiptCurrency,
      };

      setProducts((prev) =>
        prev.map((p) =>
          p.id === prod.id
            ? {
                ...p,
                stock: newStock,
                costPrice: nextCostPrice,
                updatedAt: new Date().toISOString(),
              }
            : p
        )
      );
      setStockMovements((prev) => [movement, ...prev]);
      playSuccessChime(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);
      return true;
    },
    [
      products,
      settings.currency,
      settings.soundEnabled,
      settings.hapticsEnabled,
      exchangeRates,
      setProducts,
      setStockMovements,
    ]
  );

  const addCustomer = useCallback(
    (
      customerData: Omit<
        Customer,
        'id' | 'createdAt' | 'totalSpent' | 'transactionCount' | 'loyaltyPoints'
      >
    ): Customer => {
      const newCust: Customer = {
        ...customerData,
        id: `cust-${Date.now()}`,
        totalSpent: 0,
        transactionCount: 0,
        loyaltyPoints: 0,
        createdAt: new Date().toISOString(),
      };
      setCustomers((prev) => [newCust, ...prev]);
      triggerHaptic('success', settings.hapticsEnabled);
      return newCust;
    },
    [settings.hapticsEnabled, setCustomers]
  );

  const updateCustomer = useCallback(
    (id: string, updates: Partial<Customer>) => {
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      );
      triggerHaptic('light', settings.hapticsEnabled);
    },
    [settings.hapticsEnabled, setCustomers]
  );

  const deleteCustomer = useCallback(
    (id: string) => {
      deletedCustomerIdsRef.current.add(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setSelectedCustomer((prev) => (prev?.id === id ? null : prev));
      triggerHaptic('medium', settings.hapticsEnabled);
    },
    [settings.hapticsEnabled, setCustomers, setSelectedCustomer]
  );

  const addExpense = useCallback(
    (input: ExpenseInput): { ok: boolean; expense?: ExpenseRecord; error?: string } => {
      const validation = validateExpenseInput(input, settings.language);
      if (!validation.valid) {
        return { ok: false, error: validation.error };
      }

      const expCurrency = (input.currency || settings.currency || 'SDG')
        .toString()
        .toUpperCase()
        .trim();
      const liveRates: Record<string, number> = {
        SDG: 1,
        ...(exchangeRates || {}),
      };
      const rateUsed =
        input.exchangeRateUsed && input.exchangeRateUsed > 0
          ? Number(input.exchangeRateUsed)
          : expCurrency !== 'SDG'
          ? Number(liveRates[expCurrency] || 1)
          : Number(liveRates['USD'] || 2700);

      const newExpense: ExpenseRecord = {
        id: generateExpenseId(),
        companyId: currentCompany.id,
        branchId: activeBranchId,
        timestamp: input.timestamp || new Date().toISOString(),
        title: input.title.trim(),
        category: input.category || 'other',
        amount: Math.round(Number(input.amount) * 100) / 100,
        currency: expCurrency,
        exchangeRateUsed: rateUsed,
        exchangeRatesSnapshot: liveRates,
        paymentMethod: input.paymentMethod || 'cash',
        transferReference: input.transferReference?.trim() || undefined,
        receiptImage: input.receiptImage?.trim() || undefined,
        beneficiary: input.beneficiary?.trim() || undefined,
        notes: input.notes?.trim() || undefined,
        recordedBy: currentUser?.name || 'POS Operator',
        status: 'recorded',
        syncStatus: offlineSqliteStorage.isOnline() ? 'synced' : 'pending_sync',
      };

      setExpenses((prev) => [newExpense, ...prev]);
      playSuccessChime(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);
      return { ok: true, expense: newExpense };
    },
    [
      settings.language,
      settings.currency,
      settings.soundEnabled,
      settings.hapticsEnabled,
      exchangeRates,
      currentCompany.id,
      activeBranchId,
      currentUser?.name,
      setExpenses,
    ]
  );

  const updateExpense = useCallback(
    (id: string, updates: Partial<ExpenseRecord>): boolean => {
      let updated = false;
      setExpenses((prev) =>
        prev.map((exp) => {
          if (exp.id !== id) return exp;
          updated = true;
          return {
            ...exp,
            ...updates,
            title: updates.title !== undefined ? updates.title.trim() : exp.title,
            amount:
              updates.amount !== undefined && Number(updates.amount) > 0
                ? Math.round(Number(updates.amount) * 100) / 100
                : exp.amount,
          };
        })
      );
      if (updated) {
        triggerHaptic('light', settings.hapticsEnabled);
      }
      return updated;
    },
    [settings.hapticsEnabled, setExpenses]
  );

  const voidExpense = useCallback(
    (id: string): boolean => {
      let changed = false;
      setExpenses((prev) =>
        prev.map((exp) => {
          if (exp.id !== id) return exp;
          changed = true;
          return {
            ...exp,
            status: exp.status === 'voided' ? 'recorded' : 'voided',
          };
        })
      );
      if (changed) {
        triggerHaptic('medium', settings.hapticsEnabled);
      }
      return changed;
    },
    [settings.hapticsEnabled, setExpenses]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      triggerHaptic('medium', settings.hapticsEnabled);
    },
    [settings.hapticsEnabled, setExpenses]
  );

  return {
    deletedProductIdsRef,
    deletedCustomerIdsRef,
    cartTotals,
    addToCart,
    updateCartQuantity,
    setCartItemSaleUnit,
    setCartItemDiscount,
    removeFromCart,
    clearCart,
    processCheckout,
    settleTransactionDebt,
    updateTransactionFulfillment,
    applyNewRateToTransaction,
    lockTransactionSaleRate,
    applyNewRateToAllTransactions,
    voidTransaction,
    addProduct,
    updateProduct,
    deleteProduct,
    recordStockAdjustment,
    recordGoodsReceipt,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addExpense,
    updateExpense,
    voidExpense,
    deleteExpense,
  };
}
