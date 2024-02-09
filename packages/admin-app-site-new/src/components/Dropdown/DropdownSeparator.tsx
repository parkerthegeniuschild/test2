import { forwardRef } from 'react';
import * as Ariakit from '@ariakit/react';

import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';
import type { SystemStyleObject } from '@/styled-system/types';

const Container = styled(
  'hr',
  cva({
    base: {
      my: 2,
      height: 0,
      width: '100%',
      borderTopWidth: '1px',
      borderColor: 'gray.100',
      outline: 0,
    },
  })
);

type DropdownSeparatorProps = React.ComponentPropsWithoutRef<'hr'> & {
  css?: SystemStyleObject;
};

export const DropdownSeparator = forwardRef<
  HTMLHRElement,
  DropdownSeparatorProps
>(({ css, ...props }, forwardedRef) => (
  <Ariakit.MenuSeparator
    ref={forwardedRef}
    render={<Container css={css} />}
    {...props}
  />
));

DropdownSeparator.displayName = 'DropdownSeparator';
