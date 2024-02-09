import * as Ariakit from '@ariakit/react';

import { cva, cx, type RecipeVariantProps } from '@/styled-system/css';

import { useTabs } from './TabsContext';

const tabsListStyles = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  variants: {
    bordered: {
      true: {
        borderBottomWidth: '1px',
        borderColor: 'gray.200',
      },
    },
  },
});

type TabsListProps = Omit<Ariakit.TabListProps, 'store'> &
  RecipeVariantProps<typeof tabsListStyles>;

export function TabsList({ className, bordered, ...props }: TabsListProps) {
  const { store } = useTabs();

  return (
    <Ariakit.TabList
      {...props}
      store={store}
      className={cx(tabsListStyles({ bordered }), className)}
    />
  );
}
