import { createContext, useContext } from 'react';

type SelectContextData = {
  size: 'md' | 'sm' | 'xs';
};

export const SelectContext = createContext({} as SelectContextData);

export function useSelect() {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error('useSelect must be used within a SelectProvider');
  }

  return context;
}
