/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from './products-repo.ts';

test('Product CRUD: Create product successfully and retrieve it', async () => {
  const timestamp = Date.now();
  const testProduct = await createProduct({
    name: `Test Matcha Latte ${timestamp}`,
    nameAr: `ماتشا لاتيه تجريبي ${timestamp}`,
    sku: `SKU-MATCHA-${timestamp}`,
    barcode: `999${timestamp.toString().slice(-9)}`,
    category: 'Beverages',
    categoryAr: 'مشروبات',
    costPrice: 2.1,
    sellingPrice: 5.75,
    stock: 40,
    minStockAlert: 5,
    emoji: '🍵',
    colorHex: '#10b981',
  });

  assert.ok(testProduct.id, 'Created product should have an ID');
  assert.equal(testProduct.costPrice, 2.1);
  assert.equal(testProduct.sellingPrice, 5.75);
  assert.equal(testProduct.stock, 40);

  // Retrieve by ID
  const retrieved = await getProductById(testProduct.id);
  assert.ok(retrieved, 'Should retrieve product by ID');
  assert.equal(retrieved?.sku, `SKU-MATCHA-${timestamp}`);
  assert.equal(retrieved?.barcode, testProduct.barcode);
});

test('Product Validation: Prevent duplicate barcode', async () => {
  const timestamp = Date.now();
  const barcode = `888${timestamp.toString().slice(-9)}`;

  // Create first product
  await createProduct({
    name: 'Original Item A',
    sku: `SKU-ORIG-${timestamp}`,
    barcode: barcode,
    category: 'Retail',
    costPrice: 5.0,
    sellingPrice: 10.0,
    stock: 15,
    minStockAlert: 3,
  });

  // Attempt duplicate barcode
  await assert.rejects(
    async () => {
      await createProduct({
        name: 'Duplicate Item B',
        sku: `SKU-DIFF-${timestamp}`,
        barcode: barcode, // Duplicate!
        category: 'Retail',
        costPrice: 4.0,
        sellingPrice: 8.0,
        stock: 10,
        minStockAlert: 2,
      });
    },
    (err: Error) => {
      return err.message.includes('Duplicate barcode');
    },
    'Should throw duplicate barcode error'
  );
});

test('Product Validation: Prevent duplicate SKU', async () => {
  const timestamp = Date.now();
  const sku = `SKU-UNIQUE-${timestamp}`;

  // Create first product
  await createProduct({
    name: 'Unique SKU Item',
    sku: sku,
    barcode: `777${timestamp.toString().slice(-9)}`,
    category: 'Bakery',
    costPrice: 1.5,
    sellingPrice: 4.0,
    stock: 20,
    minStockAlert: 5,
  });

  // Attempt duplicate SKU
  await assert.rejects(
    async () => {
      await createProduct({
        name: 'Another Item with same SKU',
        sku: sku, // Duplicate!
        barcode: `778${timestamp.toString().slice(-9)}`,
        category: 'Bakery',
        costPrice: 2.0,
        sellingPrice: 4.5,
        stock: 10,
        minStockAlert: 2,
      });
    },
    (err: Error) => {
      return err.message.includes('Duplicate SKU');
    },
    'Should throw duplicate SKU error'
  );
});

test('Product CRUD: Update product and verify modifications', async () => {
  const timestamp = Date.now();
  const created = await createProduct({
    name: `Pre-update Name ${timestamp}`,
    sku: `SKU-UPDATE-${timestamp}`,
    barcode: `666${timestamp.toString().slice(-9)}`,
    category: 'Coffee',
    costPrice: 3.0,
    sellingPrice: 7.0,
    stock: 10,
    minStockAlert: 2,
  });

  const updated = await updateProduct(created.id, {
    name: `Post-update Name ${timestamp}`,
    sellingPrice: 8.5,
    stock: 25,
  });

  assert.equal(updated.name, `Post-update Name ${timestamp}`);
  assert.equal(updated.sellingPrice, 8.5);
  assert.equal(updated.stock, 25);

  const fresh = await getProductById(created.id);
  assert.equal(fresh?.name, `Post-update Name ${timestamp}`);
  assert.equal(fresh?.sellingPrice, 8.5);
  assert.equal(fresh?.stock, 25);
});

test('Product CRUD: Delete product and ensure it is removed', async () => {
  const timestamp = Date.now();
  const created = await createProduct({
    name: `Temporary Item ${timestamp}`,
    sku: `SKU-DELETE-${timestamp}`,
    barcode: `555${timestamp.toString().slice(-9)}`,
    category: 'Merchandise',
    costPrice: 10.0,
    sellingPrice: 20.0,
    stock: 5,
    minStockAlert: 1,
  });

  const success = await deleteProduct(created.id);
  assert.equal(success, true);

  const lookup = await getProductById(created.id);
  assert.equal(lookup, null, 'Deleted product should not be found');
});

test('Product Persistence: Products persist across reload', async () => {
  const timestamp = Date.now();
  const created = await createProduct({
    name: `Persistent Pastry ${timestamp}`,
    sku: `SKU-PERSIST-${timestamp}`,
    barcode: `444${timestamp.toString().slice(-9)}`,
    category: 'Bakery',
    costPrice: 1.2,
    sellingPrice: 3.5,
    stock: 30,
    minStockAlert: 5,
  });

  // Re-read products from disk
  const all = await getAllProducts();
  const found = all.find((p) => p.id === created.id);
  assert.ok(found, 'Product must persist and be returned in catalog');
  assert.equal(found?.name, `Persistent Pastry ${timestamp}`);
});

test('Problem #16: Multiple products created without barcodes (empty string or null) store NULL in DB without unique constraint collision', async () => {
  const { normalizeDbProductBarcode } = await import('../lib/inventory-rules.ts');
  assert.equal(normalizeDbProductBarcode(''), null);
  assert.equal(normalizeDbProductBarcode('   '), null);
  assert.equal(normalizeDbProductBarcode(null), null);
  assert.equal(normalizeDbProductBarcode(undefined), null);
  assert.equal(normalizeDbProductBarcode(' 62810099 '), '62810099');

  const ts = Date.now();
  const prodNoBarcode1 = await createProduct({
    name: `No Barcode Item 1 (${ts})`,
    sku: `SKU-NOBC-1-${ts}`,
    barcode: '',
    category: 'General',
    costPrice: 10,
    sellingPrice: 15,
    stock: 5,
    minStockAlert: 1,
  });

  const prodNoBarcode2 = await createProduct({
    name: `No Barcode Item 2 (${ts})`,
    sku: `SKU-NOBC-2-${ts}`,
    barcode: '   ',
    category: 'General',
    costPrice: 20,
    sellingPrice: 30,
    stock: 8,
    minStockAlert: 2,
  });

  try {
    const retrieved1 = await getProductById(prodNoBarcode1.id);
    const retrieved2 = await getProductById(prodNoBarcode2.id);

    assert.ok(retrieved1, 'First product without barcode should be retrievable from DB');
    assert.ok(retrieved2, 'Second product without barcode should be retrievable from DB');
    assert.equal(retrieved1?.barcode, '');
    assert.equal(retrieved2?.barcode, '');
  } finally {
    await deleteProduct(prodNoBarcode1.id);
    await deleteProduct(prodNoBarcode2.id);
  }
});
