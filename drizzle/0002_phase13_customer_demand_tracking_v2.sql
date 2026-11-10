-- Phase 13 (Phase 2 of Validated Customer Demand Tracking v2):
-- Additive Migration for Catalog Lifecycle, Batch-Aware Unmet Demand, and Sale-Linked Fulfillments
-- STATUS: PREPARED FOR APPROVAL ONLY — DO NOT EXECUTE AUTOMATICALLY WITHOUT BACKUP VERIFICATION
-- Protection Guarantee: Strictly additive (ADD COLUMN IF NOT EXISTS / CREATE TABLE IF NOT EXISTS / CREATE INDEX IF NOT EXISTS).
-- Does not drop, truncate, or destructively alter any existing operational table or record.

-- 1. Additive Catalog Lifecycle Columns on "products"
-- Ensures inactive products (is_active = false) are NEVER automatically classified as DISCONTINUED.
ALTER TABLE "products"
  ADD COLUMN IF NOT EXISTS "catalog_lifecycle_status" text DEFAULT 'ACTIVE' NOT NULL,
  ADD COLUMN IF NOT EXISTS "discontinued_at" timestamp,
  ADD COLUMN IF NOT EXISTS "discontinued_reason" text,
  ADD COLUMN IF NOT EXISTS "replacement_product_id" text;

