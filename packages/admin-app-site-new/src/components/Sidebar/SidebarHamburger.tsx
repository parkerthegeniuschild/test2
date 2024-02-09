import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { useSidebar } from './SidebarContext';
import { SidebarTooltip } from './SidebarTooltip';

function HamburgerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M2.5 10h15m-15-5h15m-15 10h15"
      />
    </svg>
  );
}

const Container = styled(
  'button',
  cva({
    base: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'gray.300',
      width: 8,
      height: 8,
      rounded: 'md.xl',
      transition: 'all token(durations.fast) ease-in-out',

      '&:hover, &:focus': {
        bgColor: 'gray.700',
        color: 'white',
      },

      _focusVisible: {
        outlineColor: 'white',
        outlineWidth: '1px',
      },

      _active: {
        bgColor: 'transparent',
        color: 'gray.300',
      },
    },
  })
);

type SidebarHamburgerProps = {
  onClick?: () => void;
};

export function SidebarHamburger({ onClick }: SidebarHamburgerProps) {
  const { open } = useSidebar();

  return (
    <SidebarTooltip
      description={open ? 'Collapse sidebar' : 'Expand sidebar'}
      gutter={open ? 22 : 14}
      darkBg
    >
      <Container onClick={onClick}>
        <HamburgerIcon />
      </Container>
    </SidebarTooltip>
  );
}
