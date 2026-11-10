/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { getTableColumns } from 'drizzle-orm';
import { getTableConfig } from 'drizzle-orm/pg-core';
import * as schema from '../schema';

test('Phase 2.1 — Drizzle schema defines catalog lifecycle columns and check constraints on products', () => {
  const columns = getTableColumns(schema.products);
  assert.ok(columns.catalogLifecycleStatus, 'products.catalogLifecycleStatus must exist');
  assert.equal(columns.catalogLifecycleStatus.default, 'ACTIVE');
  assert.equal(columns.catalogLifecycleStatus.notNull, true);

  assert.ok(columns.discontinuedAt, 'products.discontinuedAt must exist');
  assert.ok(columns.discontinuedReason, 'products.discontinuedReason must exist');
  assert.ok(columns.replacementProductId, 'products.replacementProductId must exist');

  const config = getTableConfig(schema.products);
  const indexNames = config.indexes.map((idx) => idx.config.name);
  assert.ok(
    indexNames.includes('product_lifecycle_idx'),
    'products must include product_lifecycle_idx'
  );

  const checkNames = config.checks.map((chk) => chk.name);
  assert.ok(
    checkNames.includes('product_catalog_lifecycle_chk'),
    'products must include product_catalog_lifecycle_chk'
  );
});

test('Phase 2.2 — Drizzle schema defines partial fulfillment, batch observation, and tenant isolation columns on unmetDemandRequests', () => {
  const columns = getTableColumns(schema.unmetDemandRequests);

  assert.ok(columns.companyId, 'unmetDemandRequests.companyId must exist');
  assert.equal(columns.companyId.default, 'comp-default');
  assert.equal(columns.companyId.notNull, true);

  assert.ok(columns.fulfilledBaseUnits, 'unmetDemandRequests.fulfilledBaseUnits must exist');
  assert.equal(columns.fulfilledBaseUnits.default, 0);
  assert.equal(columns.fulfilledBaseUnits.notNull, true);

  assert.ok(
    columns.remainingUnfulfilledBaseUnits,
    'unmetDemandRequests.remainingUnfulfilledBaseUnits must exist'
  );
  assert.equal(columns.remainingUnfulfilledBaseUnits.default, 1);
  assert.equal(columns.remainingUnfulfilledBaseUnits.notNull, true);

  assert.ok(columns.expiredUnitsObserved, 'unmetDemandRequests.expiredUnitsObserved must exist');
  assert.ok(columns.expiredBatchNumber, 'unmetDemandRequests.expiredBatchNumber must exist');
  assert.ok(columns.expiredBatchDate, 'unmetDemandRequests.expiredBatchDate must exist');
  assert.ok(columns.substituteProductId, 'unmetDemandRequests.substituteProductId must exist');
  assert.ok(columns.lastFulfilledAt, 'unmetDemandRequests.lastFulfilledAt must exist');

  const config = getTableConfig(schema.unmetDemandRequests);
  const indexNames = config.indexes.map((idx) => idx.config.name);
  assert.ok(indexNames.includes('unmet_demand_company_idx'));
  assert.ok(indexNames.includes('unmet_demand_company_branch_time_idx'));
  assert.ok(indexNames.includes('unmet_demand_fulfillment_status_idx'));

  const checkNames = config.checks.map((chk) => chk.name);
  assert.ok(checkNames.includes('unmet_demand_qty_positive_chk'));
  assert.ok(checkNames.includes('unmet_demand_base_units_positive_chk'));
  assert.ok(checkNames.includes('unmet_demand_fulfilled_bounds_chk'));
  assert.ok(checkNames.includes('unmet_demand_availability_status_chk'));
  assert.ok(checkNames.includes('unmet_demand_fulfillment_status_chk'));
  assert.ok(checkNames.includes('unmet_demand_reason_valid_chk'));
});

