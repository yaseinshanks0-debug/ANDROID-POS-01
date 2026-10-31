/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getBaseCurrency,
  getAllCurrencies,
  getExchangeRate,
  setExchangeRate,
  convertAmount,
} from './currencies-repo.ts';
import {
  getAllUOMs,
  getUOM,
  createUOM,
  setProductUnitConversion,
  getProductUnitConversions,
  convertProductQuantity,
} from './uom-repo.ts';
import {
  getAllFieldDefinitions,
  getFieldDefinition,
  createFieldDefinition,
  validateFieldValue,
  setProductCustomFieldValue,
  getProductCustomFields,
} from './custom-fields-repo.ts';
import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  addProductBarcode,
  getProductBarcodes,
  getProductByAnyBarcode,
} from './products-repo.ts';
import { db } from './index.ts';
import { storeSettings, products } from './schema.ts';
import { eq } from 'drizzle-orm';

// ---------------------------------------------------------
// 1. Currency & Exchange Rates Tests
// ---------------------------------------------------------
test('Currency Schema: SDG is configured as default base currency', async () => {
  const baseCurrency = await getBaseCurrency();
  assert.equal(baseCurrency.code, 'SDG');
  assert.equal(baseCurrency.isBase, true);
  assert.equal(baseCurrency.symbol, 'ج.س');

  const allCurrencies = await getAllCurrencies();
  assert.ok(allCurrencies.length >= 2, 'Must have base currency SDG and active foreign currencies');

  const codes = allCurrencies.map((c) => c.code);
  assert.ok(codes.includes('SDG'), 'SDG must be present');
  assert.ok(codes.includes('USD'), 'USD must be present');

  if (db) {
    const settings = await db.select().from(storeSettings).where(eq(storeSettings.id, 'default'));
    if (settings.length > 0) {
      assert.equal(settings[0].currency, 'SDG', 'Store settings currency must default to SDG');
    }
  }
});

test('Exchange Rate Validation: Rejects zero or negative exchange rates', async () => {
  await assert.rejects(
    async () => {
      await setExchangeRate({
        sourceCurrency: 'USD',
        targetCurrency: 'SDG',
        rate: -150.0,
      });
    },
    (err: Error) => err.message.includes('positive number greater than 0'),
    'Must reject negative exchange rate'
  );

  await assert.rejects(
    async () => {
      await setExchangeRate({
        sourceCurrency: 'USD',
        targetCurrency: 'SDG',
        rate: 0,
      });
    },
    (err: Error) => err.message.includes('positive number greater than 0'),
    'Must reject zero exchange rate'
  );
});

test('Exchange Rate Logic: Direct, reciprocal, and historical rate queries', async () => {
  // Query direct rate USD -> SDG
  const direct = await getExchangeRate('USD', 'SDG');
  assert.ok(direct.rate > 0, 'USD to SDG rate must be positive');
  assert.equal(direct.isInverse, false);

  // Query reciprocal rate SDG -> USD
  const inverse = await getExchangeRate('SDG', 'USD');
  assert.ok(inverse.rate > 0, 'SDG to USD rate must be positive');
  assert.equal(inverse.isInverse, true);
  // Reciprocal check: direct.rate * inverse.rate should equal ~1.0
  const product = direct.rate * inverse.rate;
  assert.ok(Math.abs(product - 1.0) < 0.001, 'Reciprocal rate product must be ~1.0');

  // Convert amount calculation
  const converted = await convertAmount(10, 'USD', 'SDG');
  assert.equal(converted.convertedAmount, Math.round(10 * direct.rate * 100) / 100);

  // Historical rate validity
  const pastDate = new Date('2026-01-05T00:00:00Z');
  const pastRate = await getExchangeRate('USD', 'SDG', pastDate);
  assert.ok(pastRate.rate > 0);
});

// ---------------------------------------------------------
// 2. Units of Measure (UOM) Tests
// ---------------------------------------------------------
test('UOM Schema: Standard units exist and conversion factor logic operates accurately', async () => {
  const allUoms = await getAllUOMs();
  assert.ok(allUoms.length >= 4, 'Must have at least PCS, BOX, KG, LTR');

  const pcs = await getUOM('PCS');
  assert.ok(pcs, 'PCS UOM must exist');
  assert.equal(pcs?.isBaseUnit, true);

  const box = await getUOM('BOX');
  assert.ok(box, 'BOX UOM must exist');

  // Create a test product
  const ts = Date.now();
  const testProd = await createProduct({
    name: `UOM Test Juice ${ts}`,
    sku: `SKU-UOM-${ts}`,
    barcode: `111${ts.toString().slice(-9)}`,
    category: 'Beverages',
    costPrice: 500,
    sellingPrice: 1200,
    stock: 120,
    minStockAlert: 10,
  });

  // Assign Box conversion: 1 Box = 24 Pieces
  const conv = await setProductUnitConversion({
    productId: testProd.id,
    uomId: 'uom-box',
    conversionFactor: 24,
    isDefaultSelling: false,
    sellingPrice: 26000,
  });

  assert.equal(conv.conversionFactor, 24);

  // Convert 2 Boxes to Pieces: 2 * 24 = 48 Pieces
  const toPieces = await convertProductQuantity(testProd.id, 2, 'uom-box', 'uom-pcs');
  assert.equal(toPieces.convertedQuantity, 48);

  // Convert 72 Pieces to Boxes: 72 / 24 = 3 Boxes
  const toBoxes = await convertProductQuantity(testProd.id, 72, 'uom-pcs', 'uom-box');
  assert.equal(toBoxes.convertedQuantity, 3);

  // Fractional conversion: 12 Pieces to Boxes -> 0.5 Box
  const fractional = await convertProductQuantity(testProd.id, 12, 'uom-pcs', 'uom-box');
  assert.equal(fractional.convertedQuantity, 0.5);

  // Clean up test product
  await deleteProduct(testProd.id);
});

