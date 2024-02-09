import { drawerStyles } from '@/components';
import { styled } from '@/styled-system/jsx';

const _Drawer = styled('div', drawerStyles.container);

export const Drawer = styled(_Drawer, {
  base: {
    position: 'absolute',

    '&[data-open="true"]': {
      transform: 'translateX(0px)',
    },
  },
});
