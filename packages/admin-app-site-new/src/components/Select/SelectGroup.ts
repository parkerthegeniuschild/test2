import * as Ariakit from '@ariakit/react';

import { styled } from '@/styled-system/jsx';

export const SelectGroup = styled(Ariakit.SelectGroup, {
  base: {
    py: 2,

    _first: { pt: 0 },

    _last: { pb: 0 },
  },
});
