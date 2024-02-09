import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { useSidebar } from './SidebarContext';
import { SidebarHamburger } from './SidebarHamburger';

const Container = styled(
  'header',
  cva({
    base: {
      display: 'flex',
      alignItems: 'center',
      py: 4.5,
    },
    variants: {
      open: {
        true: {
          px: 5,
          justifyContent: 'space-between',
        },
        false: {
          justifyContent: 'center',
        },
      },
    },
  })
);

type SidebarHeaderProps = {
  children: React.ReactNode;
  onHamburgerClick?: () => void;
};

export function SidebarHeader({
  children,
  onHamburgerClick,
}: SidebarHeaderProps) {
  const { open } = useSidebar();

  return (
    <Container open={open}>
      {open && children}
      <SidebarHamburger onClick={onHamburgerClick} />
    </Container>
  );
}
