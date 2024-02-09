import * as Ariakit from '@ariakit/react';

import { useTabs } from './TabsContext';

type TabsPanelProps = Omit<Ariakit.TabPanelProps, 'store'>;

export function TabsPanel(props: TabsPanelProps) {
  const { store } = useTabs();

  return <Ariakit.TabPanel {...props} store={store} />;
}
