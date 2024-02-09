import { styled } from '@/styled-system/jsx';

const Container = styled('header', {
  base: {
    minHeight: '4.25rem',
    display: 'flex',
    alignItems: 'center',
    borderBottomWidth: '1px',
    borderColor: 'gray.200',
  },
});

const LeftBar = styled('div', {
  base: {
    px: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '34.5rem',
    height: '100%',
    borderRightWidth: '1px',
    borderColor: 'inherit',
  },
});

const LeftBarEndContainer = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
});

const DashedCircle = styled('div', {
  base: {
    width: 7,
    height: 7,
    rounded: 'full',
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderColor: 'gray.400',
  },
});

export const Header = {
  Container,
  LeftBar,
  LeftBarEndContainer,
  DashedCircle,
};
