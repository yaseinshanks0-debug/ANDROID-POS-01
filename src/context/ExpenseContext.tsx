/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext } from 'react';
import { ExpenseRecord, ExpenseInput } from '../lib/types';

export interface ExpenseContextType {
  expenses: ExpenseRecord[];
  addExpense: (input: ExpenseInput) => { ok: boolean; expense?: ExpenseRecord; error?: string };
  updateExpense: (id: string, updates: Partial<ExpenseRecord>) => boolean;
  voidExpense: (id: string) => boolean;
  deleteExpense: (id: string) => void;
}

export const ExpenseContext = createContext<ExpenseContextType | null>(null);

export function useExpenseContext(): ExpenseContextType {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenseContext must be used within an ExpenseContext.Provider');
  }
  return context;
}
