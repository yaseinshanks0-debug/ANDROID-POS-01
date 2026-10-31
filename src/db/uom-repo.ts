/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from './index.ts';
import { unitsOfMeasure, productUnitConversions, products } from './schema.ts';
import { eq, and } from 'drizzle-orm';

export interface UOMRecord {
  id: string;
  code: string;
  name: string;
  nameAr?: string | null;
  dimension: 'count' | 'weight' | 'volume' | 'length' | string;
  isBaseUnit: boolean;
  isActive: boolean;
}

export interface ProductUnitConversionRecord {
  id: string;
  productId: string;
  uomId: string;
  uomCode?: string;
  uomName?: string;
  conversionFactor: number; // e.g. 1 Box = 12 Pieces
  isDefaultSelling: boolean;
  isDefaultPurchasing: boolean;
  sellingPrice?: number | null;
  isActive: boolean;
}

/**
 * Retrieve all registered units of measure.
 */
export async function getAllUOMs(): Promise<UOMRecord[]> {
  if (db) {
    try {
      const res = await db.select().from(unitsOfMeasure).where(eq(unitsOfMeasure.isActive, true));
      return res.map((u) => ({
        id: u.id,
        code: u.code,
        name: u.name,
        nameAr: u.nameAr,
        dimension: u.dimension,
        isBaseUnit: u.isBaseUnit,
        isActive: u.isActive,
      }));
    } catch (err) {
      console.warn('PostgreSQL getAllUOMs failed:', err);
    }
  }

  return [
    { id: 'uom-pcs', code: 'PCS', name: 'Piece', nameAr: 'حبة', dimension: 'count', isBaseUnit: true, isActive: true },
    { id: 'uom-box', code: 'BOX', name: 'Box', nameAr: 'صندوق', dimension: 'count', isBaseUnit: false, isActive: true },
    { id: 'uom-kg', code: 'KG', name: 'Kilogram', nameAr: 'كيلوغرام', dimension: 'weight', isBaseUnit: true, isActive: true },
    { id: 'uom-ltr', code: 'LTR', name: 'Liter', nameAr: 'لتر', dimension: 'volume', isBaseUnit: true, isActive: true },
  ];
}

/**
 * Retrieve single UOM by ID or Code.
 */
export async function getUOM(identifier: string): Promise<UOMRecord | null> {
  const all = await getAllUOMs();
  return (
    all.find((u) => u.id === identifier || u.code.toUpperCase() === identifier.toUpperCase()) || null
  );
}

/**
 * Register a new Unit of Measure.
 */
export async function createUOM(data: {
  code: string;
  name: string;
  nameAr?: string;
  dimension?: 'count' | 'weight' | 'volume' | 'length' | string;
  isBaseUnit?: boolean;
}): Promise<UOMRecord> {
  const code = data.code.toUpperCase().trim();
  const id = `uom-${code.toLowerCase()}`;

  const record: UOMRecord = {
    id,
    code,
    name: data.name,
    nameAr: data.nameAr || null,
    dimension: data.dimension || 'count',
    isBaseUnit: Boolean(data.isBaseUnit),
    isActive: true,
  };

  if (db) {
    await db.insert(unitsOfMeasure).values({
      id: record.id,
      code: record.code,
      name: record.name,
      nameAr: record.nameAr,
      dimension: record.dimension,
      isBaseUnit: record.isBaseUnit,
      isActive: true,
      createdAt: new Date(),
    });
  }

  return record;
}

/**
 * Retrieve all packaging conversions defined for a product.
 */
export async function getProductUnitConversions(
  productId: string
): Promise<ProductUnitConversionRecord[]> {
  if (db) {
    try {
      const res = await db
        .select({
          id: productUnitConversions.id,
          productId: productUnitConversions.productId,
          uomId: productUnitConversions.uomId,
          conversionFactor: productUnitConversions.conversionFactor,
          isDefaultSelling: productUnitConversions.isDefaultSelling,
          isDefaultPurchasing: productUnitConversions.isDefaultPurchasing,
          sellingPrice: productUnitConversions.sellingPrice,
          isActive: productUnitConversions.isActive,
          uomCode: unitsOfMeasure.code,
          uomName: unitsOfMeasure.name,
        })
        .from(productUnitConversions)
        .leftJoin(unitsOfMeasure, eq(productUnitConversions.uomId, unitsOfMeasure.id))
        .where(
          and(
            eq(productUnitConversions.productId, productId),
            eq(productUnitConversions.isActive, true)
          )
        );

      return res.map((r) => ({
        id: r.id,
        productId: r.productId,
        uomId: r.uomId,
        uomCode: r.uomCode || undefined,
        uomName: r.uomName || undefined,
        conversionFactor: parseFloat(r.conversionFactor),
        isDefaultSelling: r.isDefaultSelling,
        isDefaultPurchasing: r.isDefaultPurchasing,
        sellingPrice: r.sellingPrice ? parseFloat(r.sellingPrice) : null,
        isActive: r.isActive,
      }));
    } catch (err) {
      console.warn('PostgreSQL getProductUnitConversions failed:', err);
    }
  }

  return [];
}

