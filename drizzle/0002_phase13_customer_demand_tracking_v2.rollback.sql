-- Phase 13 (Phase 2 of Validated Customer Demand Tracking v2):
-- Rollback Script for 0002_phase13_customer_demand_tracking_v2.sql
-- Removes only the additive unmet_demand_fulfillments table, new indexes, and new Phase 13 columns/constraints.
-- Zero destructive impact on pre-existing operational sales, inventory, accounting, or Phase 10 unmet demand records.

-- 1. Drop additive "unmet_demand_fulfillments" indexes and table
DROP INDEX IF EXISTS "unmet_fulfill_req_sale_line_idx";
DROP INDEX IF EXISTS "unmet_fulfill_sale_tx_idx";
DROP INDEX IF EXISTS "unmet_fulfill_request_idx";
DROP INDEX IF EXISTS "unmet_fulfill_company_idx";
DROP TABLE IF EXISTS "unmet_demand_fulfillments";

-- 2. Revert additive indexes and constraints on "unmet_demand_requests"
DROP INDEX IF EXISTS "unmet_demand_fulfillment_status_idx";
DROP INDEX IF EXISTS "unmet_demand_company_branch_time_idx";

ALTER TABLE "unmet_demand_requests"
  DROP CONSTRAINT IF EXISTS "unmet_demand_fulfilled_bounds_chk",
  DROP CONSTRAINT IF EXISTS "unmet_demand_fulfillment_status_chk",
  DROP CONSTRAINT IF EXISTS "unmet_demand_availability_status_chk";

ALTER TABLE "unmet_demand_requests"
  DROP COLUMN IF EXISTS "last_fulfilled_at",
  DROP COLUMN IF EXISTS "substitute_product_id",
  DROP COLUMN IF EXISTS "expired_batch_date",
  DROP COLUMN IF EXISTS "expired_batch_number",
  DROP COLUMN IF EXISTS "expired_units_observed",
  DROP COLUMN IF EXISTS "remaining_unfulfilled_base_units",
  DROP COLUMN IF EXISTS "fulfilled_base_units";

-- 3. Revert additive lifecycle index, constraint, and columns on "products"
DROP INDEX IF EXISTS "product_lifecycle_idx";

ALTER TABLE "products"
  DROP CONSTRAINT IF EXISTS "product_catalog_lifecycle_chk",
  DROP COLUMN IF EXISTS "replacement_product_id",
  DROP COLUMN IF EXISTS "discontinued_reason",
  DROP COLUMN IF EXISTS "discontinued_at",
  DROP COLUMN IF EXISTS "catalog_lifecycle_status";
