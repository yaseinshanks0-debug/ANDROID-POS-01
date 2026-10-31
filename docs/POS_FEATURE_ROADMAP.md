# Modern Android POS — Enterprise Retail System Evolution Roadmap
**Document**: `docs/POS_FEATURE_ROADMAP.md`  
**System Status**: Connected to Cloud SQL PostgreSQL 16 (`ai-studio-82cc08b7`), Drizzle ORM, Node.js/Express, React 19 + Capacitor 8  
**Live Baseline**: 19 schema tables, 41 verified product records in database, 18 automated unit & DB integration tests passing  

---

## 1. Executive Summary & Architecture Baseline

The objective of this initiative is to evolve the existing modern Android POS application from a localized point-of-sale terminal into an enterprise-grade, customizable retail and inventory management platform. 

### 1.1 Current Architecture Verified
- **Frontend**: React 19, TypeScript 5.8+, Vite 8, Tailwind CSS 4, Motion, Lucide icons, Dqnamo Kitchen tactile UX components (`TactileButton`, `DynamicButton`, `HoldToConfirm`, `ScrambleText`, `AppModal`).
- **Backend API**: Node.js and Express (`server.ts`) running unified with Vite middleware in development and serving static production assets.
- **Database Engine**: Google Cloud SQL PostgreSQL 16 with SSL enabled, managed through `pg.Pool` connection pooling (`src/db/index.ts`).
- **ORM & Migrations**: Drizzle ORM (`drizzle-orm`, `drizzle-kit`) with declarative schema definitions (`src/db/schema.ts`).
- **Mobile Container**: Capacitor 8 with native Android configuration, hardware back-button intercept, status bar styling, and haptic feedback.
- **Test Baseline**: 18 automated tests passing across calculation logic (`pos-calculations.test.ts`), inventory rules (`inventory-rules.test.ts`), and live database CRUD (`products-repo.test.ts`).

---

## 2. Comprehensive Gap Analysis Across All 10 Domains

The following matrix contrasts the current state of the codebase against target enterprise requirements across all 10 feature areas.

