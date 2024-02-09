'use client';

import { useMemo } from 'react';

import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { SidebarBody } from './SidebarBody';
import { SidebarContext } from './SidebarContext';
import { SidebarFooter } from './SidebarFooter';
import { SidebarHeader } from './SidebarHeader';
import { SidebarItem } from './SidebarItem';
import { SidebarProfile } from './SidebarProfile';

const Container = styled(
  'nav',
  cva({
    base: {
      bgColor: 'gray.800',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      pb: 2,
      transition: 'width token(durations.fast) ease-in-out',
      zIndex: 'docked',
    },
    variants: {
      open: {
        true: {
          width: '17.5rem',
        },
        false: {
          width: '3.5rem',
        },
      },
    },
  })
);

type SidebarRootProps = React.ComponentPropsWithoutRef<typeof Container> & {
  open?: boolean;
  children: React.ReactNode;
};

function SidebarRoot({ children, open = true, ...props }: SidebarRootProps) {
  const providerValue = useMemo(() => ({ open }), [open]);

  return (
    <SidebarContext.Provider value={providerValue}>
      <Container open={open} {...props}>
        {children}
      </Container>
    </SidebarContext.Provider>
  );
}

export const Sidebar = Object.assign(SidebarRoot, {
  Header: SidebarHeader,
  Body: SidebarBody,
  Item: SidebarItem,
  Footer: SidebarFooter,
  Profile: SidebarProfile,
});
