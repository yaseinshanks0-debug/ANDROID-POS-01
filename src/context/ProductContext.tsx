/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext } from 'react';
import {
  Product,
  StockMovement,
  StockMovementType,
  GoodsReceiptInput,
} from '../lib/types';

export interface ProductContextType {
  products: Product[];
  stockMovements: StockMovement[];
  addProduct: (product: Omit<Product, 'id' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | void>;
  deleteProduct: (id: string) => Promise<void>;
  pendingNewProductBarcode: string | null;
  setPendingNewProductBarcode: (code: string | null) => void;
  openAddProductWithBarcode: (code: string) => void;
  recordStockAdjustment: (
    productId: string,
    type: StockMovementType,
    amount: number,
    reason: string
  ) => void;
  recordGoodsReceipt: (input: GoodsReceiptInput) => boolean;
}

export const ProductContext = createContext<ProductContextType | null>(null);

export function useProductContext(): ProductContextType {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductContext.Provider');
  }
  return context;
}