| Domain | Feature Area | Current State | Target Enterprise State | Gap Severity |
| :--- | :--- | :--- | :--- | :--- |
| **A** | **Barcodes** | Single unique `barcode` column on `products` table | 1-to-many `product_barcodes` table supporting primary/secondary/pack barcodes with global uniqueness | High |
| **A** | **Units of Measure (UOM)** | Single integer `stock` with no unit semantics | Configurable UOMs (`units_of_measure`), conversion factors (e.g., 1 Box = 24 Pieces), fractional and wholesale sales | High |
| **A** | **Custom Fields & Variants** | Hardcoded product columns only | Dynamic schema-free attributes via JSONB `custom_fields` + parent-variant matrix relationships | Medium |
| **A** | **Product Media** | Emoji and hex color only; no image persistence in DB | Product image URLs, thumbnail previews, and barcode labels | Low |
| **B** | **Accounting Base Currency** | Defaults to `USD` in store settings; fixed enum in frontend | Default accounting currency set to **SDG (Sudanese Pound)** across all financial ledgers | Critical |
| **B** | **Exchange Rates** | No exchange rate tracking; all records store single raw numbers | `currencies` and `exchange_rates` tables with historical rate freezing per transaction | High |
| **B** | **Multi-Currency POS** | Prices displayed only in single active store currency | Dual display (Foreign Currency + Base SDG equivalent) and real-time converted tender calculations | Medium |
| **C** | **Payment Methods** | Cash, Card, QR/NFC only | Added Bank Transfer & Mobile Money (Bankak, Faisal, Omdurman, etc.) with bank account tracking | High |
| **C** | **Split Payments** | UI and backend process only 1 payment method per transaction | Multi-leg payments per invoice (e.g., 60% Cash + 40% Bankak) with individual receipts | High |
| **C** | **Payment Proofs** | Single optional text `reference` field on `payments` table | Bank name, transaction reference, sender name, verification status, and proof attachment URL | Medium |
| **D** | **Camera Barcode Scan** | Video stream renders with animated line; no actual barcode decoder | Real-time decoding via `BarcodeDetector` API / canvas decoder for EAN-13, UPC, QR | High |
| **D** | **Continuous Scanning** | Modal automatically dismisses after single item scan | Continuous scan mode keeping camera alive with rapid audio chime and cart badge counter | Medium |
| **D** | **Hardware Barcode Wedges** | Manual input field focus required | Global `useHardwareScanner` hook intercepting USB/Bluetooth keystroke wedge scans ending in Enter | Medium |
| **E** | **Store Branding** | Basic store name and address in `store_settings` | Custom logo URL, receipt header image, custom footer notices, tax registration display | Low |
| **E** | **Receipt Templates** | Hardcoded thermal receipt modal | JSONB `receipt_config` toggles (show logo, show tax, show loyalty, paper width 58mm/80mm, QR code) | Medium |
| **E** | **Theme & Density** | Dark theme with light toggle; fixed 3-column product grid | Theme accent color selector and POS item grid density (compact, standard, spacious) | Low |
| **F** | **RBAC Roles & Users** | `roles` and `users` tables exist in schema but have 0 rows; no auth | Pre-seeded roles (Admin, Manager, Cashier) with PIN-based terminal authentication | High |
| **F** | **Granular Permissions** | No permission checks; all operations unrestricted | Role permission guards on price override, discount thresholds, invoice voiding, and cost viewing | High |
| **F** | **Multi-Branch Stock** | `products.stock` is a single integer shared across all branches | `branch_inventory` table isolating stock levels by branch with inter-branch transfer workflows | High |
| **G** | **Purchase Orders** | `purchases` and `purchase_items` tables exist with 0 rows; no API/UI | Full PO lifecycle (Draft, Ordered, Partially Received, Received, Cancelled) with supplier link | High |
| **G** | **Inbound Receiving** | Stock manually adjusted without receiving verification | Formal receiving inspection recording accepted, damaged, and rejected quantities | High |
| **G** | **Cost Averaging** | Static `costPrice` on product; no recalculation on restock | Weighted Moving Average Cost (MAC) auto-recalculated on inbound receiving | Medium |
| **H** | **Operating Expenses** | No expense tracking in database or UI | `expenses` and `expense_categories` tables with payment method, branch, and receipts | High |
| **H** | **Account Statements** | Customers only track `totalSpent`; suppliers have no ledger | Customer credit/debt accounts (receivables) and supplier payables ledger with statement exports | High |
| **I** | **Financial Reporting** | In-memory client calculations on local storage transactions | Server-side SQL aggregations for Sales by period, Category breakdowns, and Top-moving products | High |
| **I** | **Profit & Loss (P&L)** | Missing | Full P&L statement: Gross Sales - Discounts - COGS - Expenses = Net Operating Profit in SDG | High |
| **I** | **Shift Cash Reports** | Missing | X-Report (interim reading) and Z-Report (end-of-shift reconciliation with cash drawer variance) | High |
| **I** | **Data Export** | Missing | CSV/Excel tabular export and printable PDF formatted reports | Medium |
| **J** | **Item-Level Returns** | Only whole-sale void exists; returns tables have 0 rows | Return specific line items with reason codes and routing to restock or damage write-off | High |
| **J** | **Stocktaking & Audits** | Ad-hoc single item adjustment only | Structured stocktake sessions with system count vs physical count vs discrepancy adjustments | High |
| **J** | **Batch & Expiry Tracking** | No batch tracking in database | `product_batches` table with batch numbers, expiry dates, FIFO depletion, and expiry alerts | Medium |
| **J** | **Shift Sessions** | No cashier drawer sessions | `shifts` table tracking opening cash, cash sales, drop cash, counted cash, and variance | High |
| **J** | **Offline Synchronization** | LocalStorage fallback only; `syncTransactions` is an empty stub | IndexedDB transactional offline queue, auto-sync upon reconnection, idempotency keys | High |

---

## 3. Data Risks & Mitigation Strategy

To satisfy the strict requirement of **preserving existing architecture, avoiding dropped tables, and safeguarding the 41 live product rows**, the following engineering safeguards are established:

### 3.1 Non-Destructive DDL & Migrations
1. **Never Drop Columns or Tables**: All schema modifications are strictly additive (`ADD COLUMN ... DEFAULT ...` or creating new normalized tables).
2. **Multi-Barcode Backward Compatibility**: 
   - When introducing the `product_barcodes` table, existing records in `products.barcode` will be retained and automatically backfilled as primary barcodes in `product_barcodes`.
   - The original `products.barcode` column remains as the primary fallback so existing queries and tests never break.
