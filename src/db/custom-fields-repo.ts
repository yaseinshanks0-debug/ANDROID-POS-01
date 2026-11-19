/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from './index.ts';
import {
  customFieldDefinitions,
  productCustomFieldValues,
  products,
  type CustomFieldValidationRules,
} from './schema.ts';
import { eq } from 'drizzle-orm';
import type { ProductCustomFields } from '../lib/types.ts';

export const CUSTOM_FIELD_DATA_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  BOOLEAN: 'boolean',
  DROPDOWN: 'dropdown',
} as const;
export type CustomFieldDataType =
  (typeof CUSTOM_FIELD_DATA_TYPES)[keyof typeof CUSTOM_FIELD_DATA_TYPES];

export type ParsedCustomFieldValue =
  | string
  | number
  | boolean
  | Date
  | Record<string, unknown>
  | unknown[]
  | null;

export interface CustomFieldDefinitionRecord {
  id: string;
  name: string;
  label: string;
  labelAr?: string | null;
  dataType: CustomFieldDataType | (string & {});
  description?: string | null;
  isRequired: boolean;
  defaultValue?: string | null;
  options?: string[] | null;
  validationRules?: CustomFieldValidationRules | null;
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
  value: unknown;
  valueText?: string | null;
  valueNumber?: number | null;
  valueBoolean?: boolean | null;
  valueDate?: string | null;
  valueJson?: unknown;
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
        validationRules: f.validationRules || null,
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
export interface CreateFieldDefinitionInput {
  name: string;
  label: string;
  labelAr?: string;
  dataType: CustomFieldDataType;
  description?: string;
  isRequired?: boolean;
  defaultValue?: string;
  options?: string[];
  validationRules?: CustomFieldValidationRules;
  isSearchable?: boolean;
  showOnReceipt?: boolean;
  showInList?: boolean;
  displayOrder?: number;
}

export async function createFieldDefinition(
  data: CreateFieldDefinitionInput
): Promise<CustomFieldDefinitionRecord> {
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
export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
  parsedValue: ParsedCustomFieldValue;
}

export function validateFieldValue(
  def: CustomFieldDefinitionRecord,
  value: unknown
): FieldValidationResult {
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
      const parsedDate =
        value instanceof Date
          ? value
          : new Date(typeof value === 'string' || typeof value === 'number' ? value : '');
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
  rawValue: unknown
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
  let valueJson: unknown = null;

  if (def.dataType === 'number') {
    valueNumber = validation.parsedValue !== null ? Number(validation.parsedValue).toFixed(4) : null;
  } else if (def.dataType === 'date') {
    valueDate = validation.parsedValue instanceof Date ? validation.parsedValue : null;
  } else if (def.dataType === 'boolean') {
    valueBoolean = typeof validation.parsedValue === 'boolean' ? validation.parsedValue : null;
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
    const prod = await db
      .select({ id: products.id, customFields: products.customFields })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);
    if (prod.length > 0) {
      const currentFields: ProductCustomFields = {
        ...(prod[0].customFields || {}),
        [def.name]: validation.parsedValue as ProductCustomFields[string],
      };
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
        let value: unknown = null;
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
