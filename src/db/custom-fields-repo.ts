/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from './index.ts';
import { customFieldDefinitions, productCustomFieldValues, products } from './schema.ts';
import { eq, and } from 'drizzle-orm';

export interface CustomFieldDefinitionRecord {
  id: string;
  name: string;
  label: string;
  labelAr?: string | null;
  dataType: 'text' | 'number' | 'date' | 'boolean' | 'dropdown' | string;
  description?: string | null;
  isRequired: boolean;
  defaultValue?: string | null;
  options?: string[] | null;
  validationRules?: Record<string, any> | null;
  isSearchable: boolean;
  showOnReceipt: boolean;
  showInList: boolean;
  displayOrder: number;
  isActive: boolean;
}

export interface ProductCustomFieldValueRecord {
  id: string;
  productId: string;
  fieldId: string;
  fieldName: string;
  fieldLabel: string;
  dataType: string;
  value: any;
  valueText?: string | null;
  valueNumber?: number | null;
  valueBoolean?: boolean | null;
  valueDate?: string | null;
  valueJson?: any;
}

/**
 * Retrieve all custom field definitions.
 */
export async function getAllFieldDefinitions(): Promise<CustomFieldDefinitionRecord[]> {
  if (db) {
    try {
      const res = await db
        .select()
        .from(customFieldDefinitions)
        .where(eq(customFieldDefinitions.isActive, true))
        .orderBy(customFieldDefinitions.displayOrder);

      return res.map((f) => ({
        id: f.id,
        name: f.name,
        label: f.label,
        labelAr: f.labelAr,
        dataType: f.dataType,
        description: f.description,
        isRequired: f.isRequired,
        defaultValue: f.defaultValue,
        options: (f.options as string[]) || null,
        validationRules: (f.validationRules as Record<string, any>) || null,
        isSearchable: f.isSearchable,
        showOnReceipt: f.showOnReceipt,
        showInList: f.showInList,
        displayOrder: f.displayOrder,
        isActive: f.isActive,
      }));
    } catch (err) {
      console.warn('PostgreSQL getAllFieldDefinitions failed:', err);
    }
  }

  return [];
}

/**
 * Retrieve a specific custom field definition by ID or name.
 */
export async function getFieldDefinition(nameOrId: string): Promise<CustomFieldDefinitionRecord | null> {
  const all = await getAllFieldDefinitions();
  return (
    all.find((f) => f.id === nameOrId || f.name.toLowerCase() === nameOrId.toLowerCase()) || null
  );
}

/**
 * Create a new user-defined custom field definition without table alterations.
 */