test('Phase 2.3 — Drizzle schema defines unmetDemandFulfillments table with sale-link uniqueness and reversal status constraints', () => {
  const columns = getTableColumns(schema.unmetDemandFulfillments);

  assert.ok(columns.id);
  assert.ok(columns.companyId);
  assert.ok(columns.requestId);
  assert.equal(columns.requestId.notNull, true);
  assert.ok(columns.saleId);
  assert.ok(columns.saleTransactionId);
  assert.equal(columns.saleTransactionId.notNull, true);
  assert.ok(columns.saleItemId);
  assert.ok(columns.saleLineIndex);
  assert.equal(columns.saleLineIndex.default, 0);
  assert.ok(columns.branchId);
  assert.ok(columns.productId);
  assert.ok(columns.fulfilledBaseUnits);
  assert.equal(columns.fulfilledBaseUnits.notNull, true);
  assert.ok(columns.status);
  assert.equal(columns.status.default, 'active');
  assert.ok(columns.fulfilledAt);
  assert.ok(columns.reversedAt);
  assert.ok(columns.reversalReferenceId);

  const config = getTableConfig(schema.unmetDemandFulfillments);
  const indexNames = config.indexes.map((idx) => idx.config.name);
  assert.ok(indexNames.includes('unmet_fulfill_company_idx'));
  assert.ok(indexNames.includes('unmet_fulfill_request_idx'));
  assert.ok(indexNames.includes('unmet_fulfill_sale_tx_idx'));
  assert.ok(indexNames.includes('unmet_fulfill_req_sale_line_idx'));

  const checkNames = config.checks.map((chk) => chk.name);
  assert.ok(checkNames.includes('unmet_fulfill_units_positive_chk'));
  assert.ok(checkNames.includes('unmet_fulfill_status_chk'));
});

test('Phase 2.4 — Migration and rollback SQL scripts are strictly additive, non-destructive, and cover all Phase 2 schema objects', () => {
  const migrationPath = path.join(
    process.cwd(),
    'drizzle',
    '0002_phase13_customer_demand_tracking_v2.sql'
  );
  const rollbackPath = path.join(
    process.cwd(),
    'drizzle',
    '0002_phase13_customer_demand_tracking_v2.rollback.sql'
  );

  assert.ok(fs.existsSync(migrationPath), 'Migration SQL file must exist');
  assert.ok(fs.existsSync(rollbackPath), 'Rollback SQL file must exist');

  const migrationSql = fs.readFileSync(migrationPath, 'utf-8');
  const rollbackSql = fs.readFileSync(rollbackPath, 'utf-8');

  const stripSqlComments = (sqlText: string) =>
    sqlText
      .split('\n')
      .filter((line) => !line.trim().startsWith('--'))
      .join('\n');

  const executableMigrationSql = stripSqlComments(migrationSql);
  const executableRollbackSql = stripSqlComments(rollbackSql);

  // Verify zero destructive statements in forward migration
  assert.equal(
    /DROP\s+TABLE/i.test(executableMigrationSql),
    false,
    'Forward migration must never DROP TABLE'
  );
  assert.equal(
    /TRUNCATE/i.test(executableMigrationSql),
    false,
    'Forward migration must never TRUNCATE'
  );
  assert.equal(
    /DELETE\s+FROM/i.test(executableMigrationSql),
    false,
    'Forward migration must never DELETE FROM'
  );

  // Verify additive objects in forward migration
  assert.ok(migrationSql.includes('ADD COLUMN IF NOT EXISTS "catalog_lifecycle_status"'));
  assert.ok(migrationSql.includes('ADD COLUMN IF NOT EXISTS "fulfilled_base_units"'));
  assert.ok(migrationSql.includes('ADD COLUMN IF NOT EXISTS "remaining_unfulfilled_base_units"'));
  assert.ok(migrationSql.includes('CREATE TABLE IF NOT EXISTS "unmet_demand_fulfillments"'));
  assert.ok(migrationSql.includes('unmet_demand_fulfilled_bounds_chk'));
  assert.ok(migrationSql.includes('unmet_fulfill_req_sale_line_idx'));

  // Verify rollback only drops Phase 13 additive objects and never drops operational tables
  assert.ok(rollbackSql.includes('DROP TABLE IF EXISTS "unmet_demand_fulfillments"'));
  assert.equal(
    /DROP\s+TABLE\s+IF\s+EXISTS\s+"(products|sales|sale_items|unmet_demand_requests|stock_movements|accounts|journal_entries)"/i.test(
      rollbackSql
    ),
    false,
    'Rollback script must never drop pre-existing operational tables'
  );
});
