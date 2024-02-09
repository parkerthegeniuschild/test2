import { createContext, useContext } from 'react';

type SidebarContextData = {
  open?: boolean;
};

export const SidebarContext = createContext({} as SidebarContextData);

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }

  return context;
}
