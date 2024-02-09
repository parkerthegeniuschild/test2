import { styled } from '@/styled-system/jsx';

const Container = styled('footer', {
  base: {
    zIndex: 0,
    px: 6,
    py: 5,
    bgColor: 'gray.50',
    borderTopWidth: '1px',
    borderColor: 'gray.200',
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    mt: 'auto',
  },
});

export const Footer = {
  Container,
};
