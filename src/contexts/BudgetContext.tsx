import React from 'react';
import { BudgetEntry } from '../types';

export interface BudgetContextState {
  budgetEntries: BudgetEntry[];
  setBudgetEntries: React.Dispatch<React.SetStateAction<BudgetEntry[]>>;
}

export const BudgetContext = React.createContext<BudgetContextState>({
  budgetEntries: [],
  setBudgetEntries: () => undefined,
});

interface BudgetContextProvider {
  initialValue?: BudgetEntry[];
  children: React.ReactNode;
}

export const BudgetContextProvider: React.FC<BudgetContextProvider> = ({
  initialValue,
  children,
}) => {
  const [budgetEntries, setBudgetEntries] = React.useState(initialValue || []);
  return (
    <BudgetContext.Provider value={{ budgetEntries, setBudgetEntries }}>
      {children}
    </BudgetContext.Provider>
  );
};
