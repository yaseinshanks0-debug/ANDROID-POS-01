/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const PRODUCT_SALE_UNIT_MODES = {
  UNIT: 'unit',
  PACK: 'pack',
} as const;
export type ProductSaleUnitMode =
  (typeof PRODUCT_SALE_UNIT_MODES)[keyof typeof PRODUCT_SALE_UNIT_MODES];

export const ALLOWED_SALE_UNITS_MODES = {
  BOTH: 'both',
  UNIT_ONLY: 'unit_only',
  PACK_ONLY: 'pack_only',
} as const;
export type AllowedSaleUnitsMode =
  (typeof ALLOWED_SALE_UNITS_MODES)[keyof typeof ALLOWED_SALE_UNITS_MODES];

export interface ProductPriceHistoryEntry {
  id: string;
  timestamp: string;
  previousCostPrice: number;
  newCostPrice: number;
  previousSellingPrice: number;
  newSellingPrice: number;
  currency: string;
  changedBy?: string;
  note?: string;
}

export const PRODUCT_MODIFICATION_ACTIONS = {
  CREATED: 'created',
  UPDATED: 'updated',
  PRICE_CHANGED: 'price_changed',
  BARCODE_CHANGED: 'barcode_changed',
  STOCK_CHANGED: 'stock_changed',
} as const;
export type ProductModificationAction =
  (typeof PRODUCT_MODIFICATION_ACTIONS)[keyof typeof PRODUCT_MODIFICATION_ACTIONS];

export interface ProductModificationEntry {
  id: string;
  timestamp: string;
  action: ProductModificationAction;
  summaryEn: string;
  summaryAr: string;
  changedFields: string[];
  changedBy?: string;
}

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CASHIER: 'cashier',
  INVENTORY_CLERK: 'inventory_clerk',
} as const;
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const WORKSPACE_MODES = {
  PRODUCTION: 'PRODUCTION',
  PRACTICE: 'PRACTICE',
} as const;
export type WorkspaceMode = (typeof WORKSPACE_MODES)[keyof typeof WORKSPACE_MODES];

export interface RolePermissions {
  canCheckout: boolean;
  canManageProducts: boolean;
  canEditPrices: boolean;
  canManageInventory: boolean;
  canVoidTransactions: boolean;
  canManageExchangeRates: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
  canApplyDiscounts: boolean;
}

export interface POSUser {
  id: string;
  companyId?: string;
  username?: string;
  email?: string;
  phone?: string;
  name: string;
  nameAr?: string;
  role: UserRole;
  systemRole?: string; // 'COMPANY_OWNER' | 'ADMIN' | 'MANAGER' | 'CASHIER' | 'INVENTORY_MANAGER' | 'ACCOUNTANT' | 'PURCHASING_MANAGER' | 'REPORT_VIEWER' | 'CUSTOM_ROLE'
  capabilities?: string[];
  branchId?: string;
  assignedBranchIds?: string[];
  pin?: string;
  hasPassword?: boolean;
  mustChangePassword?: boolean;
  terminalName: string;
  terminalNameAr?: string;
  avatarColor: string;
  isActive: boolean;
  permissions: RolePermissions;
  lastActiveAt: string;
  lastLoginAt?: string | null;
  deactivatedAt?: string | null;
  deactivatedBy?: string | null;
  deactivationReason?: string | null;
}

export interface ActiveUserSession {
  sessionId: string;
  userId: string;
  companyId?: string;
  workspaceMode?: WorkspaceMode;
  userName: string;
  userNameAr?: string;
  role: UserRole;
  systemRole?: string;
  branchId?: string;
  terminalName: string;
  terminalNameAr?: string;
  startedAt: string;
  lastPingAt: string;
  status: 'online' | 'busy' | 'idle';
}

export interface BranchRecord {
  id: string;
  companyId: string;
  name: string;
  nameAr?: string;
  code: string;
  city?: string;
  address?: string;
  phone?: string;
  managerUserId?: string | null;
  isMain?: boolean;
  isMainBranch?: boolean;
  isActive: boolean;
  createdAt?: string;
}