test('UOM Validation: Rejects non-positive conversion factors', async () => {
  const ts = Date.now();
  const testProd = await createProduct({
    name: `Invalid Conv Prod ${ts}`,
    sku: `SKU-INV-${ts}`,
    barcode: `112${ts.toString().slice(-9)}`,
    category: 'Retail',
    costPrice: 10,
    sellingPrice: 20,
    stock: 5,
    minStockAlert: 1,
  });

  await assert.rejects(
    async () => {
      await setProductUnitConversion({
        productId: testProd.id,
        uomId: 'uom-box',
        conversionFactor: -12,
      });
    },
    (err: Error) => err.message.includes('strictly positive number'),
    'Should reject negative conversion factor'
  );

  await deleteProduct(testProd.id);
});

// ---------------------------------------------------------
// 3. Multi-Barcodes per Product Tests
// ---------------------------------------------------------
test('Multi-Barcodes: Assign multiple barcodes to a product and enforce uniqueness', async () => {
  const ts = Date.now();
  const primaryBarcode = `221${ts.toString().slice(-9)}`;
  const secondaryBarcode = `222${ts.toString().slice(-9)}`;
  const cartonBarcode = `223${ts.toString().slice(-9)}`;

  const prod = await createProduct({
    name: `Multi Barcode Biscuit ${ts}`,
    sku: `SKU-MB-${ts}`,
    barcode: primaryBarcode,
    category: 'Bakery',
    costPrice: 150,
    sellingPrice: 300,
    stock: 50,
    minStockAlert: 5,
  });

  // Primary barcode should be automatically in product_barcodes
  const initialBarcodes = await getProductBarcodes(prod.id);
  assert.ok(initialBarcodes.some((b) => b.barcode === primaryBarcode && b.isPrimary));

  // Add secondary retail pack barcode
  const sec = await addProductBarcode({
    productId: prod.id,
    barcode: secondaryBarcode,
    barcodeType: 'EAN13',
    isPrimary: false,
    notes: 'Retail 6-pack barcode',
  });
  assert.equal(sec.barcode, secondaryBarcode);

  // Add carton barcode
  await addProductBarcode({
    productId: prod.id,
    barcode: cartonBarcode,
    barcodeType: 'CODE128',
    isPrimary: false,
    notes: 'Outer Master Carton',
  });

  // Verify all barcodes associated with product
  const allBarcodes = await getProductBarcodes(prod.id);
  assert.equal(allBarcodes.length, 3);

  // Lookup product by secondary barcode
  const foundBySec = await getProductByAnyBarcode(secondaryBarcode);
  assert.ok(foundBySec, 'Product must be retrievable by secondary barcode');
  assert.equal(foundBySec?.id, prod.id);

  // Lookup product by carton barcode
  const foundByCtn = await getProductByAnyBarcode(cartonBarcode);
  assert.ok(foundByCtn, 'Product must be retrievable by carton barcode');
  assert.equal(foundByCtn?.id, prod.id);

  // Enforce uniqueness across different products:
  // Attempt to assign secondaryBarcode to another product
  const otherProd = await createProduct({
    name: `Other Prod ${ts}`,
    sku: `SKU-OTHER-${ts}`,
    barcode: `224${ts.toString().slice(-9)}`,
    category: 'Retail',
    costPrice: 10,
    sellingPrice: 20,
    stock: 5,
    minStockAlert: 1,
  });

  await assert.rejects(
    async () => {
      await addProductBarcode({
        productId: otherProd.id,
        barcode: secondaryBarcode, // Duplicate!
      });
    },
    (err: Error) => err.message.includes('Duplicate barcode'),
    'Should reject duplicate barcode across products'
  );

  // Clean up
  await deleteProduct(prod.id);
  await deleteProduct(otherProd.id);
});

