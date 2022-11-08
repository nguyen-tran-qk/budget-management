import { Dinero } from 'dinero.js';

export type BudgetEntry = {
  id: string;
  amount: Dinero;
  description: string;
};
