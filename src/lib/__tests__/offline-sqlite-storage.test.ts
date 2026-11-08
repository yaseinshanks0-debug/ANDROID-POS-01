/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { offlineSqliteStorage, SQLITE_DB_NAME } from '../offline-sqlite-storage.ts';
import type { Transaction } from '../types.ts';

describe('Capacitor SQLite Offline Persistence & Outbox Queue Engine', () => {
  const testCompanyId = 'comp-sqlite-test';

  it('initializes offline SQLite manager and reports diagnostics', async () => {
    const engine = await offlineSqliteStorage.initialize();
    assert.ok(
      ['capacitor-sqlite', 'indexeddb-sqlite-mirror', 'memory-journal'].includes(engine)
    );
    const diag = offlineSqliteStorage.getDiagnostics(testCompanyId);
    assert.equal(diag.databaseName, SQLITE_DB_NAME);
    assert.equal(diag.isInitialized, true);
  });

  it('persists offline pending transactions, tracks outbox queue, and marks them synced when back online', async () => {
    await offlineSqliteStorage.clearCompanySqliteData(testCompanyId);

    const sampleTransactions: Transaction[] = [
      {
        id: 'INV-OFFLINE-101',
        idempotencyKey: 'idem-101',
        items: [],
        subtotal: 1500,
        taxRatePercent: 0,
        taxAmount: 0,
        discountAmount: 0,
        grandTotal: 1500,
        amountTendered: 1500,
        changeDue: 0,
        paymentMethod: 'cash',
        timestamp: '2026-11-08T10:00:00.000Z',
        cashierName: 'Cashier 1',
        status: 'completed',
        syncStatus: 'pending_sync',
        currency: 'SDG',
        exchangeRateUsed: 1,
      },
      {
        id: 'INV-OFFLINE-102',
        idempotencyKey: 'idem-102',
        items: [],
        subtotal: 3200,
        taxRatePercent: 0,
        taxAmount: 0,
        discountAmount: 0,
        grandTotal: 3200,
        amountTendered: 3200,
        changeDue: 0,
        paymentMethod: 'card',
        timestamp: '2026-11-08T10:05:00.000Z',
        cashierName: 'Cashier 1',
        status: 'completed',
        syncStatus: 'synced',
        currency: 'SDG',
        exchangeRateUsed: 1,
      },
    ];

    await offlineSqliteStorage.persistTransactions(testCompanyId, sampleTransactions);

    const diagBefore = offlineSqliteStorage.getDiagnostics(testCompanyId);
    assert.equal(diagBefore.totalPersistedTransactions, 2);
    assert.equal(diagBefore.pendingOfflineTransactions, 1);
    assert.equal(diagBefore.pendingOutboxCount, 1);

    const loaded = await offlineSqliteStorage.loadTransactions(testCompanyId);
    assert.equal(loaded.length, 2);
    assert.equal(loaded[0].id, 'INV-OFFLINE-102');
    assert.equal(loaded[1].id, 'INV-OFFLINE-101');
    assert.equal(loaded[1].syncStatus, 'pending_sync');

    // Mark offline transactions synced
    await offlineSqliteStorage.markTransactionsSynced(testCompanyId, ['INV-OFFLINE-101']);

    const diagAfter = offlineSqliteStorage.getDiagnostics(testCompanyId);
    assert.equal(diagAfter.pendingOfflineTransactions, 0);
    assert.equal(diagAfter.pendingOutboxCount, 0);
  });

  it('persists and restores workspace module snapshots (products, customers, movements)', async () => {
    const sampleProducts = [
      { id: 'p-1', name: 'Espresso Beans', price: 2500, stock: 40 },
      { id: 'p-2', name: 'Cardamom', price: 1800, stock: 15 },
    ];
    await offlineSqliteStorage.persistWorkspaceSnapshot(
      testCompanyId,
      'products',
      sampleProducts
    );

    const restored = await offlineSqliteStorage.loadWorkspaceSnapshot<typeof sampleProducts>(
      testCompanyId,
      'products'
    );
    assert.deepEqual(restored, sampleProducts);
  });

  it('exports the SQLite database to a JsonSQLite backup file and restores it accurately', async () => {
    const tx: Transaction = {
      id: 'INV-SQLITE-BACKUP-1',
      idempotencyKey: 'idem-backup-1',
      items: [],
      subtotal: 4500,
      taxRatePercent: 0,
      taxAmount: 0,
      discountAmount: 0,
      grandTotal: 4500,
      amountTendered: 4500,
      changeDue: 0,
      paymentMethod: 'cash',
      timestamp: '2026-11-08T11:30:00.000Z',
      cashierName: 'Admin',
      status: 'completed',
      syncStatus: 'pending_sync',
      currency: 'SDG',
      exchangeRateUsed: 1,
    };

    const exported = await offlineSqliteStorage.exportDatabaseToBackupFile({
      companyId: testCompanyId,
      companyName: 'Dqnamo Mart',
      transactions: [tx],
      products: [{ id: 'prod-99', name: 'Arabic Coffee', price: 1200, stock: 25 }],
      customers: [{ id: 'cust-99', name: 'أحمد محمد', phone: '0912345678' }],
    });

    assert.ok(exported.fileName.endsWith('.sqlite.json'));
    assert.equal(exported.tablesExported, 3);
    assert.equal(exported.transactionsCount, 1);
    assert.equal(exported.productsCount, 1);
    assert.equal(exported.customersCount, 1);

    const parsedEnvelope = JSON.parse(exported.jsonContent);
    assert.equal(parsedEnvelope.format, 'DQNAMO_CAPACITOR_SQLITE_EXPORT_V1');
    assert.equal(parsedEnvelope.capacitorSqliteExport.database, SQLITE_DB_NAME);
    assert.equal(parsedEnvelope.capacitorSqliteExport.tables.length, 3);

    // Clear and restore into a clean company workspace
    const restoreTargetCompany = 'comp-sqlite-restored';
    await offlineSqliteStorage.clearCompanySqliteData(restoreTargetCompany);

    const importResult = await offlineSqliteStorage.importDatabaseFromBackupFile(
      exported.jsonContent,
      restoreTargetCompany
    );

    assert.equal(importResult.ok, true);
    assert.equal(importResult.restoredTransactions.length, 1);
    assert.equal(importResult.restoredTransactions[0].id, 'INV-SQLITE-BACKUP-1');
    assert.equal(importResult.restoredProducts.length, 1);
    assert.equal(importResult.restoredCustomers.length, 1);
  });
});
