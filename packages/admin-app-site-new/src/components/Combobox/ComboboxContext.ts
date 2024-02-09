import { createContext, useContext } from 'react';
import type { ComboboxStore } from '@ariakit/react';

type ComboboxContextData = {
  store: ComboboxStore;
  size?: 'md' | 'lg';
  weight?: 'semibold' | 'medium';
};

export const ComboboxContext = createContext({} as ComboboxContextData);

export function useCombobox() {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('useCombobox must be used within a ComboboxProvider');
  }

  return context;
}
