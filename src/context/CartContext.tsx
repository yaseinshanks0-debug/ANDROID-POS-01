/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext } from 'react';
import {
  CartItem,
  Customer,
  Product,
  ProductSaleUnitMode,
  PaymentMethod,
  CheckoutPaymentDetails,
  Transaction,
} from '../lib/types';
import { CartTotalsResult } from '../lib/pos-calculations';

export interface CartContextType {
  cart: CartItem[];
  cartTotals: CartTotalsResult;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  globalDiscountPercent: number;
  setGlobalDiscountPercent: (discount: number) => void;
  globalDiscountAmount: number;
  setGlobalDiscountAmount: (amount: number) => void;
  addToCart: (product: Product, quantity?: number, saleUnit?: ProductSaleUnitMode) => boolean;
  updateCartQuantity: (productId: string, delta: number) => void;
  setCartItemSaleUnit: (productId: string, saleUnit: ProductSaleUnitMode) => void;
  setCartItemDiscount: (productId: string, discountPercent: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  processCheckout: (
    paymentMethod: PaymentMethod,
    amountTendered: number,
    details?: CheckoutPaymentDetails
  ) => Promise<{ success: boolean; transaction?: Transaction; error?: string }>;
}

export const CartContext = createContext<CartContextType | null>(null);

export function useCartContext(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartContext.Provider');
  }
  return context;
}