3. **Multi-Currency Historical Preservation**:
   - Every historical sale and financial line will record `currency_code`, `exchange_rate_to_base`, and `base_amount`.
   - Historical reports will **never** multiply past sales by current exchange rates; historical rates are frozen at transaction creation.
4. **PostgreSQL Currency Precision**:
   - All monetary figures must use `numeric(14, 2)` or `numeric(12, 2)`.
   - Exchange rates must use high precision `numeric(16, 6)` to prevent rounding drift when converting between SDG and USD/SAR.

### 3.2 Concurrency & Checkout Integrity
1. **At-Most-Once Checkout Execution**:
   - The unique constraint `sales_idempotency_key_unique` on `sales.idempotency_key` is strictly enforced.
   - When offline sales sync to the server, replay requests with matching idempotency keys return the existing record without deducting inventory a second time.
2. **Atomic Inventory Operations**:
   - Stock deductions during sales checkout must execute within an explicit PostgreSQL ACID transaction (`db.transaction(...)`).
   - Use atomic conditional updates:
     ```sql
     UPDATE products 
     SET stock = stock - $1, updated_at = NOW() 
     WHERE id = $2 AND stock >= $1 
     RETURNING stock;
     ```
   - If stock is insufficient, the transaction rolls back cleanly with a descriptive error.

