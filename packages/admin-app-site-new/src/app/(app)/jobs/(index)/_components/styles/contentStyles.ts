import { styled } from '@/styled-system/jsx';

const Container = styled('div', {
  base: {
    '--content-padding-x': 'token(spacing.6)',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'auto',
  },
});

export const Content = {
  Container,
};