-- Backfill any existing inactive products without an explicit lifecycle status to 'TEMPORARILY_PAUSED' (never 'DISCONTINUED')
UPDATE "products"
SET "catalog_lifecycle_status" = 'TEMPORARILY_PAUSED'
WHERE "is_active" = false AND "catalog_lifecycle_status" = 'ACTIVE';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'product_catalog_lifecycle_chk'
  ) THEN
    ALTER TABLE "products"
      ADD CONSTRAINT "product_catalog_lifecycle_chk"
      CHECK ("catalog_lifecycle_status" IN ('ACTIVE', 'TEMPORARILY_PAUSED', 'DISCONTINUED'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "product_lifecycle_idx"
  ON "products" ("company_id", "catalog_lifecycle_status");

-- 2. Additive Columns on "unmet_demand_requests"
ALTER TABLE "unmet_demand_requests"
  ADD COLUMN IF NOT EXISTS "company_id" text DEFAULT 'comp-default' NOT NULL,
  ADD COLUMN IF NOT EXISTS "fulfilled_base_units" integer DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS "remaining_unfulfilled_base_units" integer DEFAULT 1 NOT NULL,
  ADD COLUMN IF NOT EXISTS "expired_units_observed" integer,
  ADD COLUMN IF NOT EXISTS "expired_batch_number" text,
  ADD COLUMN IF NOT EXISTS "expired_batch_date" timestamp,
  ADD COLUMN IF NOT EXISTS "substitute_product_id" text REFERENCES "products"("id") ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS "last_fulfilled_at" timestamp;

-- Backfill remaining_unfulfilled_base_units and fulfilled_base_units for existing rows so bounds check holds
UPDATE "unmet_demand_requests"
SET
  "fulfilled_base_units" = CASE
    WHEN "fulfillment_status" = 'fulfilled_later' THEN "requested_base_units"
    ELSE LEAST(GREATEST("fulfilled_base_units", 0), "requested_base_units")
  END,
  "remaining_unfulfilled_base_units" = CASE
    WHEN "fulfillment_status" = 'fulfilled_later' THEN 0
    ELSE "requested_base_units" - LEAST(GREATEST("fulfilled_base_units", 0), "requested_base_units")
  END;

-- Expand check constraints on "unmet_demand_requests" to support all 8 canonical reasons + legacy aliases + partial fulfillment
ALTER TABLE "unmet_demand_requests"
  DROP CONSTRAINT IF EXISTS "unmet_demand_reason_valid_chk";

ALTER TABLE "unmet_demand_requests"
  ADD CONSTRAINT "unmet_demand_reason_valid_chk"
  CHECK (
    "unavailability_reason" IN (
      'OUT_OF_STOCK',
      'INSUFFICIENT_STOCK',
      'EXPIRED_STOCK',
      'DISCONTINUED',
      'NOT_IN_CATALOG',
      'TEMPORARILY_UNAVAILABLE',
      'PRICE_OR_PACK_MISMATCH',
      'OTHER',
      'EXPIRED',
      'NOT_STOCKED'
    )
  );

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unmet_demand_availability_status_chk'
  ) THEN
    ALTER TABLE "unmet_demand_requests"
      ADD CONSTRAINT "unmet_demand_availability_status_chk"
      CHECK (
        "availability_status" IN (
          'OUT_OF_STOCK',
          'LOW_STOCK',
          'EXPIRED',
          'DISCONTINUED',
          'NOT_STOCKED',
          'TEMPORARILY_UNAVAILABLE'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unmet_demand_fulfillment_status_chk'
  ) THEN
    ALTER TABLE "unmet_demand_requests"
      ADD CONSTRAINT "unmet_demand_fulfillment_status_chk"
      CHECK (
        "fulfillment_status" IN (
          'unfulfilled',
          'partially_fulfilled',
          'fulfilled_later',
          'cancelled'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unmet_demand_fulfilled_bounds_chk'
  ) THEN
    ALTER TABLE "unmet_demand_requests"
      ADD CONSTRAINT "unmet_demand_fulfilled_bounds_chk"
      CHECK (
        "fulfilled_base_units" >= 0
        AND "fulfilled_base_units" <= "requested_base_units"
        AND "remaining_unfulfilled_base_units" = ("requested_base_units" - "fulfilled_base_units")
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "unmet_demand_company_idx"
  ON "unmet_demand_requests" ("company_id");

CREATE INDEX IF NOT EXISTS "unmet_demand_company_branch_time_idx"
  ON "unmet_demand_requests" ("company_id", "branch_id", "requested_timestamp" DESC);

CREATE INDEX IF NOT EXISTS "unmet_demand_fulfillment_status_idx"
  ON "unmet_demand_requests" ("company_id", "fulfillment_status");

-- 3. New Additive Table "unmet_demand_fulfillments" for Verifiable Sale-Linked Fulfillment & Partial Fulfillment
CREATE TABLE IF NOT EXISTS "unmet_demand_fulfillments" (
  "id" text PRIMARY KEY NOT NULL,
  "company_id" text DEFAULT 'comp-default' NOT NULL,
  "request_id" text NOT NULL REFERENCES "unmet_demand_requests"("id") ON DELETE RESTRICT,
  "sale_id" text REFERENCES "sales"("id") ON DELETE SET NULL,
  "sale_transaction_id" text NOT NULL,
  "sale_item_id" text REFERENCES "sale_items"("id") ON DELETE SET NULL,
  "sale_line_index" integer DEFAULT 0 NOT NULL,
  "branch_id" text REFERENCES "branches"("id") ON DELETE SET NULL,
  "product_id" text NOT NULL REFERENCES "products"("id") ON DELETE SET NULL,
  "fulfilled_base_units" integer NOT NULL,
  "status" text DEFAULT 'active' NOT NULL,
  "fulfilled_at" timestamp DEFAULT now() NOT NULL,
  "reversed_at" timestamp,
  "reversal_reference_id" text,
  "recorded_by_user_id" text REFERENCES "users"("id") ON DELETE SET NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "unmet_fulfill_units_positive_chk" CHECK ("fulfilled_base_units" > 0),
  CONSTRAINT "unmet_fulfill_status_chk" CHECK (
    "status" IN ('active', 'reversed_by_void', 'reversed_by_return')
  )
);

CREATE INDEX IF NOT EXISTS "unmet_fulfill_company_idx"
  ON "unmet_demand_fulfillments" ("company_id");

CREATE INDEX IF NOT EXISTS "unmet_fulfill_request_idx"
  ON "unmet_demand_fulfillments" ("request_id", "status");

CREATE INDEX IF NOT EXISTS "unmet_fulfill_sale_tx_idx"
  ON "unmet_demand_fulfillments" ("sale_transaction_id");

CREATE UNIQUE INDEX IF NOT EXISTS "unmet_fulfill_req_sale_line_idx"
  ON "unmet_demand_fulfillments" ("request_id", "sale_transaction_id", "sale_line_index");
