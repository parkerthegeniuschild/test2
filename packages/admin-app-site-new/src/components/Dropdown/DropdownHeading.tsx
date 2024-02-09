import { forwardRef } from 'react';
import * as Ariakit from '@ariakit/react';

import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';
import type { SystemStyleObject } from '@/styled-system/types';

const Container = styled(
  'h1',
  cva({
    base: {
      fontFamily: 'inter',
      fontWeight: 'medium',
      color: 'gray.500',
      fontSize: 'xs',
      lineHeight: 1,
      py: 2,
      px: 4,
    },
  })
);

type DropdownHeadingProps = React.ComponentPropsWithoutRef<'h1'> & {
  css?: SystemStyleObject;
};

export const DropdownHeading = forwardRef<
  HTMLHeadingElement,
  DropdownHeadingProps
>(({ css, ...props }, forwardedRef) => (
  <Ariakit.MenuHeading
    ref={forwardedRef}
    render={<Container css={css} />}
    {...props}
  />
));

DropdownHeading.displayName = 'DropdownHeading';
