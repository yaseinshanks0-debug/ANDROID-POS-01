/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { sql, relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  integer,
  numeric,
  boolean,
  jsonb,
  serial,
  index,
  uniqueIndex,
  check,
  unique,
} from 'drizzle-orm/pg-core';

// 1. Branches & Stores
export const branches = pgTable('branches', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameAr: text('name_ar'),
  code: text('code').notNull().unique(),
  address: text('address'),
  phone: text('phone'),
  isMain: boolean('is_main').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Roles & Permissions (RBAC)
export const roles = pgTable('roles', {
  id: text('id').primaryKey(), // 'admin', 'manager', 'cashier'
  name: text('name').notNull(),
  nameAr: text('name_ar'),
  permissions: jsonb('permissions').$type<string[]>().default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. System Users & Cashiers
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  email: text('email'),
  roleId: text('role_id').references(() => roles.id).notNull(),
  branchId: text('branch_id').references(() => branches.id),
  pinCode: text('pin_code'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Categories
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameAr: text('name_ar'),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Products & Barcodes
export const products = pgTable(
  'products',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    nameAr: text('name_ar'),
    sku: text('sku').notNull().unique(),
    barcode: text('barcode').notNull().unique(),
    categoryId: text('category_id').references(() => categories.id),
    categoryName: text('category_name').default('General').notNull(),
    categoryNameAr: text('category_name_ar'),
    costPrice: numeric('cost_price', { precision: 12, scale: 2 }).notNull().default('0.00'),
    sellingPrice: numeric('selling_price', { precision: 12, scale: 2 }).notNull().default('0.00'),
    stock: integer('stock').notNull().default(0),
    minStockAlert: integer('min_stock_alert').notNull().default(5),
    emoji: text('emoji').default('📦'),
    colorHex: text('color_hex').default('#d97706'),
    baseUomId: text('base_uom_id'),
    defaultSellingUomId: text('default_selling_uom_id'),
    imageUrl: text('image_url'),
    customFields: jsonb('custom_fields').$type<Record<string, any>>().default({}),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('product_category_idx').on(table.categoryId),
    uniqueIndex('product_sku_idx').on(table.sku),
    uniqueIndex('product_barcode_idx').on(table.barcode),
  ]
);

// 6. Suppliers & Vendors
export const suppliers = pgTable('suppliers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  contactName: text('contact_name'),
  phone: text('phone').notNull(),
  email: text('email'),
  address: text('address'),
  taxNumber: text('tax_number'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 7. Purchase Orders & Inbound Stock
export const purchases = pgTable('purchases', {
  id: text('id').primaryKey(),
  purchaseNumber: text('purchase_number').notNull().unique(),
  supplierId: text('supplier_id').references(() => suppliers.id),
  branchId: text('branch_id').references(() => branches.id),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  status: text('status').notNull().default('received'), // 'ordered', 'received', 'cancelled'
  notes: text('notes'),
  invoiceDate: timestamp('invoice_date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const purchaseItems = pgTable('purchase_items', {
  id: text('id').primaryKey(),
  purchaseId: text('purchase_id').references(() => purchases.id, { onDelete: 'cascade' }).notNull(),
  productId: text('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  unitCost: numeric('unit_cost', { precision: 12, scale: 2 }).notNull(),
  totalCost: numeric('total_cost', { precision: 12, scale: 2 }).notNull(),
});

// 8. Inventory Levels (Multi-Branch) & Stock Movements
export const stockMovements = pgTable(
  'stock_movements',
  {
    id: text('id').primaryKey(),
    productId: text('product_id').references(() => products.id).notNull(),
    productName: text('product_name').notNull(),
    branchId: text('branch_id').references(() => branches.id),
    type: text('type').notNull(), // 'sale', 'restock', 'damage', 'loss', 'audit', 'transfer'
    quantityChange: integer('quantity_change').notNull(),
    previousStock: integer('previous_stock').notNull(),
    newStock: integer('new_stock').notNull(),
    reason: text('reason').notNull(),
    referenceId: text('reference_id'),
    userId: text('user_id').references(() => users.id),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
  },
  (table) => [
    index('movement_product_idx').on(table.productId),
    index('movement_timestamp_idx').on(table.timestamp),
  ]
);

// 9. Customers & Loyalty
export const customers = pgTable(
  'customers',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    email: text('email'),
    notes: text('notes'),
    totalSpent: numeric('total_spent', { precision: 12, scale: 2 }).default('0.00').notNull(),
    transactionCount: integer('transaction_count').default(0).notNull(),
    loyaltyPoints: integer('loyalty_points').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('customer_phone_idx').on(table.phone),
  ]
);

// 10. Sales / Invoices
export const sales = pgTable(
  'sales',
  {
    id: text('id').primaryKey(), // Internal UUID
    transactionId: text('transaction_id').notNull().unique(), // e.g. TXN-20261029-4821
    idempotencyKey: text('idempotency_key').notNull().unique(),
    branchId: text('branch_id').references(() => branches.id),
    customerId: text('customer_id').references(() => customers.id),
    customerName: text('customer_name').default('Walk-in Customer'),
    cashierName: text('cashier_name').default('Main Terminal').notNull(),
    subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
    taxRatePercent: numeric('tax_rate_percent', { precision: 5, scale: 2 }).notNull(),
    taxAmount: numeric('tax_amount', { precision: 12, scale: 2 }).notNull(),
    discountAmount: numeric('discount_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    grandTotal: numeric('grand_total', { precision: 12, scale: 2 }).notNull(),
    paymentMethod: text('payment_method').notNull(), // 'cash', 'card', 'qr_nfc'
    amountTendered: numeric('amount_tendered', { precision: 12, scale: 2 }).notNull(),
    changeDue: numeric('change_due', { precision: 12, scale: 2 }).default('0.00').notNull(),
    status: text('status').notNull().default('completed'), // 'completed', 'voided'
    syncStatus: text('sync_status').notNull().default('synced'),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('sale_tx_idx').on(table.transactionId),
    index('sale_timestamp_idx').on(table.timestamp),
    index('sale_customer_idx').on(table.customerId),
  ]
);

export const saleItems = pgTable('sale_items', {
  id: text('id').primaryKey(),
  saleId: text('sale_id').references(() => sales.id, { onDelete: 'cascade' }).notNull(),
  productId: text('product_id').references(() => products.id).notNull(),
  productName: text('product_name').notNull(),
  sku: text('sku').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
  discountPercent: numeric('discount_percent', { precision: 5, scale: 2 }).default('0.00').notNull(),
  total: numeric('total', { precision: 12, scale: 2 }).notNull(),
});

// 11. Payments
export const payments = pgTable('payments', {
  id: text('id').primaryKey(),
  saleId: text('sale_id').references(() => sales.id, { onDelete: 'cascade' }).notNull(),
  method: text('method').notNull(), // 'cash', 'card', 'qr_nfc'
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  amountTendered: numeric('amount_tendered', { precision: 12, scale: 2 }).notNull(),
  changeDue: numeric('change_due', { precision: 12, scale: 2 }).default('0.00').notNull(),
  reference: text('reference'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 12. Returns & Voids
export const returns = pgTable('returns', {
  id: text('id').primaryKey(),
  saleId: text('sale_id').references(() => sales.id).notNull(),
  reason: text('reason').notNull(),
  refundTotal: numeric('refund_total', { precision: 12, scale: 2 }).notNull(),
  userId: text('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const returnItems = pgTable('return_items', {
  id: text('id').primaryKey(),
  returnId: text('return_id').references(() => returns.id, { onDelete: 'cascade' }).notNull(),
  productId: text('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  refundAmount: numeric('refund_amount', { precision: 12, scale: 2 }).notNull(),
});

// 13. Inter-Branch Transfers
export const branchTransfers = pgTable('branch_transfers', {
  id: text('id').primaryKey(),
  transferNumber: text('transfer_number').notNull().unique(),
  fromBranchId: text('from_branch_id').references(() => branches.id).notNull(),
  toBranchId: text('to_branch_id').references(() => branches.id).notNull(),
  status: text('status').notNull().default('pending'), // 'pending', 'in_transit', 'completed', 'cancelled'
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const branchTransferItems = pgTable('branch_transfer_items', {
  id: text('id').primaryKey(),
  transferId: text('transfer_id').references(() => branchTransfers.id, { onDelete: 'cascade' }).notNull(),
  productId: text('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
});

// 14. Store Configuration & Tax Policies
export const storeSettings = pgTable('store_settings', {
  id: text('id').primaryKey(), // usually 'default'
  storeName: text('store_name').notNull(),
  storeNameAr: text('store_name_ar'),
  address: text('address'),
  addressAr: text('address_ar'),
  taxNumber: text('tax_number'),
  phone: text('phone'),
  receiptFooter: text('receipt_footer'),
  receiptFooterAr: text('receipt_footer_ar'),
  currency: text('currency').default('SDG').notNull(),
  taxRatePercent: numeric('tax_rate_percent', { precision: 5, scale: 2 }).default('8.50').notNull(),
  isTaxInclusive: boolean('is_tax_inclusive').default(false).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 15. Audit Logs
export const auditLogs = pgTable(
  'audit_logs',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id),
    action: text('action').notNull(), // 'PRODUCT_CREATED', 'SALE_COMPLETED', 'STOCK_ADJUSTED', etc.
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id'),
    details: jsonb('details'),
    ipAddress: text('ip_address'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('audit_created_idx').on(table.createdAt),
    index('audit_action_idx').on(table.action),
  ]
);

// 16. Currencies (Base SDG + Foreign Currencies)
export const currencies = pgTable('currencies', {
  code: text('code').primaryKey(), // ISO 4217, e.g. 'SDG', 'USD', 'SAR', 'AED', 'EUR', 'GBP'
  name: text('name').notNull(),
  nameAr: text('name_ar'),
  symbol: text('symbol').notNull(),
  decimalPlaces: integer('decimal_places').default(2).notNull(),
  isBase: boolean('is_base').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 17. Multi-Currency Exchange Rates
export const exchangeRates = pgTable(
  'exchange_rates',
  {
    id: text('id').primaryKey(),
    sourceCurrency: text('source_currency')
      .references(() => currencies.code)
      .notNull(),
    targetCurrency: text('target_currency')
      .references(() => currencies.code)
      .notNull(),
    rate: numeric('rate', { precision: 16, scale: 6 }).notNull(),
    effectiveFrom: timestamp('effective_from').defaultNow().notNull(),
    expiryDate: timestamp('expiry_date'),
    isActive: boolean('is_active').default(true).notNull(),
    createdBy: text('created_by'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('exchange_rate_pair_idx').on(table.sourceCurrency, table.targetCurrency, table.effectiveFrom),
    check('exchange_rate_positive', sql`${table.rate} > 0`),
  ]
);

// 18. Units of Measure (UOM)
export const unitsOfMeasure = pgTable('units_of_measure', {
  id: text('id').primaryKey(), // e.g. 'uom-pcs', 'uom-box', 'uom-kg'
  code: text('code').notNull().unique(), // 'PCS', 'BOX', 'CTN', 'KG', 'G', 'LTR', 'ML'
  name: text('name').notNull(),
  nameAr: text('name_ar'),
  dimension: text('dimension').default('count').notNull(), // 'count', 'weight', 'volume', 'length'
  isBaseUnit: boolean('is_base_unit').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 19. Product Unit Conversions & Packaging Factors
export const productUnitConversions = pgTable(
  'product_unit_conversions',
  {
    id: text('id').primaryKey(),
    productId: text('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    uomId: text('uom_id')
      .references(() => unitsOfMeasure.id, { onDelete: 'restrict' })
      .notNull(),
    conversionFactor: numeric('conversion_factor', { precision: 12, scale: 4 }).notNull(), // e.g. 1 Box = 12 Pieces
    isDefaultSelling: boolean('is_default_selling').default(false).notNull(),
    isDefaultPurchasing: boolean('is_default_purchasing').default(false).notNull(),
    sellingPrice: numeric('selling_price', { precision: 12, scale: 2 }), // Optional override price for this UOM
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('product_uom_unique_idx').on(table.productId, table.uomId),
    check('conversion_factor_positive', sql`${table.conversionFactor} > 0`),
  ]
);

// 20. Multi-Barcodes per Product
export const productBarcodes = pgTable(
  'product_barcodes',
  {
    id: text('id').primaryKey(),
    productId: text('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    barcode: text('barcode').notNull().unique(),
    barcodeType: text('barcode_type').default('CODE128').notNull(), // 'EAN13', 'UPC', 'CODE128', 'QR', 'CUSTOM'
    uomId: text('uom_id').references(() => unitsOfMeasure.id, { onDelete: 'set null' }),
    isPrimary: boolean('is_primary').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('product_barcodes_prod_idx').on(table.productId),
    uniqueIndex('product_barcodes_code_idx').on(table.barcode),
  ]
);

// 21. Dynamic Custom Field Definitions
export const customFieldDefinitions = pgTable('custom_field_definitions', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(), // e.g. 'expiry_date', 'batch_number', 'manufacturer', 'warranty_months'
  label: text('label').notNull(),
  labelAr: text('label_ar'),
  dataType: text('data_type').notNull(), // 'text', 'number', 'date', 'boolean', 'dropdown'
  description: text('description'),
  isRequired: boolean('is_required').default(false).notNull(),
  defaultValue: text('default_value'),
  options: jsonb('options').$type<string[]>(),
  validationRules: jsonb('validation_rules').$type<Record<string, any>>(),
  isSearchable: boolean('is_searchable').default(false).notNull(),
  showOnReceipt: boolean('show_on_receipt').default(false).notNull(),
  showInList: boolean('show_in_list').default(true).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 22. Normalized Product Custom Field Values
export const productCustomFieldValues = pgTable(
  'product_custom_field_values',
  {
    id: text('id').primaryKey(),
    productId: text('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    fieldId: text('field_id')
      .references(() => customFieldDefinitions.id, { onDelete: 'cascade' })
      .notNull(),
    valueText: text('value_text'),
    valueNumber: numeric('value_number', { precision: 14, scale: 4 }),
    valueBoolean: boolean('value_boolean'),
    valueDate: timestamp('value_date'),
    valueJson: jsonb('value_json'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('product_field_val_unique_idx').on(table.productId, table.fieldId),
    index('product_field_val_field_idx').on(table.fieldId),
    index('product_field_val_prod_idx').on(table.productId),
  ]
);

// Relations
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  stockMovements: many(stockMovements),
  saleItems: many(saleItems),
  barcodes: many(productBarcodes),
  unitConversions: many(productUnitConversions),
  customFieldValues: many(productCustomFieldValues),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const currenciesRelations = relations(currencies, ({ many }) => ({
  exchangeRatesFrom: many(exchangeRates, { relationName: 'ratesFrom' }),
  exchangeRatesTo: many(exchangeRates, { relationName: 'ratesTo' }),
}));

export const exchangeRatesRelations = relations(exchangeRates, ({ one }) => ({
  source: one(currencies, {
    fields: [exchangeRates.sourceCurrency],
    references: [currencies.code],
    relationName: 'ratesFrom',
  }),
  target: one(currencies, {
    fields: [exchangeRates.targetCurrency],
    references: [currencies.code],
    relationName: 'ratesTo',
  }),
}));

export const unitsOfMeasureRelations = relations(unitsOfMeasure, ({ many }) => ({
  productConversions: many(productUnitConversions),
  productBarcodes: many(productBarcodes),
}));

export const productUnitConversionsRelations = relations(productUnitConversions, ({ one }) => ({
  product: one(products, {
    fields: [productUnitConversions.productId],
    references: [products.id],
  }),
  uom: one(unitsOfMeasure, {
    fields: [productUnitConversions.uomId],
    references: [unitsOfMeasure.id],
  }),
}));

export const productBarcodesRelations = relations(productBarcodes, ({ one }) => ({
  product: one(products, {
    fields: [productBarcodes.productId],
    references: [products.id],
  }),
  uom: one(unitsOfMeasure, {
    fields: [productBarcodes.uomId],
    references: [unitsOfMeasure.id],
  }),
}));

export const customFieldDefinitionsRelations = relations(customFieldDefinitions, ({ many }) => ({
  values: many(productCustomFieldValues),
}));

export const productCustomFieldValuesRelations = relations(productCustomFieldValues, ({ one }) => ({
  product: one(products, {
    fields: [productCustomFieldValues.productId],
    references: [products.id],
  }),
  definition: one(customFieldDefinitions, {
    fields: [productCustomFieldValues.fieldId],
    references: [customFieldDefinitions.id],
  }),
}));

export const salesRelations = relations(sales, ({ one, many }) => ({
  customer: one(customers, {
    fields: [sales.customerId],
    references: [customers.id],
  }),
  items: many(saleItems),
  payments: many(payments),
  returns: many(returns),
}));

export const saleItemsRelations = relations(saleItems, ({ one }) => ({
  sale: one(sales, {
    fields: [saleItems.saleId],
    references: [sales.id],
  }),
  product: one(products, {
    fields: [saleItems.productId],
    references: [products.id],
  }),
}));
