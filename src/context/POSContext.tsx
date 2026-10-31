/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Product,
  CartItem,
  Transaction,
  Customer,
  StockMovement,
  AppSettings,
  AppNavTab,
  PaymentMethod,
  CheckoutPaymentDetails,
  StockMovementType,
  Currency,
  ExchangeRateItem,
} from '../lib/types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_TRANSACTIONS,
  INITIAL_SETTINGS,
  INITIAL_STOCK_MOVEMENTS,
} from '../lib/initial-data';
import {
  calculateCartTotals,
  calculateDebtBreakdown,
  validateCheckout,
  CartTotalsResult,
  getProductPricesInCurrency,
  repriceTransactionToNewRate,
} from '../lib/pos-calculations';
import { calculateStockAdjustment, generateTransactionId, generateIdempotencyKey } from '../lib/inventory-rules';
import { playSuccessChime, triggerHaptic } from '../lib/sound-fx';
import { api } from '../services/api';
import {
  EXCHANGE_RATES_STORAGE_KEY,
  EXCHANGE_RATE_ITEMS_STORAGE_KEY,
  CURRENCIES_STORAGE_KEY,
  DEFAULT_EXCHANGE_RATES_MAP,
  DEFAULT_CURRENCIES_LIST,
  loadPersistedCurrencies,
  savePersistedCurrencies,
  reconcileCurrenciesWithPersisted,
  loadPersistedExchangeRates,
  savePersistedExchangeRates,
  loadPersistedExchangeRateItems,
  savePersistedExchangeRateItems,
  reconcileRatesWithPersisted,
} from '../lib/exchange-rate-storage';

interface POSContextType {
  products: Product[];
  cart: CartItem[];
  transactions: Transaction[];
  customers: Customer[];
  stockMovements: StockMovement[];
  settings: AppSettings;
  currencies: Currency[];
  exchangeRates: Record<string, number>;
  exchangeRateItems: ExchangeRateItem[];
  activeTab: AppNavTab;
  setActiveTab: (tab: AppNavTab) => void;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  globalDiscountPercent: number;
  setGlobalDiscountPercent: (discount: number) => void;
  cartTotals: CartTotalsResult;

