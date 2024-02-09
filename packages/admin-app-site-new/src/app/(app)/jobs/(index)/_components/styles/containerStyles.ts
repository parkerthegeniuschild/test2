import { styled } from '@/styled-system/jsx';

const StyledContainer = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'relative',
  },
});

const ContentWrapper = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    width: '34.5rem',
    shadow:
      '0px 2px 2px 0px rgba(1, 2, 3, 0.08), 0px 14px 24px -8px rgba(1, 2, 3, 0.24)',
    zIndex: 1,
    // 100vh - (header height)
    maxHeight: 'calc(100vh - 4.25rem)',
  },
});

export const Container = Object.assign(StyledContainer, {
  ContentWrapper,
});
