import * as Ariakit from '@ariakit/react';

import { styled } from '@/styled-system/jsx';

const Dot = styled('span', {
  base: {
    h: 0.5,
    w: 0.5,
    rounded: 'full',
    bgColor: 'currentColor',
    display: 'inline-block',
    mx: 1.75,
    verticalAlign: 'middle',
  },
});

const ActionButtonsContainer = styled(Ariakit.Focusable, {
  base: {
    '& .actions-container': {
      opacity: 0,
      visibility: 'hidden',
      pointerEvents: 'none',
      transitionProperty: 'opacity, visibility',
      transitionDuration: 'fast',
      transitionTimingFunction: 'easeInOut',
    },

    '&:is(:hover, :focus-within, [data-focus-visible])': {
      '& .actions-container': {
        opacity: 1,
        visibility: 'visible',
        pointerEvents: 'auto',
      },
    },
  },
});

export const Common = {
  Dot,
  ActionButtonsContainer,
};