### 3.3 Zero Secret Exposure
- PostgreSQL credentials (`PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `DATABASE_URL`) are strictly restricted to the Node.js Express process (`server.ts`, `src/db/`).
- The client-side Vite bundle receives zero database credentials; all operations occur through authenticated REST endpoints (`/api/*`).

---

## 4. Phased Implementation Roadmap

The evolution is structured into 6 logical, non-disruptive phases. Each phase has clear prerequisites, independent deliverables, and explicit verification criteria.

```
┌────────────────────────────────────────────────────────┐
│ Phase 1: Foundational Financials, UOM & Products       │
│ - SDG Base Currency & Exchange Rates                   │
│ - Multiple Barcodes & Units of Measure (UOM)           │
│ - Custom Product Fields (JSONB) & Product Images       │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ Phase 2: Transaction Engine, Split Payments & Scanner  │
│ - Atomic Server-Side Sales Checkout (/api/sales)       │
│ - Split Payments (Cash + Bankak + Card) & Proofs       │
│ - Continuous Camera Barcode Decoder & Hardware Wedge   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ Phase 3: Shifts, Returns & Structured Stock Auditing   │
│ - Cash Drawer Shift Sessions (Open / Close / Variance) │
│ - Line-Item Returns & Restock / Damage Routing         │
│ - Formal Stocktake Sessions with Discrepancy Log       │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ Phase 4: Purchasing, Inbound Receiving & Cost Average  │
│ - Purchase Order Lifecycle & Supplier Invoicing        │
│ - Inbound Inspection (Accepted / Damaged / Rejected)   │
│ - Weighted Moving Average Cost (MAC) Engine            │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ Phase 5: Expenses & Customer/Supplier Ledgers          │
│ - Operational Expense Tracking with Receipts           │
│ - Customer Credit Accounts & Receivables Ledger        │
│ - Supplier Payables Ledger & Account Statements        │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ Phase 6: RBAC, Multi-Branch & Enterprise Reporting     │
│ - Roles & Permissions with Cashier PIN Authentication  │
│ - Multi-Branch Inventory Isolation & Transfers         │
│ - P&L Statements, COGS, Shift Reports, CSV/PDF Export  │
│ - Dynamic Branding & Receipt Template Customization    │
└────────────────────────────────────────────────────────┘
```

---

### Phase 1: Foundational Financials, UOM & Product Enhancements
*Goal: Establish the multi-currency accounting engine with SDG base, multi-barcode support, UOMs, and dynamic product attributes without breaking existing catalog operations.*

1. **Database Schema Enhancements**:
   - `currencies`: Code (`SDG`, `USD`, `SAR`, `AED`, `EUR`, `GBP`), name, symbol, decimals, `is_base` (SDG = true).
   - `exchange_rates`: Currency pairing, rate to base SDG, effective date.
   - `units_of_measure`: Code (`PCS`, `BOX`, `KG`, `LTR`), name, conversion factor relative to base unit.
   - `product_barcodes`: `product_id`, `barcode` (unique), `barcode_type`, `is_primary`.
   - `products` columns: `uom_id`, `image_url`, `custom_fields` (JSONB).
   - `store_settings`: Default `currency` updated to `'SDG'`.
2. **Backend Repositories & Routes**:
   - `/api/currencies` & `/api/exchange-rates`: CRUD for currency exchange rates.
   - `/api/uom`: Units of measure definitions.
   - Update `products-repo.ts`: Support searching products by any associated barcode in `product_barcodes`, save custom fields.
3. **Frontend Integration**:
   - Currency switcher in POS settings and checkout.
   - Product edit modal with multi-barcode list, UOM selector, and custom field editor.
4. **Verification**:
   - Unit tests for UOM conversion calculations.
   - Integration test verifying a product is found whether scanning primary or secondary barcode.
   - Confirm all 41 existing products remain intact with working primary barcodes.

---

### Phase 2: Transaction Engine, Split Payments & Advanced Scanning
*Goal: Move POS checkout to server-side ACID transactions, support split payments with bank transfer proofs, and implement continuous/hardware barcode scanning.*

1. **Database Schema Enhancements**:
   - `sales`: Add `base_currency_amount`, `exchange_rate_to_base`, `currency_code`.
   - `payments`: Add `currency_code`, `exchange_rate_to_base`, `base_amount`, `bank_name`, `transfer_reference`, `sender_name`, `proof_url`.
2. **Backend API**:
   - `POST /api/sales`: Atomic checkout handling item lines, multi-leg payments, inventory deduction, and customer loyalty within a single PostgreSQL transaction.
   - `GET /api/sales`: Paginated sale list with item details, payment legs, and search filters.
3. **Frontend Implementation**:
   - Split Payment Modal: Allow cashier to enter multiple payment legs (e.g. 5,000 SDG Cash + 15,000 SDG Bankak transfer with screenshot attachment or transaction number).
   - Camera Barcode Decoder: Integrate `BarcodeDetector` with live video stream, continuous scanning toggle, and rapid audio chime.
   - Hardware Scanner Hook (`useHardwareScanner`): Listen for rapid HID keyboard wedge scan inputs across the app and append directly to cart.
4. **Verification**:
   - Concurrency test: Ensure simultaneous checkouts on the same product cannot oversell inventory.
   - Idempotency test: Verify re-posting the same transaction does not duplicate payments or inventory deductions.
   - Split payment test: Verify total payment legs equal invoice grand total.

---

### Phase 3: Shifts, Returns & Structured Stock Auditing
*Goal: Provide complete cashier drawer control, item-level return processing, and variance-tracked stock audits.*

1. **Database Schema Enhancements**:
   - `shifts`: `id`, `user_id`, `branch_id`, `opened_at`, `closed_at`, `opening_cash`, `cash_sales`, `cash_returns`, `expected_cash`, `actual_cash`, `variance`, `notes`, `status` (`open`, `closed`).
   - `return_items`: Add `action` (`restock`, `damage_writeoff`), `condition`, `restocked_stock_movement_id`.
   - `stocktakes` & `stocktake_items`: Stocktake audit sessions with expected stock, counted stock, discrepancy, and approval.
2. **Backend API**:
   - `/api/shifts`: Open shift, get current shift status, close shift with cash count reconciliation (Z-report).
   - `/api/returns`: Process partial or full order returns with automatic inventory restocking or damage marking.
   - `/api/stocktakes`: Create count session, submit counts, apply inventory adjustments.
3. **Frontend Implementation**:
   - Shift modal on POS login and checkout.
   - "Return / Refund" screen with invoice search and item selector.
   - Stocktake count interface with quick barcode scanner entry.
4. **Verification**:
   - Shift reconciliation math test (Opening + Cash Sales - Cash Returns = Expected).
   - Return inventory test: Restocked items increase inventory; damage write-offs log damage movement without increasing sellable stock.

---

### Phase 4: Purchasing, Inbound Receiving & Cost Averaging
*Goal: Implement supplier procurement, inbound verification, and automatic weighted average cost updates.*

1. **Database Schema Enhancements**:
   - `purchases`: Expand statuses (`draft`, `ordered`, `partially_received`, `received`, `cancelled`). Add `currency_code`, `exchange_rate`, `base_amount`.
   - `purchase_items`: Add `received_quantity`, `damaged_quantity`, `rejected_quantity`, `batch_number`, `expiry_date`.
2. **Backend API & Business Logic**:
   - `POST /api/purchases`: Create PO.
   - `POST /api/purchases/:id/receive`: Receive delivery, record accepted vs rejected items, increment stock levels, and update `products.costPrice` via Moving Average Cost formula:
     $$\text{New Cost} = \frac{(\text{Current Stock} \times \text{Current Cost}) + (\text{Received Qty} \times \text{Unit Cost})}{\text{Current Stock} + \text{Received Qty}}$$
3. **Frontend Implementation**:
   - Purchases tab: PO creation, status tracking, and supplier selection.
   - Inbound Receiving Modal: Line-by-line count verification with damage logging.
4. **Verification**:
   - Unit tests for Moving Average Cost calculation under various stock and cost scenarios.
   - Test verifying inbound stock updates `stock_movements` with type `restock`.

---

### Phase 5: Operational Expenses & Account Statements
*Goal: Provide full operational expense logging and customer/supplier balance ledgers.*

1. **Database Schema Enhancements**:
   - `expense_categories`: `id`, `name`, `name_ar`, `code`, `is_active`.
   - `expenses`: `id`, `branch_id`, `category_id`, `amount`, `currency_code`, `exchange_rate_to_base`, `base_amount`, `payment_method`, `reference`, `proof_url`, `notes`, `created_by`, `created_at`.
   - `customer_accounts`: Credit limit, outstanding balance, credit status.
   - `customer_transactions`: Ledger entries for credit sales, payments received, and running balance.
   - `supplier_transactions`: Ledger entries for purchase invoices, payments to suppliers, and running balance.
2. **Backend API**:
   - `/api/expenses`: CRUD for operational expenses.
   - `/api/customers/:id/statement`: Running account statement with date range filtering.
   - `/api/suppliers/:id/statement`: Supplier payables statement.
3. **Frontend Implementation**:
   - Expenses management screen with category breakdown.
   - Customer and Supplier profile tabs showing statement ledger and "Record Payment" modal.
4. **Verification**:
   - Test calculating customer ledger running balance across credit sales and repayments.
   - Test verifying expense recording deducts from net profit calculations.

---

### Phase 6: RBAC, Multi-Branch, Advanced Analytics & Branding
*Goal: Implement fine-grained access control, multi-branch inventory isolation, P&L reporting, and customizable receipt branding.*

1. **Database Schema Enhancements**:
   - `branch_inventory`: `branch_id`, `product_id`, `stock`, `min_alert`, `shelf_location`.
   - `store_settings`: `logo_url`, `receipt_header_url`, `receipt_config` (JSONB), `theme_config` (JSONB).
2. **RBAC & Auth Implementation**:
   - Seed default roles: `admin` (all), `manager` (discounts, voids, reports, inventory), `cashier` (sales, returns with approval, shift).
   - Cashier PIN authentication modal and active session switcher in header.
   - Permission middleware verifying tokens/PIN credentials for privileged actions (price override, void, export).
3. **Enterprise Analytics & Export**:
   - Backend analytical queries: P&L (Gross Revenue - Cost of Goods Sold - Operating Expenses), Top 10 Fast-Moving Products, Low-Stock Alerts, Inventory Valuation (Cost vs Retail).
   - Export service: CSV/Excel export and thermal/A4 printable receipts and reports.
   - Receipt designer: Live preview showing customizable toggles (logo, tax breakdown, barcode, custom footer).
4. **Verification**:
   - Role guard tests: Cashier denied permission to access settings or delete products without manager PIN.
   - Financial P&L accuracy verification against sample sales and expense data.

---

## 5. Safe Order of Execution & Dependency Flow

```
[Phase 1: DB Schema & Multi-Currency] ➔ [Phase 2: Transactions & Split Payments]
                 │                                        │
                 ▼                                        ▼
   [Phase 4: Purchasing & Cost Avg]        [Phase 3: Shifts, Returns & Audits]
                 │                                        │
                 ▼                                        ▼
   [Phase 5: Expenses & Ledgers]           [Phase 6: RBAC, Multi-Branch & P&L]
```

### Immediate Next Step
With the audit complete and roadmap approved, execution begins with **Phase 1**:
1. Incrementally update `src/db/schema.ts` to add multi-currency (SDG base), multi-barcodes, UOMs, and custom fields without dropping existing columns.
2. Generate and apply incremental Drizzle migration safely to Cloud SQL.
3. Seed `SDG` base currency and default exchange rates.
4. Update `products-repo.ts` and API endpoints.
5. Verify all existing 18 tests and catalog data remain 100% operational.
