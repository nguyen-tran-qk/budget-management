import DineroFactory, { Dinero } from 'dinero.js';
import { BudgetEntry } from './types';

export const ENTRIES_STORAGE_KEY = 'budget_entries';

export const Euro = (cents: number): Dinero => DineroFactory({ amount: cents, currency: 'EUR' });

const generateID = () => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array.join('');
};

export const createNewBudgetEntry = (amount: number, description?: string): BudgetEntry => ({
  id: generateID(),
  amount: Euro(amount),
  description: description ?? '',
});
