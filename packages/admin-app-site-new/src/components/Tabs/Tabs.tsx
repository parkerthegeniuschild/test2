'use client';

import { type ReactNode, useMemo } from 'react';
import * as Ariakit from '@ariakit/react';

import { TabsContext } from './TabsContext';
import { TabsList } from './TabsList';
import { TabsPanel } from './TabsPanel';
import { TabsTab } from './TabsTab';

type TabsRootProps = Ariakit.TabStoreProps & {
  children: ReactNode;
};

function TabsRoot({ children, ...props }: TabsRootProps) {
  const tabStore = Ariakit.useTabStore(props);

  const providerValue = useMemo(() => ({ store: tabStore }), [tabStore]);

  return (
    <TabsContext.Provider value={providerValue}>
      {children}
    </TabsContext.Provider>
  );
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Panel: TabsPanel,
  Tab: TabsTab,
});