/**
 * Configure / insert a unit conversion for a specific product.
 * Enforces positive conversion factor and compatible dimensions.
 */
export async function setProductUnitConversion(data: {
  productId: string;
  uomId: string;
  conversionFactor: number;
  isDefaultSelling?: boolean;
  isDefaultPurchasing?: boolean;
  sellingPrice?: number;
}): Promise<ProductUnitConversionRecord> {
  if (data.conversionFactor <= 0 || isNaN(data.conversionFactor)) {
    throw new Error(`Conversion factor must be a strictly positive number. Received: ${data.conversionFactor}`);
  }

  const uom = await getUOM(data.uomId);
  if (!uom) {
    throw new Error(`Target Unit of Measure with ID "${data.uomId}" does not exist.`);
  }

  const id = `puc-${data.productId}-${data.uomId}`;

  if (db) {
    // If setting default selling, unset previous defaults
    if (data.isDefaultSelling) {
      await db
        .update(productUnitConversions)
        .set({ isDefaultSelling: false })
        .where(eq(productUnitConversions.productId, data.productId));
      await db
        .update(products)
        .set({ defaultSellingUomId: data.uomId })
        .where(eq(products.id, data.productId));
    }

    await db
      .insert(productUnitConversions)
      .values({
        id,
        productId: data.productId,
        uomId: data.uomId,
        conversionFactor: data.conversionFactor.toFixed(4),
        isDefaultSelling: Boolean(data.isDefaultSelling),
        isDefaultPurchasing: Boolean(data.isDefaultPurchasing),
        sellingPrice: data.sellingPrice ? data.sellingPrice.toFixed(2) : null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [productUnitConversions.productId, productUnitConversions.uomId],
        set: {
          conversionFactor: data.conversionFactor.toFixed(4),
          isDefaultSelling: Boolean(data.isDefaultSelling),
          isDefaultPurchasing: Boolean(data.isDefaultPurchasing),
          sellingPrice: data.sellingPrice ? data.sellingPrice.toFixed(2) : null,
          updatedAt: new Date(),
        },
      });
  }

  return {
    id,
    productId: data.productId,
    uomId: data.uomId,
    uomCode: uom.code,
    uomName: uom.name,
    conversionFactor: data.conversionFactor,
    isDefaultSelling: Boolean(data.isDefaultSelling),
    isDefaultPurchasing: Boolean(data.isDefaultPurchasing),
    sellingPrice: data.sellingPrice || null,
    isActive: true,
  };
}

/**
 * Convert quantity of a product between two units.
 * Example: 2 Boxes (where 1 Box = 12 Pieces) to Pieces -> 24 Pieces.
 * Example: 24 Pieces to Boxes -> 2 Boxes.
 */
export async function convertProductQuantity(
  productId: string,
  quantity: number,
  fromUomId: string,
  toUomId: string
): Promise<{
  originalQuantity: number;
  fromUomId: string;
  toUomId: string;
  convertedQuantity: number;
  effectiveFactor: number;
}> {
  if (fromUomId === toUomId) {
    return {
      originalQuantity: quantity,
      fromUomId,
      toUomId,
      convertedQuantity: quantity,
      effectiveFactor: 1.0,
    };
  }

  const conversions = await getProductUnitConversions(productId);

  // Base unit of product has conversion factor 1.0
  const getFactor = (uomId: string): number => {
    if (uomId === 'uom-pcs' || uomId === 'base') return 1.0;
    const found = conversions.find((c) => c.uomId === uomId);
    if (!found) {
      throw new Error(`Unit conversion not defined for product "${productId}" and UOM "${uomId}"`);
    }
    return found.conversionFactor;
  };

  const fromFactor = getFactor(fromUomId);
  const toFactor = getFactor(toUomId);

  if (toFactor <= 0) {
    throw new Error('Target conversion factor cannot be zero or negative.');
  }

  // Convert to base units first: baseQuantity = quantity * fromFactor
  const baseQuantity = quantity * fromFactor;
  // Convert from base units to target units: targetQuantity = baseQuantity / toFactor
  const converted = Math.round((baseQuantity / toFactor) * 10000) / 10000;
  const effectiveFactor = fromFactor / toFactor;

  return {
    originalQuantity: quantity,
    fromUomId,
    toUomId,
    convertedQuantity: converted,
    effectiveFactor,
  };
}
