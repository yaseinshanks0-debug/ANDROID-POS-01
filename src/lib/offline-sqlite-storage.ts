/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import type { Transaction } from './types';

export const SQLITE_DB_NAME = 'dqnamo_pos_offline_db';
export const SQLITE_DB_VERSION = 1;
const IDB_NAME = 'dqnamo_pos_sqlite_idb_v1';
const IDB_TX_STORE = 'offline_transactions';
const IDB_KV_STORE = 'offline_kv_snapshots';
const IDB_OUTBOX_STORE = 'offline_outbox_queue';

export type OfflineStorageEngineType =
  | 'capacitor-sqlite'
  | 'indexeddb-sqlite-mirror'
  | 'memory-journal';

export interface OfflineOutboxEntry {
  queueId: string;
  companyId: string;
  entityType: 'transaction' | 'product' | 'customer' | 'movement';
  entityId: string;
  operation: 'UPSERT' | 'VOID' | 'DELETE';
  payloadJson: string;
  createdAt: string;
  retryCount: number;
}

export interface OfflineSqliteDiagnostics {
  engineType: OfflineStorageEngineType;
  isInitialized: boolean;
  isDeviceOnline: boolean;
  databaseName: string;
  companyId: string;
  totalPersistedTransactions: number;
  pendingOfflineTransactions: number;
  pendingOutboxCount: number;
  lastPersistedAt: string | null;
}

const SCHEMA_DDL = `
CREATE TABLE IF NOT EXISTS offline_transactions (
  id TEXT PRIMARY KEY NOT NULL,
  company_id TEXT NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  timestamp TEXT NOT NULL,
  total REAL NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  payload_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_offline_tx_company ON offline_transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_offline_tx_sync ON offline_transactions(company_id, sync_status);

CREATE TABLE IF NOT EXISTS offline_kv_snapshots (
  store_key TEXT PRIMARY KEY NOT NULL,
  company_id TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS offline_outbox_queue (
  queue_id TEXT PRIMARY KEY NOT NULL,
  company_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  operation TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  retry_count INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_outbox_company ON offline_outbox_queue(company_id);
`;

class OfflineSqlitePersistenceManager {
  private sqliteConnection: SQLiteConnection | null = null;
  private dbConnection: SQLiteDBConnection | null = null;
  private engineType: OfflineStorageEngineType = 'memory-journal';
  private initialized = false;
  private initPromise: Promise<OfflineStorageEngineType> | null = null;
  private lastPersistedAt: string | null = null;

  // In-memory & localStorage fallback maps for environments without Native SQLite or IndexedDB
  private memoryTransactions = new Map<string, { companyId: string; tx: Transaction; updatedAt: string }>();
  private memoryKv = new Map<string, { companyId: string; payloadJson: string; updatedAt: string }>();
  private memoryOutbox = new Map<string, OfflineOutboxEntry>();

  public async initialize(): Promise<OfflineStorageEngineType> {
    if (this.initialized) return this.engineType;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.performInitialization();
    return this.initPromise;
  }

  private async performInitialization(): Promise<OfflineStorageEngineType> {
    const isNative =
      typeof window !== 'undefined' &&
      typeof Capacitor?.isNativePlatform === 'function' &&
      Capacitor.isNativePlatform();

    if (isNative) {
      try {
        this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
        const retCC = await this.sqliteConnection.checkConnectionsConsistency();
        const isConn = (await this.sqliteConnection.isConnection(SQLITE_DB_NAME, false)).result;

        if (retCC.result && isConn) {
          this.dbConnection = await this.sqliteConnection.retrieveConnection(SQLITE_DB_NAME, false);
        } else {
          this.dbConnection = await this.sqliteConnection.createConnection(
            SQLITE_DB_NAME,
            false,
            'no-encryption',
            SQLITE_DB_VERSION,
            false
          );
        }

        await this.dbConnection.open();
        await this.dbConnection.execute(SCHEMA_DDL);
        this.engineType = 'capacitor-sqlite';
        this.initialized = true;
        return this.engineType;
      } catch (err) {
        console.warn('CapacitorSQLite native init fallback to IndexedDB/Journal:', err);
      }
    }

    // Try browser IndexedDB mirror when running on Web / Windows Desktop
    if (typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined') {
      try {
        await this.openIndexedDb();
        this.engineType = 'indexeddb-sqlite-mirror';
        this.initialized = true;
        return this.engineType;
      } catch (err) {
        console.warn('IndexedDB unavailable, using durable memory/localStorage journal:', err);
      }
    }

    this.engineType = 'memory-journal';
    this.initialized = true;
    return this.engineType;
  }