export interface CompanyProfile {
  id: string;
  code?: string;
  legalName: string;
  displayName: string;
  displayNameAr?: string;
  businessType: string;
  logoUrl?: string | null;
  country: string;
  city?: string;
  address?: string;
  addressAr?: string;
  phone?: string;
  email?: string;
  taxNumber?: string;
  defaultLanguage: AppLanguage;
  defaultTimezone?: string;
  timezone?: string;
  baseCurrency: SupportedCurrency;
  secondaryCurrencies?: string[];
  currencyDisplayFormat?: 'symbol_amount' | 'code_amount' | 'amount_symbol';
  fiscalYearStartMonth: number;
  rateUpdatePolicy?: 'owner_only' | 'admin_only' | 'admin_or_manager';
  exchangeRatePolicy?: 'manual_daily' | 'locked_per_shift' | 'flexible_cashier';
  isDemo?: boolean;
  isDemoPractice?: boolean;
  setupCompleted?: boolean;
  onboardingCompleted?: boolean;
  ownerUserId?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface OnboardingChecklistStatus {
  companyProfileCompleted: boolean;
  companyProfileConfigured: boolean;
  currencyConfigured: boolean;
  currenciesConfigured: boolean;
  branchesCreated: boolean;
  branchCreated: boolean;
  productsAdded: boolean;
  firstProductsAdded: boolean;
  employeesAdded: boolean;
  firstEmployeeCreated: boolean;
  permissionsAssigned: boolean;
  firstSaleCompleted: boolean;
  openingInventoryConfigured: boolean;
  inventoryReviewed: boolean;
  guidedTourCompleted: boolean;
  completedCount: number;
  totalCount: number;
  completionPercent: number;
}

export const SUPPORTED_CATALOG_LIFECYCLE_STATUSES = [
  'ACTIVE',
  'TEMPORARILY_PAUSED',
  'DISCONTINUED',
] as const;

export type CatalogLifecycleStatus =
  (typeof SUPPORTED_CATALOG_LIFECYCLE_STATUSES)[number];

export interface StockBatchEntry {
  id: string;
  batchNumber: string;
  expiryDate?: string | null;
  quantityOnHand: number;
  status?: 'ACTIVE' | 'QUARANTINED_EXPIRED' | 'DEPLETED';
  branchId?: string | null;
}

export type CustomFieldScalarValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | ProductPriceHistoryEntry[]
  | ProductModificationEntry[]
  | StockBatchEntry[];

export interface ProductCustomFields {
  serialNumber?: number;
  description?: string | null;
  descriptionAr?: string | null;
  expiryDate?: string | null;
  barcodes?: string[];
  priceCurrency?: SupportedCurrency;
  createdAt?: string;
  previousCostPrice?: number;
  previousSellingPrice?: number;
  priceUpdatedAt?: string;
  priceHistory?: ProductPriceHistoryEntry[];
  modificationHistory?: ProductModificationEntry[];
  image?: string;
  changedBy?: string;
  enablePackaging?: boolean;
  unitName?: string;
  unitNameAr?: string;
  packName?: string;
  packNameAr?: string;
  unitsPerPack?: number;
  defaultSaleUnit?: ProductSaleUnitMode;
  allowedSaleUnits?: AllowedSaleUnitsMode;
  packCostPrice?: number;
  packSellingPrice?: number;
  catalogLifecycleStatus?: CatalogLifecycleStatus;
  discontinuedAt?: string | null;
  discontinuedReason?: string | null;
  replacementProductId?: string | null;
  batches?: StockBatchEntry[];
  [key: string]: CustomFieldScalarValue;
}

export interface Product {
  id: string;
  companyId?: string;
  branchId?: string;
  categoryId?: string;
  serialNumber?: number;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  sku: string;
  barcode: string;
  barcodes?: string[];
  category: string;
  categoryAr?: string;
  costPrice: number;
  sellingPrice: number;
  previousCostPrice?: number;
  previousSellingPrice?: number;
  priceUpdatedAt?: string;
  priceHistory?: ProductPriceHistoryEntry[];
  modificationHistory?: ProductModificationEntry[];
  priceCurrency?: SupportedCurrency;
  stock: number;
  minStockAlert: number;
  expiryDate?: string | null;
  isActive?: boolean;
  catalogLifecycleStatus?: CatalogLifecycleStatus;
  discontinuedAt?: string | null;
  discontinuedReason?: string | null;
  replacementProductId?: string | null;
  batches?: StockBatchEntry[];
  // Multi-Unit / Pack & Strip Packaging customization
  enablePackaging?: boolean;
  unitName?: string; // e.g. 'Strip', 'Piece'
  unitNameAr?: string; // e.g. 'شريط', 'قطعة'
  packName?: string; // e.g. 'Pack', 'Box', 'Carton'
  packNameAr?: string; // e.g. 'باكو', 'كرتون', 'دستة'
  unitsPerPack?: number; // e.g. 8 strips per pack
  defaultSaleUnit?: ProductSaleUnitMode; // 'unit' or 'pack'
  allowedSaleUnits?: AllowedSaleUnitsMode; // 'both', 'unit_only', 'pack_only'
  packCostPrice?: number;
  packSellingPrice?: number;
  image?: string;
  imageUrl?: string | null;
  emoji?: string;
  colorHex?: string;
  customFields?: ProductCustomFields;
  createdAt?: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  itemDiscountPercent: number; // 0 to 100
  selectedSaleUnit?: ProductSaleUnitMode; // 'unit' (شريط/قطعة) or 'pack' (باكو)
}

export const PAYMENT_METHODS = {
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
  QR_NFC: 'qr_nfc',
  CARD: 'card',
} as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

export const PAYMENT_SETTLEMENT_STATUSES = {
  PAID: 'paid',
  PARTIAL: 'partial',
  UNPAID: 'unpaid',
} as const;
export type PaymentSettlementStatus =
  (typeof PAYMENT_SETTLEMENT_STATUSES)[keyof typeof PAYMENT_SETTLEMENT_STATUSES];

export const INVOICE_FULFILLMENT_TYPES = {
  GOODS_AND_INVOICE: 'goods_and_invoice',
  INVOICE_ONLY: 'invoice_only',
  GOODS_ONLY: 'goods_only',
} as const;
export type InvoiceFulfillmentType =
  (typeof INVOICE_FULFILLMENT_TYPES)[keyof typeof INVOICE_FULFILLMENT_TYPES];

export const INVOICE_FULFILLMENT_STATUSES = {
  RECEIVED: 'received',
  PENDING_GOODS: 'pending_goods',
  PENDING_INVOICE: 'pending_invoice',
} as const;
export type InvoiceFulfillmentStatus =
  (typeof INVOICE_FULFILLMENT_STATUSES)[keyof typeof INVOICE_FULFILLMENT_STATUSES];

export interface DebtSettlementPayment {
  id: string;
  timestamp: string;
  amountPaid: number;
  remainingDebtAfter: number;
  paymentMethod: PaymentMethod;
  transferReference?: string;
  receiptImages?: string[];
  note?: string;
}

export interface DebtSettlementInput {
  amountPaidInDisplayCurrency?: number;
  customTotalPaidInDisplayCurrency?: number;
  displayCurrency?: SupportedCurrency;
  paymentMethod?: PaymentMethod;
  transferReference?: string;
  receiptImages?: string[];
  note?: string;
  useIndexedNewRate?: boolean;
  anchorCurrency?: string;
  customSaleExchangeRate?: number;
}

export interface CheckoutPaymentDetails {
  transferReference?: string;
  transferReceiptImage?: string;
  transferReceiptImages?: string[];
  paymentStatus?: PaymentSettlementStatus;
  amountPaid?: number;
  debtAmount?: number;
  fulfillmentType?: InvoiceFulfillmentType;
  fulfillmentStatus?: InvoiceFulfillmentStatus;
  exchangeRateUsed?: number;
  exchangeRatesSnapshot?: Record<string, number>;
}

export const SALES_RATE_VALUATION_MODES = {
  LIVE: 'live',
  INDEXED: 'indexed',
  HISTORICAL: 'historical',
} as const;
export type SalesRateValuationMode =
  (typeof SALES_RATE_VALUATION_MODES)[keyof typeof SALES_RATE_VALUATION_MODES];

export interface TransactionLineItem {
  id?: string;
  lineId?: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  total: number;
  saleUnit?: ProductSaleUnitMode;
  saleUnitLabel?: string;
  unitsPerPack?: number;
  stockDeducted?: number;
  unitCostAtSale?: number;
  unitCost?: number;
  costCurrency?: SupportedCurrency;
}

export interface TransactionInlineReturnLineItem {
  productId: string;
  quantity: number;
  refundAmount: number;
  saleUnit?: ProductSaleUnitMode;
}

export interface TransactionInlineReturn {
  id: string;
  saleId?: string;
  timestamp?: string;
  reason?: string;
  refundTotal: number;
  items?: TransactionInlineReturnLineItem[];
}

export const TRANSACTION_STATUSES = {
  COMPLETED: 'completed',
  VOIDED: 'voided',
} as const;
export type TransactionStatus =
  (typeof TRANSACTION_STATUSES)[keyof typeof TRANSACTION_STATUSES];

export const TRANSACTION_SYNC_STATUSES = {
  SYNCED: 'synced',
  PENDING_SYNC: 'pending_sync',
  FAILED: 'failed',
} as const;
export type TransactionSyncStatus =
  (typeof TRANSACTION_SYNC_STATUSES)[keyof typeof TRANSACTION_SYNC_STATUSES];

export interface Transaction {
  id: string; // e.g., TXN-20261029-4821
  idempotencyKey: string;
  branchId?: string;
  timestamp: string;
  currency?: SupportedCurrency;
  exchangeRateUsed?: number;
  exchangeRatesSnapshot?: Record<string, number>;
  isTaxInclusive?: boolean;
  items: TransactionLineItem[];
  returns?: TransactionInlineReturn[];
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
  transferReceiptImages?: string[];
  debtPayments?: DebtSettlementPayment[];
  fulfillmentType?: InvoiceFulfillmentType;
  fulfillmentStatus?: InvoiceFulfillmentStatus;
  fulfilledAt?: string;
  customerId?: string;
  customerName?: string;
  cashierName: string;
  status: TransactionStatus;
  syncStatus: TransactionSyncStatus;
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
  referenceId?: string; // e.g. transaction ID or purchase invoice ID
  receiptMode?: 'goods_and_invoice' | 'goods_only' | 'invoice_only';
  supplierName?: string;
  invoiceNumber?: string;
  unitCost?: number;
  currency?: SupportedCurrency;
}

export interface GoodsReceiptInput {
  productId: string;
  quantity: number;
  receiptMode: 'goods_and_invoice' | 'goods_only' | 'invoice_only';
  supplierName?: string;
  invoiceNumber?: string;
  unitCost?: number;
  currency?: SupportedCurrency;
  updateProductCost?: boolean;
  notes?: string;
}

export type SupportedCurrency = 'SDG' | 'USD' | 'SAR' | 'AED' | 'EUR' | 'GBP' | (string & {});

export const APP_THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
} as const;
export type AppTheme = (typeof APP_THEMES)[keyof typeof APP_THEMES];

