'use client';

import { forwardRef } from 'react';
import * as Ariakit from '@ariakit/react';

import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';
import type { SystemStyleObject } from '@/styled-system/types';

import { Icon } from '../icons';
import { TextButton } from '../TextButton';

export const containerStyles = cva({
  base: {
    bgColor: 'white',
    height: 'calc(100vh - 1rem)',
    position: 'fixed',
    top: 2,
    right: 2,
    rounded: 'lg.xl',
    shadow: 'menu.md',
    transform: 'translateX(calc(100% + 1rem))',
    zIndex: 'overlay',
    outline: 'none',
    transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',

    '&[data-enter]': {
      transform: 'translateX(0px)',
    },
  },
  variants: {
    size: {
      sm: { width: '25rem' },
      md: { width: '27.75rem' },
      lg: { width: '34.5rem' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const Container = styled('div', containerStyles);

export interface DrawerProps extends Ariakit.DialogProps {
  open?: boolean;
  size?: React.ComponentProps<typeof Container>['size'];
  css?: SystemStyleObject;
  onClose?: () => void;
}

function DrawerRoot({ open, size, css, onClose, ...props }: DrawerProps) {
  return (
    <Ariakit.DialogProvider animated>
      <Ariakit.Dialog
        render={<Container size={size} css={css} />}
        open={open}
        onClose={onClose}
        modal={false}
        {...props}
      />
    </Ariakit.DialogProvider>
  );
}

const Heading = styled(Ariakit.DialogHeading, {
  base: {
    fontSize: 'xl',
    lineHeight: 1,
    fontWeight: 'semibold',
    color: 'gray.900',
  },
});

const Dismiss = forwardRef<HTMLButtonElement, Ariakit.DialogDismissProps>(
  ({ children, ...props }, forwardedRef) => (
    <Ariakit.DialogDismiss
      ref={forwardedRef}
      render={<TextButton colorScheme="lightGray" fontSize="1.1875rem" />}
      title="Dismiss drawer"
      {...props}
    >
      {children ?? <Icon.Times />}
    </Ariakit.DialogDismiss>
  )
);

Dismiss.displayName = 'DrawerDismiss';

export const Drawer = Object.assign(DrawerRoot, {
  Heading,
  Dismiss,
});
