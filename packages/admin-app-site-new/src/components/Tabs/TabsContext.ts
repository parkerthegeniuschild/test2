import { createContext, useContext } from 'react';
import type { TabStore } from '@ariakit/react';

type TabsContextData = {
  store: TabStore;
};

export const TabsContext = createContext({} as TabsContextData);

export function useTabs() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider');
  }

  return context;
}
