import { styled } from '@/styled-system/jsx';

export const DotsFlashing = styled('div', {
  base: {
    '--solid-dot-color': 'token(colors.primary)',
    '--transparent-dot-color': 'rgba(0, 204, 102, 0.24)',

    position: 'relative',
    width: 1,
    height: 1,
    rounded: 'full',
    bgColor: 'var(--solid-dot-color)',
    animation: 'dotFlashing 1s infinite alternate',
    animationDelay: '0.5s',

    '&::before, &::after': {
      content: '""',
      display: 'inline-block',
      position: 'absolute',
      top: 0,
    },

    '&::before': {
      left: -0.75,
      transform: 'translateX(-100%)',
      width: 1,
      height: 1,
      rounded: 'full',
      bgColor: 'var(--solid-dot-color)',
      animation: 'dotFlashing 1s infinite alternate',
      animationDelay: '0s',
    },

    '&::after': {
      left: 0.75,
      transform: 'translateX(100%)',
      width: 1,
      height: 1,
      rounded: 'full',
      bgColor: 'var(--solid-dot-color)',
      animation: 'dotFlashing 1s infinite alternate',
      animationDelay: '1s',
    },
  },
});
