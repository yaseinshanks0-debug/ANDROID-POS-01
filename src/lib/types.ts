/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  sku: string;
  barcode: string;
  barcodes?: string[];
  category: string;
  categoryAr?: string;
  costPrice: number;
  sellingPrice: number;
  priceCurrency?: SupportedCurrency;
  stock: number;
  minStockAlert: number;
  image?: string;
  imageUrl?: string | null;
  emoji?: string;
  colorHex?: string;
  customFields?: Record<string, any>;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  itemDiscountPercent: number; // 0 to 100
}

export type PaymentMethod = 'cash' | 'bank_transfer' | 'qr_nfc' | 'card';

export type PaymentSettlementStatus = 'paid' | 'partial' | 'unpaid';

export interface CheckoutPaymentDetails {
  transferReference?: string;
  transferReceiptImage?: string;
  paymentStatus?: PaymentSettlementStatus;
  amountPaid?: number;
  debtAmount?: number;
}

export type SalesRateValuationMode = 'live' | 'indexed' | 'historical';

export interface Transaction {
  id: string; // e.g., TXN-20261029-4821
  idempotencyKey: string;
  timestamp: string;
  currency?: SupportedCurrency;
  exchangeRateUsed?: number;
  exchangeRatesSnapshot?: Record<string, number>;
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    discountPercent: number;
    total: number;
  }[];
  subtotal: number;
  taxRatePercent: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  amountTendered: number;
  changeDue: number;
  paymentStatus?: PaymentSettlementStatus;
  amountPaid?: number;
  debtAmount?: number;
  transferReference?: string;
  transferReceiptImage?: string;
  customerId?: string;
  customerName?: string;
  cashierName: string;
  status: 'completed' | 'voided';
  syncStatus: 'synced' | 'pending_sync' | 'failed';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  totalSpent: number;
  totalDebt?: number;
  transactionCount: number;
  loyaltyPoints: number;
  createdAt: string;
}

export type StockMovementType = 'sale' | 'restock' | 'damage' | 'loss' | 'audit';

export interface StockMovement {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  type: StockMovementType;
  quantityChange: number;
  previousStock: number;
  newStock: number;
  reason: string;
  referenceId?: string; // e.g. transaction ID
}

export type SupportedCurrency = 'SDG' | 'USD' | 'SAR' | 'AED' | 'EUR' | 'GBP' | (string & {});
export type AppTheme = 'dark' | 'light';
export type AppLanguage = 'en' | 'ar';

export interface Currency {
  code: string;
  name: string;
  nameAr?: string | null;
  symbol: string;
  decimalPlaces: number;
  isBase: boolean;
  isActive: boolean;
}

export interface ExchangeRateItem {
  id: string;
  sourceCurrency: string;
  targetCurrency: string;
  rate: number;
  inverseRate: number;
  effectiveFrom: string;
  expiryDate?: string | null;
  isActive: boolean;
  createdBy?: string | null;
  sourceSymbol?: string;
  targetSymbol?: string;
  sourceName?: string;
  targetName?: string;
}

export interface AppSettings {
  storeName: string;
  storeNameAr: string;
  storeLogo?: string;
  address: string;
  addressAr: string;
  taxNumber: string;
  phone: string;
  receiptFooter: string;
  receiptFooterAr: string;
  currency: SupportedCurrency;
  exchangeRates?: Record<string, number>;
  taxRatePercent: number;
  isTaxInclusive: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme: AppTheme;
  language: AppLanguage;
}

export type AppNavTab =
  | 'dashboard'
  | 'checkout'
  | 'products'
  | 'inventory'
  | 'customers'
  | 'sales'
  | 'reports'
  | 'settings';