// ---------------------------------------------------------
// 4. Dynamic Custom Product Fields Tests
// ---------------------------------------------------------
test('Custom Fields: Field definition, type validation, and product value persistence', async () => {
  const ts = Date.now();
  const fieldName = `warranty_test_${ts}`;

  // 1. Create a dynamic custom field definition
  const def = await createFieldDefinition({
    name: fieldName,
    label: 'Test Warranty Months',
    dataType: 'number',
    description: 'Warranty duration in months',
    isRequired: true,
    validationRules: { min: 0, max: 60 },
  });

  assert.equal(def.name, fieldName);
  assert.equal(def.dataType, 'number');

  // 2. Validate value constraints
  // Exceeds max 60
  const invalidMax = validateFieldValue(def, 72);
  assert.equal(invalidMax.isValid, false);
  assert.ok(invalidMax.error?.includes('cannot exceed 60'));

  // Negative number
  const invalidMin = validateFieldValue(def, -5);
  assert.equal(invalidMin.isValid, false);
  assert.ok(invalidMin.error?.includes('cannot be less than 0'));

  // Non-number
  const invalidType = validateFieldValue(def, 'not_a_number');
  assert.equal(invalidType.isValid, false);

  // Valid number
  const valid = validateFieldValue(def, 24);
  assert.equal(valid.isValid, true);
  assert.equal(valid.parsedValue, 24);

  // 3. Dropdown field validation
  const dropdownDef = await getFieldDefinition('origin_country');
  assert.ok(dropdownDef, 'origin_country field definition should exist');
  const validDropdown = validateFieldValue(dropdownDef!, 'Sudan');
  assert.equal(validDropdown.isValid, true);

  const invalidDropdown = validateFieldValue(dropdownDef!, 'Mars');
  assert.equal(invalidDropdown.isValid, false);
  assert.ok(invalidDropdown.error?.includes('not one of the allowed options'));

  // 4. Associate field value with a product
  const prod = await createProduct({
    name: `Custom Field Item ${ts}`,
    sku: `SKU-CF-${ts}`,
    barcode: `331${ts.toString().slice(-9)}`,
    category: 'Electronics',
    costPrice: 5000,
    sellingPrice: 8500,
    stock: 10,
    minStockAlert: 2,
  });

  await setProductCustomFieldValue(prod.id, fieldName, 24);
  await setProductCustomFieldValue(prod.id, 'origin_country', 'Sudan');

  // Retrieve custom field values for product
  const values = await getProductCustomFields(prod.id);
  assert.ok(values.some((v) => v.fieldName === fieldName && v.value === 24));
  assert.ok(values.some((v) => v.fieldName === 'origin_country' && v.value === 'Sudan'));

  // Verify denormalized JSONB on product record is synchronized
  const refreshedProd = await getProductById(prod.id);
  assert.equal(refreshedProd?.customFields?.[fieldName], 24);
  assert.equal(refreshedProd?.customFields?.['origin_country'], 'Sudan');

  // Clean up
  await deleteProduct(prod.id);
});

// ---------------------------------------------------------
// 5. Relational Cascade & Existing Data Preservation Tests
// ---------------------------------------------------------
test('Data Integrity: Cascade deletion cleans up child tables without orphan records', async () => {
  const ts = Date.now();
  const prod = await createProduct({
    name: `Cascade Test Item ${ts}`,
    sku: `SKU-CASCADE-${ts}`,
    barcode: `441${ts.toString().slice(-9)}`,
    category: 'Retail',
    costPrice: 10,
    sellingPrice: 20,
    stock: 5,
    minStockAlert: 1,
  });

  // Add child records: barcode, conversion, custom field
  await addProductBarcode({
    productId: prod.id,
    barcode: `442${ts.toString().slice(-9)}`,
  });

  await setProductUnitConversion({
    productId: prod.id,
    uomId: 'uom-box',
    conversionFactor: 12,
  });

  await setProductCustomFieldValue(prod.id, 'origin_country', 'Sudan');

  // Delete product
  await deleteProduct(prod.id);

  // Verify child barcodes were cascaded
  const barcodes = await getProductBarcodes(prod.id);
  assert.equal(barcodes.length, 0, 'Barcodes should be deleted on cascade');

  // Verify child conversions were cascaded
  const convs = await getProductUnitConversions(prod.id);
  assert.equal(convs.length, 0, 'Conversions should be deleted on cascade');

  // Verify child custom field values were cascaded
  const fields = await getProductCustomFields(prod.id);
  assert.equal(fields.length, 0, 'Field values should be deleted on cascade');
});

test('Backward Compatibility: All existing products remain intact and searchable', async () => {
  const allProducts = await getAllProducts();
  assert.ok(allProducts.length >= 41, `Expected at least 41 products, found ${allProducts.length}`);

  // Check initial known products
  const espresso = allProducts.find((p) => p.sku === 'BEV-001');
  assert.ok(espresso, 'Espresso Double Shot must be present');
  assert.equal(espresso?.barcode, '200101001011');
  assert.equal(espresso?.category, 'Coffee & Drinks');

  const flatWhite = allProducts.find((p) => p.sku === 'BEV-002');
  assert.ok(flatWhite, 'Oat Milk Flat White must be present');
  assert.equal(flatWhite?.barcode, '200101001028');

  // Search by primary barcode
  const byBarcode = await getProductByAnyBarcode('200101001011');
  assert.ok(byBarcode, 'Should find Espresso by barcode');
  assert.equal(byBarcode?.sku, 'BEV-001');
});