  // Cart actions
  addToCart: (product: Product, quantity?: number) => boolean;
  updateCartQuantity: (productId: string, delta: number) => void;
  setCartItemDiscount: (productId: string, discountPercent: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Checkout
  processCheckout: (
    paymentMethod: PaymentMethod,
    amountTendered: number,
    details?: CheckoutPaymentDetails
  ) => Promise<{ success: boolean; transaction?: Transaction; error?: string }>;

  // Products
  addProduct: (product: Omit<Product, 'id' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | void>;
  deleteProduct: (id: string) => Promise<void>;

  // Inventory
  recordStockAdjustment: (
    productId: string,
    type: StockMovementType,
    amount: number,
    reason: string
  ) => void;

  // Customers
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalSpent' | 'transactionCount' | 'loyaltyPoints'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;

  // Transactions
  voidTransaction: (transactionId: string) => boolean;
  settleTransactionDebt: (
    transactionId: string,
    useIndexedNewRate?: boolean,
    anchorCurrency?: string
  ) => boolean;
  applyNewRateToTransaction: (transactionId: string, anchorCurrency?: string) => boolean;
  applyNewRateToAllTransactions: (onlyDebt?: boolean, anchorCurrency?: string) => number;

  // Settings, Currencies, Exchange Rates & Sync
  updateSettings: (updates: Partial<AppSettings>) => void;
  saveCurrency: (data: {
    code: string;
    name: string;
    nameAr?: string;
    symbol: string;
    decimalPlaces?: number;
    initialRateToBase?: number;
  }) => Promise<Currency>;
  removeCurrency: (code: string) => Promise<void>;
  syncCurrenciesState: (list: Currency[]) => void;
  updateExchangeRate: (data: {
    sourceCurrency: string;
    targetCurrency: string;
    rate: number;
    effectiveFrom?: string;
    expiryDate?: string | null;
  }) => Promise<ExchangeRateItem>;
  syncExchangeRatesState: (items: ExchangeRateItem[]) => void;
  resetAllData: () => void;
  syncTransactions: () => Promise<void>;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
}

const POSContext = createContext<POSContextType | null>(null);

const STORAGE_KEYS = {
  PRODUCTS: 'dqnamo_pos_products_v1',
  TRANSACTIONS: 'dqnamo_pos_transactions_v1',
  CUSTOMERS: 'dqnamo_pos_customers_v1',
  MOVEMENTS: 'dqnamo_pos_movements_v1',
  SETTINGS: 'dqnamo_pos_settings_v1',
  CURRENCIES: CURRENCIES_STORAGE_KEY,
  EXCHANGE_RATES: EXCHANGE_RATES_STORAGE_KEY,
  EXCHANGE_RATE_ITEMS: EXCHANGE_RATE_ITEMS_STORAGE_KEY,
};

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persistent states or fallback to seed data
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return stored ? JSON.parse(stored) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
      return stored ? JSON.parse(stored) : INITIAL_STOCK_MOVEMENTS;
    } catch {
      return INITIAL_STOCK_MOVEMENTS;
    }
  });

  const [currencies, setCurrencies] = useState<Currency[]>(() => {
    return loadPersistedCurrencies();
  });

  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(() => {
    const persisted = loadPersistedExchangeRates();
    try {
      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        if (parsed?.exchangeRates && typeof parsed.exchangeRates === 'object') {
          return { ...DEFAULT_EXCHANGE_RATES_MAP, ...parsed.exchangeRates, ...persisted, SDG: 1 };
        }
      }
    } catch {}
    return persisted;
  });

  const [exchangeRateItems, setExchangeRateItems] = useState<ExchangeRateItem[]>(() => {
    return loadPersistedExchangeRateItems();
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const initialRates = loadPersistedExchangeRates();
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          exchangeRates: {
            ...DEFAULT_EXCHANGE_RATES_MAP,
            ...(parsed.exchangeRates || {}),
            ...initialRates,
            SDG: 1,
          },
        };
      }
      return { ...INITIAL_SETTINGS, exchangeRates: initialRates };
    } catch {
      return { ...INITIAL_SETTINGS, exchangeRates: initialRates };
    }
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<AppNavTab>('checkout');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(new Date());

  // Fetch products, currencies, and exchange rates from backend API on mount, reconciling with LocalStorage
  useEffect(() => {
    api.getProducts()
      .then((remoteProducts) => {
        if (remoteProducts && remoteProducts.length > 0) {
          setProducts(remoteProducts);
        }
      })
      .catch((err) => {
        console.warn('Backend API getProducts offline/failed, using local cache:', err);
      });

    Promise.all([
      api.getCurrencies().catch(() => null),
      api.getExchangeRates(true).catch(() => null),
    ]).then(([currRes, remoteRates]) => {
      const persistedCurrencies = loadPersistedCurrencies();
      const mergedCurrencies = currRes?.currencies
        ? reconcileCurrenciesWithPersisted(currRes.currencies, persistedCurrencies)
        : persistedCurrencies;

      setCurrencies(mergedCurrencies);
      savePersistedCurrencies(mergedCurrencies);

      const persistedMap = loadPersistedExchangeRates();
      const persistedItems = loadPersistedExchangeRateItems();
      const reconciled = reconcileRatesWithPersisted(
        remoteRates || [],
        persistedMap,
        persistedItems,
        mergedCurrencies
      );
      if (reconciled.length > 0) {
        setExchangeRateItems(reconciled);
        savePersistedExchangeRateItems(reconciled);

        const nextMap: Record<string, number> = { ...persistedMap, SDG: 1 };
        for (const r of reconciled) {
          if (r.targetCurrency === 'SDG' && r.rate > 0) {
            nextMap[r.sourceCurrency.toUpperCase()] = r.rate;
          }
        }
        setExchangeRates(nextMap);
        savePersistedExchangeRates(nextMap);
        setSettings((prev) => ({
          ...prev,
          exchangeRates: nextMap,
        }));
      }
    });
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch {}
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(stockMovements));
    } catch {}
  }, [stockMovements]);

  useEffect(() => {
    if (currencies.length > 0) {
      savePersistedCurrencies(currencies);
    }
  }, [currencies]);

  useEffect(() => {
    savePersistedExchangeRates(exchangeRates);
  }, [exchangeRates]);

  useEffect(() => {
    if (exchangeRateItems.length > 0) {
      savePersistedExchangeRateItems(exchangeRateItems);
    }
  }, [exchangeRateItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {}

    // Update document HTML direction and language
    if (typeof document !== 'undefined') {
      document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = settings.language;
      if (settings.theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    }
  }, [settings]);

  // Derived cart totals calculation with active currency and exchange rate conversion
  const cartTotals = useMemo(() => {
    return calculateCartTotals(
      cart,
      settings.taxRatePercent,
      globalDiscountPercent,
      settings.isTaxInclusive,
      settings.currency,
      exchangeRates
    );
  }, [
    cart,
    settings.taxRatePercent,
    globalDiscountPercent,
    settings.isTaxInclusive,
    settings.currency,
    exchangeRates,
  ]);

  // Add product to cart
  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      // Find current stock in fresh products state
      const currentProduct = products.find((p) => p.id === product.id) || product;
      const existingItem = cart.find((item) => item.product.id === currentProduct.id);
      const currentQty = existingItem ? existingItem.quantity : 0;
      const newQty = currentQty + quantity;

      if (newQty > currentProduct.stock) {
        triggerHaptic('warning', settings.hapticsEnabled);
        return false;
      }

      setCart((prev) => {
        if (existingItem) {
          return prev.map((item) =>
            item.product.id === currentProduct.id ? { ...item, quantity: newQty } : item
          );
        }
        return [...prev, { product: currentProduct, quantity, itemDiscountPercent: 0 }];
      });

      triggerHaptic('light', settings.hapticsEnabled);
      return true;
    },
    [cart, products, settings.hapticsEnabled]
  );

  // Update quantity in cart
  const updateCartQuantity = useCallback(
    (productId: string, delta: number) => {
      setCart((prev) => {
        return prev
          .map((item) => {
            if (item.product.id === productId) {
              const freshProduct = products.find((p) => p.id === productId) || item.product;
              const newQty = item.quantity + delta;
              if (newQty <= 0) return null;
              if (newQty > freshProduct.stock) {
                triggerHaptic('warning', settings.hapticsEnabled);
                return item;
              }
              return { ...item, quantity: newQty };
            }
            return item;
          })
          .filter((item): item is CartItem => item !== null);
      });
      triggerHaptic('light', settings.hapticsEnabled);
    },
    [products, settings.hapticsEnabled]
  );

  const setCartItemDiscount = useCallback((productId: string, discountPercent: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, itemDiscountPercent: Math.max(0, Math.min(100, discountPercent)) }
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      triggerHaptic('medium', settings.hapticsEnabled);
    },
    [settings.hapticsEnabled]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCustomer(null);
    setGlobalDiscountPercent(0);
    triggerHaptic('medium', settings.hapticsEnabled);
  }, [settings.hapticsEnabled]);

  // Execute Checkout
  const processCheckout = useCallback(
    async (
      paymentMethod: PaymentMethod,
      amountTendered: number,
      details?: CheckoutPaymentDetails
    ): Promise<{ success: boolean; transaction?: Transaction; error?: string }> => {
      // 1. Validate
      const validation = validateCheckout(
        cart,
        paymentMethod,
        amountTendered,
        cartTotals.grandTotal,
        details
      );
      if (!validation.valid) {
        triggerHaptic('warning', settings.hapticsEnabled);
        return { success: false, error: validation.error };
      }

      // 2. Prevent duplicate submissions using idempotency key
      const idempotencyKey = generateIdempotencyKey();
      const transactionId = generateTransactionId();

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
      const activeRateSnapshot: Record<string, number> = {
        ...DEFAULT_EXCHANGE_RATES_MAP,
        ...exchangeRates,
        SDG: 1,
      };
      const rateUsedAtSale =
        activeCurrency === 'SDG'
          ? Number(activeRateSnapshot['USD'] || 2700)
          : Number(activeRateSnapshot[activeCurrency] || 1);

      const newTransaction: Transaction = {
        id: transactionId,
        idempotencyKey,
        timestamp: new Date().toISOString(),
        currency: activeCurrency,
        exchangeRateUsed: rateUsedAtSale,
        exchangeRatesSnapshot: activeRateSnapshot,
        items: cart.map((item) => {
          const convertedUnitPrice = getProductPricesInCurrency(
            item.product,
            settings.currency,
            exchangeRates
          ).sellingPrice;
          return {
            productId: item.product.id,
            productName: item.product.name,
            sku: item.product.sku,
            quantity: item.quantity,
            unitPrice: convertedUnitPrice,
            discountPercent: item.itemDiscountPercent,
            total:
              convertedUnitPrice *
              item.quantity *
              (1 - item.itemDiscountPercent / 100),
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
        transferReceiptImage: details?.transferReceiptImage || undefined,
        customerId: selectedCustomer?.id,
        customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
        cashierName: 'Main Terminal',
        status: 'completed',
        syncStatus: 'synced',
      };

      // 3. Deduct stock and record movements
      const newMovements: StockMovement[] = [];
      setProducts((prev) =>
        prev.map((prod) => {
          const cartItem = cart.find((item) => item.product.id === prod.id);
          if (cartItem) {
            const updatedStock = Math.max(0, prod.stock - cartItem.quantity);
            newMovements.push({
              id: `mov_${Date.now()}_${prod.id}`,
              timestamp: new Date().toISOString(),
              productId: prod.id,
              productName: prod.name,
              type: 'sale',
              quantityChange: -cartItem.quantity,
              previousStock: prod.stock,
              newStock: updatedStock,
              reason: `POS Checkout (${transactionId})`,
              referenceId: transactionId,
            });
            return {
              ...prod,
              stock: updatedStock,
              updatedAt: new Date().toISOString(),
            };
          }
          return prod;
        })
      );

      // 4. Update stock movements log
      setStockMovements((prev) => [...newMovements, ...prev]);

      // 5. Update Customer metrics if customer was attached
      if (selectedCustomer) {
        setCustomers((prev) =>
          prev.map((cust) => {
            if (cust.id === selectedCustomer.id) {
              const addedPoints = Math.floor(cartTotals.grandTotal);
              const prevDebt = cust.totalDebt || 0;
              return {
                ...cust,
                totalSpent: Math.round((cust.totalSpent + cartTotals.grandTotal) * 100) / 100,
                totalDebt: Math.round((prevDebt + breakdown.debtAmount) * 100) / 100,
                transactionCount: cust.transactionCount + 1,
                loyaltyPoints: cust.loyaltyPoints + addedPoints,
              };
            }
            return cust;
          })
        );
      }

      // 6. Record transaction
      setTransactions((prev) => [newTransaction, ...prev]);

      // 7. Clear cart & sound chime
      setCart([]);
      setSelectedCustomer(null);
      setGlobalDiscountPercent(0);

      playSuccessChime(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);

      return { success: true, transaction: newTransaction };
    },
    [cart, cartTotals, selectedCustomer, settings, exchangeRates]
  );

  // Settle an outstanding debt on a transaction (optionally re-indexing to the new exchange rate first)
  const settleTransactionDebt = useCallback(
    (
      transactionId: string,
      useIndexedNewRate: boolean = false,
      anchorCurrency: string = 'USD'
    ): boolean => {
      const txn = transactions.find((t) => t.id === transactionId);
      if (!txn || txn.status === 'voided' || !txn.debtAmount || txn.debtAmount <= 0) {
        return false;
      }

      const settledOriginalDebt = txn.debtAmount;

      setTransactions((prev) =>
        prev.map((t) => {
          if (t.id !== transactionId) return t;
          const baseTx = useIndexedNewRate
            ? repriceTransactionToNewRate(t, exchangeRates, anchorCurrency)
            : t;
          return {
            ...baseTx,
            paymentStatus: 'paid',
            amountPaid: baseTx.grandTotal,
            debtAmount: 0,
            amountTendered: baseTx.grandTotal,
          };
        })
      );

      if (txn.customerId) {
        setCustomers((prev) =>
          prev.map((cust) => {
            if (cust.id === txn.customerId) {
              const prevDebt = cust.totalDebt || 0;
              return {
                ...cust,
                totalDebt: Math.max(0, Math.round((prevDebt - settledOriginalDebt) * 100) / 100),
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
    [transactions, exchangeRates, settings.soundEnabled, settings.hapticsEnabled]
  );

  // Permanently re-price a single transaction (and its remaining customer debt) to the current exchange rate
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
    [transactions, exchangeRates, settings.soundEnabled, settings.hapticsEnabled]
  );

  // Permanently re-price all transactions (or only unpaid/partial debt transactions) to the current exchange rate
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
    [exchangeRates, settings.soundEnabled, settings.hapticsEnabled]
  );

  // Void / Refund Transaction
  const voidTransaction = useCallback(
    (transactionId: string): boolean => {
      const txn = transactions.find((t) => t.id === transactionId);
      if (!txn || txn.status === 'voided') return false;

      // 1. Restore product stock levels
      const returnMovements: StockMovement[] = [];
      setProducts((prev) =>
        prev.map((prod) => {
          const item = txn.items.find((i) => i.productId === prod.id);
          if (item) {
            const restoredStock = prod.stock + item.quantity;
            returnMovements.push({
              id: `mov_void_${Date.now()}_${prod.id}`,
              timestamp: new Date().toISOString(),
              productId: prod.id,
              productName: prod.name,
              type: 'restock',
              quantityChange: item.quantity,
              previousStock: prod.stock,
              newStock: restoredStock,
              reason: `Transaction Void/Refund (${txn.id})`,
              referenceId: txn.id,
            });
            return {
              ...prod,
              stock: restoredStock,
              updatedAt: new Date().toISOString(),
            };
          }
          return prod;
        })
      );

      // 2. Add movements to log
      setStockMovements((prev) => [...returnMovements, ...prev]);

      // 3. Mark transaction as voided
      setTransactions((prev) =>
        prev.map((t) => (t.id === transactionId ? { ...t, status: 'voided' as const } : t))
      );

      // 4. Revert customer stats if applicable
      if (txn.customerId) {
        setCustomers((prev) =>
          prev.map((cust) => {
            if (cust.id === txn.customerId) {
              const prevDebt = cust.totalDebt || 0;
              const txnDebt = txn.debtAmount || 0;
              return {
                ...cust,
                totalSpent: Math.max(0, Math.round((cust.totalSpent - txn.grandTotal) * 100) / 100),
                totalDebt: Math.max(0, Math.round((prevDebt - txnDebt) * 100) / 100),
                loyaltyPoints: Math.max(0, cust.loyaltyPoints - Math.floor(txn.grandTotal)),
              };
            }
            return cust;
          })
        );
      }

      triggerHaptic('medium', settings.hapticsEnabled);
      return true;
    },
    [transactions, settings.hapticsEnabled]
  );

  // Add Product
  const addProduct = useCallback(
    async (productData: Omit<Product, 'id' | 'updatedAt'>): Promise<Product> => {
      let created: Product;
      try {
        created = await api.createProduct(productData);
      } catch (err: any) {
        if (err?.message?.includes('Duplicate')) {
          throw err;
        }
        console.warn('Backend API createProduct failed, saving locally:', err);
        created = {
          ...productData,
          id: `prod-${Date.now()}`,
          updatedAt: new Date().toISOString(),
        };
      }

      setProducts((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);

      // Record initial inventory movement
      if (created.stock > 0) {
        setStockMovements((prev) => [
          {
            id: `mov_init_${created.id}`,
            timestamp: new Date().toISOString(),
            productId: created.id,
            productName: created.name,
            type: 'restock',
            quantityChange: created.stock,
            previousStock: 0,
            newStock: created.stock,
            reason: 'Initial Product Stock In',
          },
          ...prev,
        ]);
      }

      triggerHaptic('success', settings.hapticsEnabled);
      return created;
    },
    [settings.hapticsEnabled]
  );

  // Update Product
  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      try {
        const updated = await api.updateProduct(id, updates);
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        setCart((prev) =>
          prev.map((item) => (item.product.id === id ? { ...item, product: updated } : item))
        );
        triggerHaptic('light', settings.hapticsEnabled);
        return updated;
      } catch (err: any) {
        if (err?.message?.includes('Duplicate')) {
          throw err;
        }
        console.warn('Backend API updateProduct failed, applying local update:', err);
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          )
        );
        setCart((prev) =>
          prev.map((item) =>
            item.product.id === id
              ? { ...item, product: { ...item.product, ...updates, updatedAt: new Date().toISOString() } }
              : item
          )
        );
        triggerHaptic('light', settings.hapticsEnabled);
      }
    },
    [settings.hapticsEnabled]
  );

  // Delete Product
  const deleteProduct = useCallback(
    async (id: string) => {
      try {
        await api.deleteProduct(id);
      } catch (err) {
        console.warn('Backend API deleteProduct failed, removing locally:', err);
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setCart((prev) => prev.filter((item) => item.product.id !== id));
      triggerHaptic('medium', settings.hapticsEnabled);
    },
    [settings.hapticsEnabled]
  );

  // Record Stock Adjustment
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
        prev.map((p) => (p.id === productId ? { ...p, stock: newStock, updatedAt: new Date().toISOString() } : p))
      );
      setStockMovements((prev) => [movement, ...prev]);
      triggerHaptic('medium', settings.hapticsEnabled);
    },
    [products, settings.hapticsEnabled]
  );

  // Add Customer
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
    [settings.hapticsEnabled]
  );

  const updateCustomer = useCallback(
    (id: string, updates: Partial<Customer>) => {
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      );
      triggerHaptic('light', settings.hapticsEnabled);
    },
    [settings.hapticsEnabled]
  );

  const updateSettings = useCallback(
    (updates: Partial<AppSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...updates };
        if (updates.exchangeRates) {
          const mergedRates = { ...prev.exchangeRates, ...updates.exchangeRates, SDG: 1 };
          next.exchangeRates = mergedRates;
          setExchangeRates(mergedRates);
          savePersistedExchangeRates(mergedRates);
        }
        return next;
      });
      triggerHaptic('light', settings.hapticsEnabled);
    },
    [settings.hapticsEnabled]
  );

  // Sync currencies list into POSContext and LocalStorage
  const syncCurrenciesState = useCallback((list: Currency[]) => {
    if (!list || list.length === 0) return;
    setCurrencies(list);
    savePersistedCurrencies(list);
  }, []);

  // Create or update a currency and its initial exchange rate in PostgreSQL + POSContext + LocalStorage
  const saveCurrency = useCallback(
    async (data: {
      code: string;
      name: string;
      nameAr?: string;
      symbol: string;
      decimalPlaces?: number;
      initialRateToBase?: number;
    }): Promise<Currency> => {
      const code = data.code.toUpperCase().trim();
      const name = data.name.trim() || code;
      const nameAr = data.nameAr?.trim() || name;
      const symbol = data.symbol.trim() || code;
      const decimalPlaces = data.decimalPlaces ?? 2;
      const initialRate = data.initialRateToBase && data.initialRateToBase > 0 ? Number(data.initialRateToBase) : undefined;

      let savedCurrency: Currency;
      try {
        savedCurrency = await api.saveCurrency({
          code,
          name,
          nameAr,
          symbol,
          decimalPlaces,
          initialRateToBase: code !== 'SDG' ? initialRate : undefined,
        });
      } catch (err) {
        // Fallback local currency record if backend is unreachable
        savedCurrency = {
          code,
          name,
          nameAr,
          symbol,
          decimalPlaces,
          isBase: code === 'SDG',
          isActive: true,
        };
      }

      // Immediately update currencies list in POSContext & LocalStorage
      setCurrencies((prev) => {
        const exists = prev.some((c) => c.code.toUpperCase() === code);
        const nextList = exists
          ? prev.map((c) => (c.code.toUpperCase() === code ? { ...c, ...savedCurrency, isActive: true } : c))
          : [...prev, savedCurrency];
        savePersistedCurrencies(nextList);
        return nextList;
      });

      // Immediately update exchangeRates and exchangeRateItems if non-base currency with rate
      if (code !== 'SDG' && initialRate && initialRate > 0) {
        const nowIso = new Date().toISOString();
        setExchangeRates((prev) => {
          const nextMap = { ...prev, [code]: initialRate, SDG: 1 };
          savePersistedExchangeRates(nextMap);
          return nextMap;
        });
        setSettings((prevSettings) => ({
          ...prevSettings,
          exchangeRates: { ...(prevSettings.exchangeRates || {}), [code]: initialRate, SDG: 1 },
        }));

        setExchangeRateItems((prevItems) => {
          const newItem: ExchangeRateItem = {
            id: `rate-${code.toLowerCase()}-sdg-${Date.now()}`,
            sourceCurrency: code,
            targetCurrency: 'SDG',
            rate: initialRate,
            inverseRate: Math.round((1 / initialRate) * 1000000) / 1000000,
            effectiveFrom: nowIso,
            expiryDate: null,
            isActive: true,
            sourceSymbol: symbol,
            targetSymbol: 'ج.س',
            sourceName: name,
            targetName: 'Sudanese Pound',
          };
          const exists = prevItems.some(
            (i) => i.sourceCurrency.toUpperCase() === code && i.targetCurrency === 'SDG'
          );
          const nextItems = exists
            ? prevItems.map((i) =>
                i.sourceCurrency.toUpperCase() === code && i.targetCurrency === 'SDG'
                  ? { ...i, ...newItem }
                  : i
              )
            : [...prevItems, newItem];
          savePersistedExchangeRateItems(nextItems);
          return nextItems;
        });
      }

      return savedCurrency;
    },
    []
  );

  // Remove/deactivate a currency in PostgreSQL + POSContext + LocalStorage
  const removeCurrency = useCallback(async (code: string): Promise<void> => {
    const cleanCode = code.toUpperCase().trim();
    if (!cleanCode || cleanCode === 'SDG') return;

    try {
      await api.deleteCurrency(cleanCode);
    } catch (err) {
      console.warn(`Backend deleteCurrency(${cleanCode}) failed, removing locally:`, err);
    }

    setCurrencies((prev) => {
      const nextList = prev.filter((c) => c.code.toUpperCase() !== cleanCode);
      savePersistedCurrencies(nextList);
      return nextList;
    });

    setExchangeRateItems((prev) => {
      const nextItems = prev.filter(
        (r) => r.sourceCurrency.toUpperCase() !== cleanCode && r.targetCurrency.toUpperCase() !== cleanCode
      );
      savePersistedExchangeRateItems(nextItems);
      return nextItems;
    });

    setSettings((prev) => ({
      ...prev,
      currency: prev.currency === cleanCode ? 'SDG' : prev.currency,
    }));
  }, []);

  // Sync a full list of ExchangeRateItems into POSContext and LocalStorage
  const syncExchangeRatesState = useCallback((items: ExchangeRateItem[]) => {
    setExchangeRateItems(items);
    savePersistedExchangeRateItems(items);

    const ratesPatch: Record<string, number> = { SDG: 1 };
    for (const r of items) {
      if (r.targetCurrency === 'SDG' && r.rate > 0) {
        ratesPatch[r.sourceCurrency.toUpperCase()] = r.rate;
      }
    }

    setExchangeRates((prevMap) => {
      const nextMap: Record<string, number> = { ...prevMap, ...ratesPatch, SDG: 1 };
      savePersistedExchangeRates(nextMap);
      return nextMap;
    });

    setSettings((prevSettings) => ({
      ...prevSettings,
      exchangeRates: { ...(prevSettings.exchangeRates || {}), ...ratesPatch, SDG: 1 },
    }));
  }, []);

  // Update a single currency exchange rate and persist to LocalStorage + PostgreSQL backend
  const updateExchangeRate = useCallback(
    async (data: {
      sourceCurrency: string;
      targetCurrency: string;
      rate: number;
      effectiveFrom?: string;
      expiryDate?: string | null;
    }): Promise<ExchangeRateItem> => {
      const source = data.sourceCurrency.toUpperCase().trim();
      const target = data.targetCurrency.toUpperCase().trim();
      const rateNum = Number(data.rate);
      const effectiveIso = data.effectiveFrom || new Date().toISOString();

      let savedRecord: ExchangeRateItem;
      try {
        savedRecord = await api.saveExchangeRate({
          sourceCurrency: source,
          targetCurrency: target,
          rate: rateNum,
          effectiveFrom: effectiveIso,
          expiryDate: data.expiryDate ?? null,
        });
      } catch (err) {
        // Fallback local record if offline so LocalStorage persistence still succeeds
        savedRecord = {
          id: `rate-${source.toLowerCase()}-${target.toLowerCase()}-${Date.now()}`,
          sourceCurrency: source,
          targetCurrency: target,
          rate: rateNum,
          inverseRate: rateNum > 0 ? Math.round((1 / rateNum) * 1000000) / 1000000 : 0,
          effectiveFrom: effectiveIso,
          expiryDate: data.expiryDate ?? null,
          isActive: true,
        };
      }

      // Immediately persist updated rate in POSContext state and LocalStorage
      const computedRateToSdg =
        target === 'SDG' ? savedRecord.rate : source === 'SDG' && savedRecord.rate > 0 ? 1 / savedRecord.rate : null;

      if (computedRateToSdg && computedRateToSdg > 0) {
        const foreignCode = target === 'SDG' ? source : target;
        setExchangeRates((prev) => {
          const nextMap = { ...prev, [foreignCode]: computedRateToSdg, SDG: 1 };
          savePersistedExchangeRates(nextMap);
          return nextMap;
        });
        setSettings((prevSettings) => ({
          ...prevSettings,
          exchangeRates: { ...(prevSettings.exchangeRates || {}), [foreignCode]: computedRateToSdg, SDG: 1 },
        }));
      }

      setExchangeRateItems((prevItems) => {
        const exists = prevItems.some(
          (i) => i.sourceCurrency === savedRecord.sourceCurrency && i.targetCurrency === savedRecord.targetCurrency
        );
        const nextItems = exists
          ? prevItems.map((i) =>
              i.sourceCurrency === savedRecord.sourceCurrency && i.targetCurrency === savedRecord.targetCurrency
                ? { ...i, ...savedRecord }
                : i
            )
          : [...prevItems, savedRecord];
        savePersistedExchangeRateItems(nextItems);
        return nextItems;
      });

      return savedRecord;
    },
    []
  );

  const resetAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.MOVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CURRENCIES);
    localStorage.removeItem(STORAGE_KEYS.EXCHANGE_RATES);
    localStorage.removeItem(STORAGE_KEYS.EXCHANGE_RATE_ITEMS);

    setProducts(INITIAL_PRODUCTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCustomers(INITIAL_CUSTOMERS);
    setStockMovements(INITIAL_STOCK_MOVEMENTS);
    setSettings(INITIAL_SETTINGS);
    setCurrencies([...DEFAULT_CURRENCIES_LIST]);
    setExchangeRates({ ...DEFAULT_EXCHANGE_RATES_MAP });
    setExchangeRateItems([]);
    setCart([]);
    setSelectedCustomer(null);
    setGlobalDiscountPercent(0);

    triggerHaptic('heavy', true);
  }, []);

  const syncTransactions = useCallback(async () => {
    setIsSyncing(true);
    triggerHaptic('light', settings.hapticsEnabled);
    // Simulate real network sync with durable queue
    await new Promise((res) => setTimeout(res, 800));
    setTransactions((prev) =>
      prev.map((t) => (t.syncStatus !== 'synced' ? { ...t, syncStatus: 'synced' } : t))
    );
    setLastSyncedAt(new Date());
    setIsSyncing(false);
    triggerHaptic('success', settings.hapticsEnabled);
  }, [settings.hapticsEnabled]);

  const value = {
    products,
    cart,
    transactions,
    customers,
    stockMovements,
    settings,
    currencies,
    exchangeRates,
    exchangeRateItems,
    activeTab,
    setActiveTab,
    selectedCustomer,
    setSelectedCustomer,
    globalDiscountPercent,
    setGlobalDiscountPercent,
    cartTotals,
    addToCart,
    updateCartQuantity,
    setCartItemDiscount,
    removeFromCart,
    clearCart,
    processCheckout,
    addProduct,
    updateProduct,
    deleteProduct,
    recordStockAdjustment,
    addCustomer,
    updateCustomer,
    voidTransaction,
    settleTransactionDebt,
    applyNewRateToTransaction,
    applyNewRateToAllTransactions,
    updateSettings,
    saveCurrency,
    removeCurrency,
    syncCurrenciesState,
    updateExchangeRate,
    syncExchangeRatesState,
    resetAllData,
    syncTransactions,
    isSyncing,
    lastSyncedAt,
  };

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
};

export function usePOS() {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}
