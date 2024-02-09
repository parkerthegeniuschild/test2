import * as Ariakit from '@ariakit/react';

import { styled } from '@/styled-system/jsx';

export const SelectGroupLabel = styled(Ariakit.SelectGroupLabel, {
  base: {
    fontSize: 'xs',
    lineHeight: 1,
    fontWeight: 'medium',
    color: 'gray.500',
    px: 4,
    py: 2,
  },
});