export const APP_LANGUAGES = {
  EN: 'en',
  AR: 'ar',
} as const;
export type AppLanguage = (typeof APP_LANGUAGES)[keyof typeof APP_LANGUAGES];

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

export interface ExchangeRateHistoryEntry {
  id: string;
  currency: string;
  previousRate: number;
  newRate: number;
  changePercent: number;
  timestamp: string;
  note?: string;
}

export const SDG_PRICE_ADJUSTMENT_POLICIES = {
  INCREASE_ONLY: 'increase_only',
  PROPORTIONAL: 'proportional',
} as const;
export type SdgPriceAdjustmentPolicy =
  (typeof SDG_PRICE_ADJUSTMENT_POLICIES)[keyof typeof SDG_PRICE_ADJUSTMENT_POLICIES];

export interface AppSettings {
  storeName: string;
  storeNameAr: string;
  storeLogo?: string;
  address: string;
  addressAr: string;
  storeAddress?: string;
  taxNumber: string;
  phone: string;
  storePhone?: string;
  receiptFooter: string;
  receiptFooterAr: string;
  currency: SupportedCurrency;
  exchangeRates?: Record<string, number>;
  autoAdjustSdgPricesOnRateIncrease?: boolean;
  sdgPriceAdjustmentPolicy?: SdgPriceAdjustmentPolicy;
  taxRatePercent: number;
  isTaxInclusive: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme: AppTheme;
  language: AppLanguage;
}