  private openIndexedDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = window.indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_TX_STORE)) {
          const txStore = db.createObjectStore(IDB_TX_STORE, { keyPath: 'id' });
          txStore.createIndex('companyId', 'companyId', { unique: false });
        }
        if (!db.objectStoreNames.contains(IDB_KV_STORE)) {
          db.createObjectStore(IDB_KV_STORE, { keyPath: 'storeKey' });
        }
        if (!db.objectStoreNames.contains(IDB_OUTBOX_STORE)) {
          const outboxStore = db.createObjectStore(IDB_OUTBOX_STORE, { keyPath: 'queueId' });
          outboxStore.createIndex('companyId', 'companyId', { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  public async persistTransactions(companyId: string, transactions: Transaction[]): Promise<void> {
    await this.initialize();
    const safeCompanyId = String(companyId || 'comp-default');
    const nowIso = new Date().toISOString();

    // Always mirror to memory map for instant synchronous diagnostics
    for (const tx of transactions || []) {
      if (!tx?.id) continue;
      const scopedTx: Transaction = {
        ...tx,
        syncStatus: tx.syncStatus || (this.isOnline() ? 'synced' : 'pending_sync'),
      };
      this.memoryTransactions.set(`${safeCompanyId}:${scopedTx.id}`, {
        companyId: safeCompanyId,
        tx: scopedTx,
        updatedAt: nowIso,
      });

      const queueId = `${safeCompanyId}:tx:${scopedTx.id}`;
      if (scopedTx.syncStatus !== 'synced') {
        this.memoryOutbox.set(queueId, {
          queueId,
          companyId: safeCompanyId,
          entityType: 'transaction',
          entityId: scopedTx.id,
          operation: scopedTx.status === 'voided' ? 'VOID' : 'UPSERT',
          payloadJson: JSON.stringify(scopedTx),
          createdAt: scopedTx.timestamp || nowIso,
          retryCount: 0,
        });
      } else {
        this.memoryOutbox.delete(queueId);
      }
    }

    if (this.engineType === 'capacitor-sqlite' && this.dbConnection) {
      try {
        for (const tx of transactions || []) {
          if (!tx?.id) continue;
          const syncStatus = tx.syncStatus || 'pending_sync';
          const payloadStr = JSON.stringify(tx);
          await this.dbConnection.run(
            `INSERT OR REPLACE INTO offline_transactions (id, company_id, sync_status, timestamp, total, payment_method, payload_json, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              tx.id,
              safeCompanyId,
              syncStatus,
              tx.timestamp || nowIso,
              Number(tx.grandTotal || 0),
              tx.paymentMethod || 'cash',
              payloadStr,
              nowIso,
            ]
          );

          const queueId = `${safeCompanyId}:tx:${tx.id}`;
          if (syncStatus !== 'synced') {
            await this.dbConnection.run(
              `INSERT OR REPLACE INTO offline_outbox_queue (queue_id, company_id, entity_type, entity_id, operation, payload_json, created_at, retry_count)
               VALUES (?, ?, 'transaction', ?, ?, ?, ?, 0);`,
              [
                queueId,
                safeCompanyId,
                tx.id,
                tx.status === 'voided' ? 'VOID' : 'UPSERT',
                payloadStr,
                tx.timestamp || nowIso,
              ]
            );
          } else {
            await this.dbConnection.run(
              `DELETE FROM offline_outbox_queue WHERE queue_id = ?;`,
              [queueId]
            );
          }
        }
      } catch (err) {
        console.warn('CapacitorSQLite persistTransactions error:', err);
      }
    } else if (this.engineType === 'indexeddb-sqlite-mirror') {
      try {
        const db = await this.openIndexedDb();
        await new Promise<void>((resolve, reject) => {
          const txObj = db.transaction([IDB_TX_STORE, IDB_OUTBOX_STORE], 'readwrite');
          const store = txObj.objectStore(IDB_TX_STORE);
          const outbox = txObj.objectStore(IDB_OUTBOX_STORE);

          for (const tx of transactions || []) {
            if (!tx?.id) continue;
            const syncStatus = tx.syncStatus || 'pending_sync';
            store.put({
              id: `${safeCompanyId}:${tx.id}`,
              rawId: tx.id,
              companyId: safeCompanyId,
              syncStatus,
              timestamp: tx.timestamp || nowIso,
              total: Number(tx.grandTotal || 0),
              paymentMethod: tx.paymentMethod || 'cash',
              payload: tx,
              updatedAt: nowIso,
            });

            const queueId = `${safeCompanyId}:tx:${tx.id}`;
            if (syncStatus !== 'synced') {
              outbox.put({
                queueId,
                companyId: safeCompanyId,
                entityType: 'transaction',
                entityId: tx.id,
                operation: tx.status === 'voided' ? 'VOID' : 'UPSERT',
                payloadJson: JSON.stringify(tx),
                createdAt: tx.timestamp || nowIso,
                retryCount: 0,
              });
            } else {
              outbox.delete(queueId);
            }
          }
          txObj.oncomplete = () => {
            db.close();
            resolve();
          };
          txObj.onerror = () => {
            db.close();
            reject(txObj.error);
          };
        });
      } catch (err) {
        console.warn('IndexedDB persistTransactions error:', err);
      }
    }

    this.lastPersistedAt = nowIso;
  }

  public async loadTransactions(companyId: string): Promise<Transaction[]> {
    await this.initialize();
    const safeCompanyId = String(companyId || 'comp-default');

    if (this.engineType === 'capacitor-sqlite' && this.dbConnection) {
      try {
        const res = await this.dbConnection.query(
          `SELECT payload_json, sync_status FROM offline_transactions WHERE company_id = ? ORDER BY timestamp DESC;`,
          [safeCompanyId]
        );
        const rows = res.values || [];
        const parsed: Transaction[] = [];
        for (const row of rows) {
          try {
            const tx = JSON.parse(row.payload_json) as Transaction;
            if (tx?.id) {
              tx.syncStatus = row.sync_status || tx.syncStatus || 'synced';
              parsed.push(tx);
              this.memoryTransactions.set(`${safeCompanyId}:${tx.id}`, {
                companyId: safeCompanyId,
                tx,
                updatedAt: new Date().toISOString(),
              });
            }
          } catch {}
        }
        return parsed;
      } catch (err) {
        console.warn('CapacitorSQLite loadTransactions error:', err);
      }
    } else if (this.engineType === 'indexeddb-sqlite-mirror') {
      try {
        const db = await this.openIndexedDb();
        const records = await new Promise<Transaction[]>((resolve, reject) => {
          const txObj = db.transaction(IDB_TX_STORE, 'readonly');
          const store = txObj.objectStore(IDB_TX_STORE);
          const idx = store.index('companyId');
          const req = idx.getAll(safeCompanyId);
          req.onsuccess = () => {
            const list = (req.result || [])
              .map((r: any) => r.payload as Transaction)
              .filter((t: Transaction) => Boolean(t?.id));
            db.close();
            resolve(list);
          };
          req.onerror = () => {
            db.close();
            reject(req.error);
          };
        });
        for (const tx of records) {
          this.memoryTransactions.set(`${safeCompanyId}:${tx.id}`, {
            companyId: safeCompanyId,
            tx,
            updatedAt: new Date().toISOString(),
          });
        }
        return records.sort(
          (a, b) => (Date.parse(b.timestamp || '') || 0) - (Date.parse(a.timestamp || '') || 0)
        );
      } catch (err) {
        console.warn('IndexedDB loadTransactions error:', err);
      }
    }

    const fallbackList: Transaction[] = [];
    for (const entry of this.memoryTransactions.values()) {
      if (entry.companyId === safeCompanyId) {
        fallbackList.push(entry.tx);
      }
    }
    return fallbackList.sort(
      (a, b) => (Date.parse(b.timestamp || '') || 0) - (Date.parse(a.timestamp || '') || 0)
    );
  }

  public async markTransactionsSynced(companyId: string, transactionIds?: string[]): Promise<void> {
    await this.initialize();
    const safeCompanyId = String(companyId || 'comp-default');
    const nowIso = new Date().toISOString();
    const idSet = transactionIds ? new Set(transactionIds) : null;

    for (const [key, entry] of this.memoryTransactions.entries()) {
      if (entry.companyId === safeCompanyId && (!idSet || idSet.has(entry.tx.id))) {
        entry.tx = { ...entry.tx, syncStatus: 'synced' };
        entry.updatedAt = nowIso;
        this.memoryTransactions.set(key, entry);
        this.memoryOutbox.delete(`${safeCompanyId}:tx:${entry.tx.id}`);
      }
    }

    if (this.engineType === 'capacitor-sqlite' && this.dbConnection) {
      try {
        if (!idSet) {
          await this.dbConnection.run(
            `UPDATE offline_transactions SET sync_status = 'synced', updated_at = ? WHERE company_id = ?;`,
            [nowIso, safeCompanyId]
          );
          await this.dbConnection.run(
            `DELETE FROM offline_outbox_queue WHERE company_id = ? AND entity_type = 'transaction';`,
            [safeCompanyId]
          );
        } else {
          for (const txId of idSet) {
            await this.dbConnection.run(
              `UPDATE offline_transactions SET sync_status = 'synced', updated_at = ? WHERE id = ? AND company_id = ?;`,
              [nowIso, txId, safeCompanyId]
            );
            await this.dbConnection.run(
              `DELETE FROM offline_outbox_queue WHERE queue_id = ?;`,
              [`${safeCompanyId}:tx:${txId}`]
            );
          }
        }
      } catch (err) {
        console.warn('CapacitorSQLite markTransactionsSynced error:', err);
      }
    } else if (this.engineType === 'indexeddb-sqlite-mirror') {
      try {
        const current = await this.loadTransactions(safeCompanyId);
        const updated = current.map((t) =>
          !idSet || idSet.has(t.id) ? ({ ...t, syncStatus: 'synced' } as Transaction) : t
        );
        await this.persistTransactions(safeCompanyId, updated);
      } catch {}
    }

    this.lastPersistedAt = nowIso;
  }

  public async persistWorkspaceSnapshot<T>(
    companyId: string,
    moduleKey: string,
    data: T
  ): Promise<void> {
    await this.initialize();
    const safeCompanyId = String(companyId || 'comp-default');
    const storeKey = `${safeCompanyId}:${moduleKey}`;
    const payloadJson = JSON.stringify(data);
    const nowIso = new Date().toISOString();

    this.memoryKv.set(storeKey, {
      companyId: safeCompanyId,
      payloadJson,
      updatedAt: nowIso,
    });

    if (this.engineType === 'capacitor-sqlite' && this.dbConnection) {
      try {
        await this.dbConnection.run(
          `INSERT OR REPLACE INTO offline_kv_snapshots (store_key, company_id, payload_json, updated_at)
           VALUES (?, ?, ?, ?);`,
          [storeKey, safeCompanyId, payloadJson, nowIso]
        );
      } catch (err) {
        console.warn('CapacitorSQLite persistWorkspaceSnapshot error:', err);
      }
    } else if (this.engineType === 'indexeddb-sqlite-mirror') {
      try {
        const db = await this.openIndexedDb();
        await new Promise<void>((resolve, reject) => {
          const txObj = db.transaction(IDB_KV_STORE, 'readwrite');
          txObj.objectStore(IDB_KV_STORE).put({
            storeKey,
            companyId: safeCompanyId,
            payloadJson,
            updatedAt: nowIso,
          });
          txObj.oncomplete = () => {
            db.close();
            resolve();
          };
          txObj.onerror = () => {
            db.close();
            reject(txObj.error);
          };
        });
      } catch {}
    }

    this.lastPersistedAt = nowIso;
  }

  public async loadWorkspaceSnapshot<T>(
    companyId: string,
    moduleKey: string
  ): Promise<T | null> {
    await this.initialize();
    const safeCompanyId = String(companyId || 'comp-default');
    const storeKey = `${safeCompanyId}:${moduleKey}`;

    if (this.engineType === 'capacitor-sqlite' && this.dbConnection) {
      try {
        const res = await this.dbConnection.query(
          `SELECT payload_json FROM offline_kv_snapshots WHERE store_key = ? LIMIT 1;`,
          [storeKey]
        );
        const raw = res.values?.[0]?.payload_json;
        if (raw) {
          return JSON.parse(raw) as T;
        }
      } catch {}
    } else if (this.engineType === 'indexeddb-sqlite-mirror') {
      try {
        const db = await this.openIndexedDb();
        const raw = await new Promise<string | null>((resolve, reject) => {
          const txObj = db.transaction(IDB_KV_STORE, 'readonly');
          const req = txObj.objectStore(IDB_KV_STORE).get(storeKey);
          req.onsuccess = () => {
            db.close();
            resolve(req.result?.payloadJson || null);
          };
          req.onerror = () => {
            db.close();
            reject(req.error);
          };
        });
        if (raw) return JSON.parse(raw) as T;
      } catch {}
    }

    const mem = this.memoryKv.get(storeKey);
    if (mem?.payloadJson) {
      try {
        return JSON.parse(mem.payloadJson) as T;
      } catch {}
    }
    return null;
  }

  public async clearCompanySqliteData(companyId: string): Promise<void> {
    await this.initialize();
    const safeCompanyId = String(companyId || 'comp-default');

    for (const [key, entry] of this.memoryTransactions.entries()) {
      if (entry.companyId === safeCompanyId) this.memoryTransactions.delete(key);
    }
    for (const [key, entry] of this.memoryKv.entries()) {
      if (entry.companyId === safeCompanyId) this.memoryKv.delete(key);
    }
    for (const [key, entry] of this.memoryOutbox.entries()) {
      if (entry.companyId === safeCompanyId) this.memoryOutbox.delete(key);
    }

    if (this.engineType === 'capacitor-sqlite' && this.dbConnection) {
      try {
        await this.dbConnection.run(`DELETE FROM offline_transactions WHERE company_id = ?;`, [
          safeCompanyId,
        ]);
        await this.dbConnection.run(`DELETE FROM offline_kv_snapshots WHERE company_id = ?;`, [
          safeCompanyId,
        ]);
        await this.dbConnection.run(`DELETE FROM offline_outbox_queue WHERE company_id = ?;`, [
          safeCompanyId,
        ]);
      } catch {}
    }
  }

  public isOnline(): boolean {
    if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
      return navigator.onLine;
    }
    return true;
  }

  public getDiagnostics(companyId: string): OfflineSqliteDiagnostics {
    const safeCompanyId = String(companyId || 'comp-default');
    let totalTx = 0;
    let pendingTx = 0;
    for (const entry of this.memoryTransactions.values()) {
      if (entry.companyId === safeCompanyId) {
        totalTx++;
        if (entry.tx.syncStatus !== 'synced') {
          pendingTx++;
        }
      }
    }

    let outboxCount = 0;
    for (const item of this.memoryOutbox.values()) {
      if (item.companyId === safeCompanyId) {
        outboxCount++;
      }
    }

    return {
      engineType: this.engineType,
      isInitialized: this.initialized,
      isDeviceOnline: this.isOnline(),
      databaseName: SQLITE_DB_NAME,
      companyId: safeCompanyId,
      totalPersistedTransactions: totalTx,
      pendingOfflineTransactions: pendingTx,
      pendingOutboxCount: outboxCount,
      lastPersistedAt: this.lastPersistedAt,
    };
  }

  /**
   * Exports the entire Capacitor SQLite database (`exportToJson('full')` when running on native Android,
   * or a standard JsonSQLite-compatible table dump on Web/Desktop) along with the structured POS dataset
   * so the user can download a portable `.sqlite.json` database backup file.
   */
  public async exportDatabaseToBackupFile(params: {
    companyId: string;
    companyName: string;
    transactions: Transaction[];
    products?: any[];
    customers?: any[];
    stockMovements?: any[];
    currencies?: any[];
    settings?: Record<string, any>;
  }): Promise<{
    fileName: string;
    jsonContent: string;
    tablesExported: number;
    transactionsCount: number;
    productsCount: number;
    customersCount: number;
  }> {
    await this.initialize();
    const safeCompanyId = String(params.companyId || 'comp-default');
    const nowIso = new Date().toISOString();
    const dateStamp = nowIso.slice(0, 10);

    // Ensure latest state is flushed to SQLite before exporting
    await this.persistTransactions(safeCompanyId, params.transactions || []);
    if (params.products) {
      await this.persistWorkspaceSnapshot(safeCompanyId, 'products', params.products);
    }
    if (params.customers) {
      await this.persistWorkspaceSnapshot(safeCompanyId, 'customers', params.customers);
    }
    if (params.stockMovements) {
      await this.persistWorkspaceSnapshot(safeCompanyId, 'stockMovements', params.stockMovements);
    }
    if (params.currencies) {
      await this.persistWorkspaceSnapshot(safeCompanyId, 'currencies', params.currencies);
    }
    if (params.settings) {
      await this.persistWorkspaceSnapshot(safeCompanyId, 'settings', params.settings);
    }

    let capacitorSqliteExport: Record<string, any> | null = null;

    if (this.engineType === 'capacitor-sqlite' && this.dbConnection) {
      try {
        const exported = await this.dbConnection.exportToJson('full');
        if (exported?.export) {
          capacitorSqliteExport = exported.export as Record<string, any>;
        }
      } catch (err) {
        console.warn('CapacitorSQLite native exportToJson fallback:', err);
      }
    }

    // Build JsonSQLite-compatible structure if not produced by native plugin
    if (!capacitorSqliteExport) {
      const txValues: any[][] = [];
      for (const entry of this.memoryTransactions.values()) {
        if (entry.companyId === safeCompanyId) {
          const tx = entry.tx;
          txValues.push([
            tx.id,
            safeCompanyId,
            tx.syncStatus || 'synced',
            tx.timestamp || nowIso,
            Number(tx.grandTotal || 0),
            tx.paymentMethod || 'cash',
            JSON.stringify(tx),
            entry.updatedAt || nowIso,
          ]);
        }
      }

      const kvValues: any[][] = [];
      for (const [storeKey, kv] of this.memoryKv.entries()) {
        if (kv.companyId === safeCompanyId) {
          kvValues.push([storeKey, safeCompanyId, kv.payloadJson, kv.updatedAt]);
        }
      }

      const outboxValues: any[][] = [];
      for (const item of this.memoryOutbox.values()) {
        if (item.companyId === safeCompanyId) {
          outboxValues.push([
            item.queueId,
            item.companyId,
            item.entityType,
            item.entityId,
            item.operation,
            item.payloadJson,
            item.createdAt,
            item.retryCount,
          ]);
        }
      }

      capacitorSqliteExport = {
        database: SQLITE_DB_NAME,
        version: SQLITE_DB_VERSION,
        encrypted: false,
        mode: 'full',
        tables: [
          {
            name: 'offline_transactions',
            schema: [
              { column: 'id', value: 'TEXT PRIMARY KEY NOT NULL' },
              { column: 'company_id', value: 'TEXT NOT NULL' },
              { column: 'sync_status', value: 'TEXT NOT NULL' },
              { column: 'timestamp', value: 'TEXT NOT NULL' },
              { column: 'total', value: 'REAL NOT NULL' },
              { column: 'payment_method', value: 'TEXT NOT NULL' },
              { column: 'payload_json', value: 'TEXT NOT NULL' },
              { column: 'updated_at', value: 'TEXT NOT NULL' },
            ],
            values: txValues,
          },
          {
            name: 'offline_kv_snapshots',
            schema: [
              { column: 'store_key', value: 'TEXT PRIMARY KEY NOT NULL' },
              { column: 'company_id', value: 'TEXT NOT NULL' },
              { column: 'payload_json', value: 'TEXT NOT NULL' },
              { column: 'updated_at', value: 'TEXT NOT NULL' },
            ],
            values: kvValues,
          },
          {
            name: 'offline_outbox_queue',
            schema: [
              { column: 'queue_id', value: 'TEXT PRIMARY KEY NOT NULL' },
              { column: 'company_id', value: 'TEXT NOT NULL' },
              { column: 'entity_type', value: 'TEXT NOT NULL' },
              { column: 'entity_id', value: 'TEXT NOT NULL' },
              { column: 'operation', value: 'TEXT NOT NULL' },
              { column: 'payload_json', value: 'TEXT NOT NULL' },
              { column: 'created_at', value: 'TEXT NOT NULL' },
              { column: 'retry_count', value: 'INTEGER NOT NULL DEFAULT 0' },
            ],
            values: outboxValues,
          },
        ],
      };
    }

    const posDataset = {
      transactions: params.transactions || [],
      products: params.products || [],
      customers: params.customers || [],
      stockMovements: params.stockMovements || [],
      currencies: params.currencies || [],
      settings: params.settings || {},
    };

    const envelope = {
      format: 'DQNAMO_CAPACITOR_SQLITE_EXPORT_V1',
      exportedAt: nowIso,
      engineType: this.engineType,
      databaseName: SQLITE_DB_NAME,
      databaseVersion: SQLITE_DB_VERSION,
      companyId: safeCompanyId,
      companyName: params.companyName || 'Dqnamo POS',
      capacitorSqliteExport,
      posDataset,
    };

    const safeCompanySlug = String(params.companyName || safeCompanyId)
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 32) || 'pos';

    const fileName = `dqnamo-sqlite-backup-${safeCompanySlug}-${dateStamp}.sqlite.json`;

    return {
      fileName,
      jsonContent: JSON.stringify(envelope, null, 2),
      tablesExported: Array.isArray(capacitorSqliteExport?.tables)
        ? capacitorSqliteExport.tables.length
        : 3,
      transactionsCount: posDataset.transactions.length,
      productsCount: posDataset.products.length,
      customersCount: posDataset.customers.length,
    };
  }

  /**
   * Imports a Capacitor SQLite backup file (`.sqlite.json` produced by `exportDatabaseToBackupFile`
   * or a raw `JsonSQLite` export) back into SQLite and returns the restored POS records.
   */
  public async importDatabaseFromBackupFile(
    rawJsonText: string,
    targetCompanyId: string
  ): Promise<{
    ok: boolean;
    restoredTransactions: Transaction[];
    restoredProducts: any[];
    restoredCustomers: any[];
    restoredStockMovements: any[];
    restoredCurrencies: any[];
    error?: string;
  }> {
    await this.initialize();
    const safeCompanyId = String(targetCompanyId || 'comp-default');

    let parsed: any;
    try {
      parsed = JSON.parse(rawJsonText);
    } catch {
      return {
        ok: false,
        restoredTransactions: [],
        restoredProducts: [],
        restoredCustomers: [],
        restoredStockMovements: [],
        restoredCurrencies: [],
        error: 'Invalid JSON file format.',
      };
    }

    const sqliteExportObj = parsed?.capacitorSqliteExport || (parsed?.tables ? parsed : null);

    // If running on native Android CapacitorSQLite, also import via sqliteConnection.importFromJson
    if (this.engineType === 'capacitor-sqlite' && this.sqliteConnection && sqliteExportObj) {
      try {
        const jsonStr = JSON.stringify(sqliteExportObj);
        const valid = await this.sqliteConnection.isJsonValid(jsonStr);
        if (valid.result) {
          await this.sqliteConnection.importFromJson(jsonStr);
        }
      } catch (err) {
        console.warn('CapacitorSQLite native importFromJson warning:', err);
      }
    }

    let restoredTransactions: Transaction[] = [];
    let restoredProducts: any[] = [];
    let restoredCustomers: any[] = [];
    let restoredStockMovements: any[] = [];
    let restoredCurrencies: any[] = [];

    if (parsed?.posDataset && typeof parsed.posDataset === 'object') {
      restoredTransactions = Array.isArray(parsed.posDataset.transactions)
        ? parsed.posDataset.transactions
        : [];
      restoredProducts = Array.isArray(parsed.posDataset.products)
        ? parsed.posDataset.products
        : [];
      restoredCustomers = Array.isArray(parsed.posDataset.customers)
        ? parsed.posDataset.customers
        : [];
      restoredStockMovements = Array.isArray(parsed.posDataset.stockMovements)
        ? parsed.posDataset.stockMovements
        : [];
      restoredCurrencies = Array.isArray(parsed.posDataset.currencies)
        ? parsed.posDataset.currencies
        : [];
    } else if (Array.isArray(sqliteExportObj?.tables)) {
      const txTable = sqliteExportObj.tables.find(
        (t: any) => t.name === 'offline_transactions'
      );
      if (Array.isArray(txTable?.values)) {
        for (const row of txTable.values) {
          const payloadJson = row?.[6];
          if (typeof payloadJson === 'string') {
            try {
              const tx = JSON.parse(payloadJson) as Transaction;
              if (tx?.id) restoredTransactions.push(tx);
            } catch {}
          }
        }
      }
    }

    if (restoredTransactions.length > 0) {
      await this.persistTransactions(safeCompanyId, restoredTransactions);
    }
    if (restoredProducts.length > 0) {
      await this.persistWorkspaceSnapshot(safeCompanyId, 'products', restoredProducts);
    }
    if (restoredCustomers.length > 0) {
      await this.persistWorkspaceSnapshot(safeCompanyId, 'customers', restoredCustomers);
    }
    if (restoredStockMovements.length > 0) {
      await this.persistWorkspaceSnapshot(safeCompanyId, 'stockMovements', restoredStockMovements);
    }
    if (restoredCurrencies.length > 0) {
      await this.persistWorkspaceSnapshot(safeCompanyId, 'currencies', restoredCurrencies);
    }

    return {
      ok: true,
      restoredTransactions,
      restoredProducts,
      restoredCustomers,
      restoredStockMovements,
      restoredCurrencies,
    };
  }
}

export const offlineSqliteStorage = new OfflineSqlitePersistenceManager();
