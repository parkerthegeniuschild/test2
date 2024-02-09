import { forwardRef } from 'react';
import * as Ariakit from '@ariakit/react';

import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';
import type { SystemStyleObject } from '@/styled-system/types';

const Container = styled(
  'div',
  cva({
    base: {
      color: 'gray.900',
      fontWeight: 'medium',
      cursor: 'pointer',
      height: 8,
      px: 4,
      fontSize: 'sm',
      lineHeight: 'sm',
      transitionProperty: 'background-color, opacity',
      transitionDuration: 'fast',
      transitionTimingFunction: 'ease-in-out',
      userSelect: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 3,

      '&:hover, &:focus': {
        bgColor: 'gray.50',
      },

      _active: {
        bgColor: 'transparent',
      },

      '&[aria-disabled="true"]': {
        opacity: 0.4,
      },
    },
  })
);

type DropdownItemProps = Ariakit.MenuItemProps & {
  css?: SystemStyleObject;
};

const DropdownItemRoot = forwardRef<HTMLDivElement, DropdownItemProps>(
  ({ css, ...props }, forwardedRef) => (
    <Ariakit.MenuItem
      ref={forwardedRef}
      render={<Container css={css} />}
      {...props}
    />
  )
);

DropdownItemRoot.displayName = 'DropdownItem';

export const DropdownItem = Object.assign(DropdownItemRoot, {
  Container,
});