export const EXPENSE_CATEGORIES = {
  RENT: 'rent',
  UTILITIES: 'utilities',
  SALARIES: 'salaries',
  TRANSPORT: 'transport',
  MAINTENANCE: 'maintenance',
  SUPPLIES: 'supplies',
  TAXES_FEES: 'taxes_fees',
  MARKETING: 'marketing',
  OTHER: 'other',
} as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[keyof typeof EXPENSE_CATEGORIES];

export interface ExpenseRecord {
  id: string; // e.g., EXP-20261108-4821
  companyId?: string;
  branchId?: string;
  timestamp: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  currency: SupportedCurrency;
  exchangeRateUsed?: number;
  exchangeRatesSnapshot?: Record<string, number>;
  paymentMethod: PaymentMethod;
  transferReference?: string;
  receiptImage?: string;
  beneficiary?: string;
  notes?: string;
  recordedBy: string;
  status: 'recorded' | 'voided';
  syncStatus?: 'synced' | 'pending_sync' | 'failed';
}

export interface ExpenseInput {
  title: string;
  category: ExpenseCategory;
  amount: number;
  currency?: SupportedCurrency;
  paymentMethod?: PaymentMethod;
  transferReference?: string;
  receiptImage?: string;
  beneficiary?: string;
  notes?: string;
  timestamp?: string;
  exchangeRateUsed?: number;
}

export const APP_NAV_TABS = {
  DASHBOARD: 'dashboard',
  CHECKOUT: 'checkout',
  PRODUCTS: 'products',
  INVENTORY: 'inventory',
  CUSTOMERS: 'customers',
  SALES: 'sales',
  EXPENSES: 'expenses',
  REPORTS: 'reports',
  SETTINGS: 'settings',
} as const;
export type AppNavTab = (typeof APP_NAV_TABS)[keyof typeof APP_NAV_TABS];

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

