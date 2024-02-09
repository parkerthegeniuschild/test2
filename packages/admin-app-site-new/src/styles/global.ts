import { defineGlobalStyles } from '@pandacss/dev';

export const globalCss = defineGlobalStyles({
  'body, button, input, textarea, kbd': {
    fontWeight: 'normal',
    fontSize: 'sm',
    fontFamily: 'inter',
  },

  body: {
    color: 'gray.500',
    backgroundColor: 'gray.50',
    overflowX: 'auto',
    minW: '5xl',

    lg: {
      overflowX: 'hidden',
    },
  },

  '#nprogress .bar': {
    zIndex: 'calc(token(zIndex.banner) + 1)!',
    shadow: 'sm',
  },

  '.gm-style :is(a, button, .gmnoprint):not(:is(.gm-ui-hover-effect, .view-link a))':
    {
      display: 'none!',
    },

  '.gm-style [class*="marker-view"]': {
    outline: 'none!',
  },

  '.gm-style > *': {
    border: 'none!',
  },

  '*, *::before, *::after': {
    _focusVisible: {
      outlineColor: 'outline',
      outlineStyle: 'solid',
      outlineWidth: '2px',
    },
  },
});