export async function createFieldDefinition(data: {
  name: string;
  label: string;
  labelAr?: string;
  dataType: 'text' | 'number' | 'date' | 'boolean' | 'dropdown';
  description?: string;
  isRequired?: boolean;
  defaultValue?: string;
  options?: string[];
  validationRules?: Record<string, any>;
  isSearchable?: boolean;
  showOnReceipt?: boolean;
  showInList?: boolean;
  displayOrder?: number;
}): Promise<CustomFieldDefinitionRecord> {
  const cleanName = data.name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const id = `cf-${cleanName}`;

  const record: CustomFieldDefinitionRecord = {
    id,
    name: cleanName,
    label: data.label,
    labelAr: data.labelAr || null,
    dataType: data.dataType,
    description: data.description || null,
    isRequired: Boolean(data.isRequired),
    defaultValue: data.defaultValue || null,
    options: data.options || null,
    validationRules: data.validationRules || null,
    isSearchable: Boolean(data.isSearchable),
    showOnReceipt: Boolean(data.showOnReceipt),
    showInList: data.showInList !== undefined ? data.showInList : true,
    displayOrder: data.displayOrder || 0,
    isActive: true,
  };

  if (db) {
    await db.insert(customFieldDefinitions).values({
      id: record.id,
      name: record.name,
      label: record.label,
      labelAr: record.labelAr,
      dataType: record.dataType,
      description: record.description,
      isRequired: record.isRequired,
      defaultValue: record.defaultValue,
      options: record.options,
      validationRules: record.validationRules,
      isSearchable: record.isSearchable,
      showOnReceipt: record.showOnReceipt,
      showInList: record.showInList,
      displayOrder: record.displayOrder,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return record;
}

/**
 * Validate a candidate field value against field definition constraints.
 */
export function validateFieldValue(
  def: CustomFieldDefinitionRecord,
  value: any
): { isValid: boolean; error?: string; parsedValue: any } {
  // Required check
  if (value === undefined || value === null || value === '') {
    if (def.isRequired) {
      return { isValid: false, error: `Field "${def.label}" is required.`, parsedValue: null };
    }
    return { isValid: true, parsedValue: null };
  }

  switch (def.dataType) {
    case 'number': {
      const num = Number(value);
      if (isNaN(num)) {
        return { isValid: false, error: `Field "${def.label}" must be a valid number.`, parsedValue: null };
      }
      if (def.validationRules?.min !== undefined && num < def.validationRules.min) {
        return {
          isValid: false,
          error: `Field "${def.label}" cannot be less than ${def.validationRules.min}.`,
          parsedValue: null,
        };
      }
      if (def.validationRules?.max !== undefined && num > def.validationRules.max) {
        return {
          isValid: false,
          error: `Field "${def.label}" cannot exceed ${def.validationRules.max}.`,
          parsedValue: null,
        };
      }
      return { isValid: true, parsedValue: num };
    }

    case 'date': {
      const parsedDate = new Date(value);
      if (isNaN(parsedDate.getTime())) {
        return { isValid: false, error: `Field "${def.label}" must be a valid date.`, parsedValue: null };
      }
      return { isValid: true, parsedValue: parsedDate };
    }

    case 'boolean': {
      const boolVal = typeof value === 'boolean' ? value : value === 'true' || value === 1;
      return { isValid: true, parsedValue: boolVal };
    }

    case 'dropdown': {
      const strVal = String(value);
      if (def.options && def.options.length > 0 && !def.options.includes(strVal)) {
        return {
          isValid: false,
          error: `Value "${strVal}" is not one of the allowed options: [${def.options.join(', ')}]`,
          parsedValue: null,
        };
      }
      return { isValid: true, parsedValue: strVal };
    }

    case 'text':
    default: {
      const textVal = String(value);
      if (def.validationRules?.pattern) {
        const regex = new RegExp(def.validationRules.pattern);
        if (!regex.test(textVal)) {
          return {
            isValid: false,
            error: `Field "${def.label}" does not match required pattern ${def.validationRules.pattern}`,
            parsedValue: null,
          };
        }
      }
      return { isValid: true, parsedValue: textVal };
    }
  }
}

/**
 * Assign and validate a custom field value for a product.
 * Updates normalized relational table AND denormalized products.custom_fields JSONB.
 */
export async function setProductCustomFieldValue(
  productId: string,
  fieldNameOrId: string,
  rawValue: any
): Promise<ProductCustomFieldValueRecord> {
  const def = await getFieldDefinition(fieldNameOrId);
  if (!def) {
    throw new Error(`Custom field definition "${fieldNameOrId}" not found.`);
  }

  const validation = validateFieldValue(def, rawValue);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const id = `pcfv-${productId}-${def.id}`;
  let valueText: string | null = null;
  let valueNumber: string | null = null;
  let valueBoolean: boolean | null = null;
  let valueDate: Date | null = null;
  let valueJson: any = null;

  if (def.dataType === 'number') {
    valueNumber = validation.parsedValue !== null ? Number(validation.parsedValue).toFixed(4) : null;
  } else if (def.dataType === 'date') {
    valueDate = validation.parsedValue;
  } else if (def.dataType === 'boolean') {
    valueBoolean = validation.parsedValue;
  } else if (typeof validation.parsedValue === 'object' && validation.parsedValue !== null) {
    valueJson = validation.parsedValue;
  } else {
    valueText = validation.parsedValue !== null ? String(validation.parsedValue) : null;
  }

  if (db) {
    await db
      .insert(productCustomFieldValues)
      .values({
        id,
        productId,
        fieldId: def.id,
        valueText,
        valueNumber,
        valueBoolean,
        valueDate,
        valueJson,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [productCustomFieldValues.productId, productCustomFieldValues.fieldId],
        set: {
          valueText,
          valueNumber,
          valueBoolean,
          valueDate,
          valueJson,
          updatedAt: new Date(),
        },
      });

    // Synchronize to denormalized products.custom_fields JSONB
    const prod = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    if (prod.length > 0) {
      const currentFields = (prod[0].customFields as Record<string, any>) || {};
      currentFields[def.name] = validation.parsedValue;
      await db
        .update(products)
        .set({ customFields: currentFields, updatedAt: new Date() })
        .where(eq(products.id, productId));
    }
  }

  return {
    id,
    productId,
    fieldId: def.id,
    fieldName: def.name,
    fieldLabel: def.label,
    dataType: def.dataType,
    value: validation.parsedValue,
    valueText,
    valueNumber: valueNumber ? parseFloat(valueNumber) : null,
    valueBoolean,
    valueDate: valueDate ? valueDate.toISOString() : null,
    valueJson,
  };
}

/**
 * Retrieve all custom field values for a specific product.
 */
export async function getProductCustomFields(
  productId: string
): Promise<ProductCustomFieldValueRecord[]> {
  if (db) {
    try {
      const res = await db
        .select({
          id: productCustomFieldValues.id,
          productId: productCustomFieldValues.productId,
          fieldId: productCustomFieldValues.fieldId,
          valueText: productCustomFieldValues.valueText,
          valueNumber: productCustomFieldValues.valueNumber,
          valueBoolean: productCustomFieldValues.valueBoolean,
          valueDate: productCustomFieldValues.valueDate,
          valueJson: productCustomFieldValues.valueJson,
          fieldName: customFieldDefinitions.name,
          fieldLabel: customFieldDefinitions.label,
          dataType: customFieldDefinitions.dataType,
        })
        .from(productCustomFieldValues)
        .leftJoin(customFieldDefinitions, eq(productCustomFieldValues.fieldId, customFieldDefinitions.id))
        .where(eq(productCustomFieldValues.productId, productId));

      return res.map((r) => {
        let value: any = null;
        if (r.dataType === 'number') value = r.valueNumber ? parseFloat(r.valueNumber) : null;
        else if (r.dataType === 'date') value = r.valueDate ? r.valueDate.toISOString() : null;
        else if (r.dataType === 'boolean') value = r.valueBoolean;
        else if (r.valueJson !== null) value = r.valueJson;
        else value = r.valueText;

        return {
          id: r.id,
          productId: r.productId,
          fieldId: r.fieldId,
          fieldName: r.fieldName || '',
          fieldLabel: r.fieldLabel || '',
          dataType: r.dataType || 'text',
          value,
          valueText: r.valueText,
          valueNumber: r.valueNumber ? parseFloat(r.valueNumber) : null,
          valueBoolean: r.valueBoolean,
          valueDate: r.valueDate ? r.valueDate.toISOString() : null,
          valueJson: r.valueJson,
        };
      });
    } catch (err) {
      console.warn('PostgreSQL getProductCustomFields failed:', err);
    }
  }

  return [];
}
