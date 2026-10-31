/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from './index.ts';
import {
  currencies,
  exchangeRates,
  unitsOfMeasure,
  productBarcodes,
  customFieldDefinitions,
  storeSettings,
  products,
} from './schema.ts';
import { eq, sql } from 'drizzle-orm';

export async function runPhase1Seed() {
  if (!db) {
    throw new Error('Database connection not available.');
  }

  console.log('Starting Phase 1 Seed...');

  // 1. Seed Currencies (SDG as Base Currency)
  const initialCurrencies = [
    {
      code: 'SDG',
      name: 'Sudanese Pound',
      nameAr: 'جنيه سوداني',
      symbol: 'ج.س',
      decimalPlaces: 2,
      isBase: true,
      isActive: true,
    },
    {
      code: 'USD',
      name: 'US Dollar',
      nameAr: 'دولار أمريكي',
      symbol: '$',
      decimalPlaces: 2,
      isBase: false,
      isActive: true,
    },
    {
      code: 'SAR',
      name: 'Saudi Riyal',
      nameAr: 'ريال سعودي',
      symbol: 'ر.س',
      decimalPlaces: 2,
      isBase: false,
      isActive: true,
    },
    {
      code: 'AED',
      name: 'UAE Dirham',
      nameAr: 'درهم إماراتي',
      symbol: 'د.إ',
      decimalPlaces: 2,
      isBase: false,
      isActive: true,
    },
    {
      code: 'EUR',
      name: 'Euro',
      nameAr: 'يورو',
      symbol: '€',
      decimalPlaces: 2,
      isBase: false,
      isActive: true,
    },
    {
      code: 'GBP',
      name: 'British Pound',
      nameAr: 'جنيه إسترليني',
      symbol: '£',
      decimalPlaces: 2,
      isBase: false,
      isActive: true,
    },
  ];

  for (const c of initialCurrencies) {
    await db.insert(currencies).values(c).onConflictDoNothing();
  }
  console.log('✓ Currencies seeded (SDG base currency active).');

  // 2. Update store_settings currency to SDG
  const existingSettings = await db.select().from(storeSettings).where(eq(storeSettings.id, 'default'));
  if (existingSettings.length > 0) {
    await db
      .update(storeSettings)
      .set({ currency: 'SDG', updatedAt: new Date() })
      .where(eq(storeSettings.id, 'default'));
  } else {
    await db.insert(storeSettings).values({
      id: 'default',
      storeName: 'Dqnamo Artisan Roasters & Deli',
      storeNameAr: 'محمصة ومخبز دينامو الحرفي',
      currency: 'SDG',
      taxRatePercent: '8.50',
      isTaxInclusive: false,
      updatedAt: new Date(),
    }).onConflictDoNothing();
  }
  console.log('✓ Store settings configured with default currency SDG.');

  // 3. Seed Exchange Rates (Rates to SDG Base Currency)
  const initialRates = [
    {
      id: 'rate-usd-sdg-initial',
      sourceCurrency: 'USD',
      targetCurrency: 'SDG',
      rate: '2700.000000',
      effectiveFrom: new Date('2026-01-01T00:00:00Z'),
      isActive: true,
      createdBy: 'system_init',
    },
    {
      id: 'rate-sar-sdg-initial',
      sourceCurrency: 'SAR',
      targetCurrency: 'SDG',
      rate: '720.000000',
      effectiveFrom: new Date('2026-01-01T00:00:00Z'),
      isActive: true,
      createdBy: 'system_init',
    },
    {
      id: 'rate-aed-sdg-initial',
      sourceCurrency: 'AED',
      targetCurrency: 'SDG',
      rate: '735.000000',
      effectiveFrom: new Date('2026-01-01T00:00:00Z'),
      isActive: true,
      createdBy: 'system_init',
    },
    {
      id: 'rate-eur-sdg-initial',
      sourceCurrency: 'EUR',
      targetCurrency: 'SDG',
      rate: '2900.000000',
      effectiveFrom: new Date('2026-01-01T00:00:00Z'),
      isActive: true,
      createdBy: 'system_init',
    },
    {
      id: 'rate-gbp-sdg-initial',
      sourceCurrency: 'GBP',
      targetCurrency: 'SDG',
      rate: '3450.000000',
      effectiveFrom: new Date('2026-01-01T00:00:00Z'),
      isActive: true,
      createdBy: 'system_init',
    },
  ];

  for (const r of initialRates) {
    await db.insert(exchangeRates).values(r).onConflictDoNothing();
  }
  console.log('✓ Exchange rates seeded.');

  // 4. Seed Standard Units of Measure (UOM)
  const initialUoms = [
    {
      id: 'uom-pcs',
      code: 'PCS',
      name: 'Piece',
      nameAr: 'حبة / قطعة',
      dimension: 'count',
      isBaseUnit: true,
      isActive: true,
    },
    {
      id: 'uom-box',
      code: 'BOX',
      name: 'Box',
      nameAr: 'صندوق (كرتونة)',
      dimension: 'count',
      isBaseUnit: false,
      isActive: true,
    },
    {
      id: 'uom-ctn',
      code: 'CTN',
      name: 'Carton (Master)',
      nameAr: 'كرتون كبير',
      dimension: 'count',
      isBaseUnit: false,
      isActive: true,
    },
    {
      id: 'uom-kg',
      code: 'KG',
      name: 'Kilogram',
      nameAr: 'كيلوغرام',
      dimension: 'weight',
      isBaseUnit: true,
      isActive: true,
    },
    {
      id: 'uom-g',
      code: 'G',
      name: 'Gram',
      nameAr: 'غرام',
      dimension: 'weight',
      isBaseUnit: false,
      isActive: true,
    },
    {
      id: 'uom-ltr',
      code: 'LTR',
      name: 'Liter',
      nameAr: 'لتر',
      dimension: 'volume',
      isBaseUnit: true,
      isActive: true,
    },
    {
      id: 'uom-ml',
      code: 'ML',
      name: 'Milliliter',
      nameAr: 'ميليلتر',
      dimension: 'volume',
      isBaseUnit: false,
      isActive: true,
    },
  ];

  for (const u of initialUoms) {
    await db.insert(unitsOfMeasure).values(u).onConflictDoNothing();
  }
  console.log('✓ Units of Measure seeded.');

  // 5. Seed Dynamic Custom Field Definitions
  const initialCustomFields = [
    {
      id: 'cf-batch-number',
      name: 'batch_number',
      label: 'Batch / Lot Number',
      labelAr: 'رقم التشغيلة / الدفعة',
      dataType: 'text',
      description: 'Production batch code for inventory tracking and traceability',
      isRequired: false,
      isSearchable: true,
      showOnReceipt: false,
      showInList: true,
      displayOrder: 1,
      isActive: true,
    },
    {
      id: 'cf-expiry-date',
      name: 'expiry_date',
      label: 'Expiry Date',
      labelAr: 'تاريخ انتهاء الصلاحية',
      dataType: 'date',
      description: 'Product expiration date',
      isRequired: false,
      isSearchable: true,
      showOnReceipt: true,
      showInList: true,
      displayOrder: 2,
      isActive: true,
    },
    {
      id: 'cf-origin-country',
      name: 'origin_country',
      label: 'Country of Origin',
      labelAr: 'بلد المنشأ',
      dataType: 'dropdown',
      description: 'Country of manufacture or harvest',
      options: ['Sudan', 'Saudi Arabia', 'UAE', 'Egypt', 'Brazil', 'Ethiopia', 'Other'],
      isRequired: false,
      isSearchable: true,
      showOnReceipt: false,
      showInList: true,
      displayOrder: 3,
      isActive: true,
    },
    {
      id: 'cf-warranty-months',
      name: 'warranty_months',
      label: 'Warranty (Months)',
      labelAr: 'فترة الضمان (أشهر)',
      dataType: 'number',
      description: 'Manufacturer warranty period in months',
      validationRules: { min: 0, max: 120 },
      isRequired: false,
      isSearchable: false,
      showOnReceipt: true,
      showInList: false,
      displayOrder: 4,
      isActive: true,
    },
  ];

  for (const cf of initialCustomFields) {
    await db.insert(customFieldDefinitions).values(cf).onConflictDoNothing();
  }
  console.log('✓ Custom field definitions seeded.');

  // 6. Backfill existing product barcodes into product_barcodes table
  const allProducts = await db.select().from(products);
  let backfilledCount = 0;

  for (const p of allProducts) {
    if (p.barcode) {
      try {
        await db
          .insert(productBarcodes)
          .values({
            id: `pb-${p.id}-primary`,
            productId: p.id,
            barcode: p.barcode,
            barcodeType: 'CODE128',
            uomId: 'uom-pcs',
            isPrimary: true,
            isActive: true,
            notes: 'Backfilled from primary product barcode',
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          })
          .onConflictDoNothing();
        backfilledCount++;
      } catch (err) {
        // Barcode might already be backfilled
      }
    }

    // Also update base_uom_id if null
    if (!p.baseUomId) {
      await db
        .update(products)
        .set({ baseUomId: 'uom-pcs', defaultSellingUomId: 'uom-pcs' })
        .where(eq(products.id, p.id));
    }
  }

  console.log(`✓ Backfilled ${backfilledCount} product barcodes into product_barcodes.`);
  console.log('Phase 1 Seed completed successfully.');
}

if (process.argv[1]?.endsWith('seed-phase1.ts')) {
  runPhase1Seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Phase 1 Seed failed:', err);
      process.exit(1);
    });
}
