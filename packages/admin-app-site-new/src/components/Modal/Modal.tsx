'use client';

import { forwardRef } from 'react';
import * as Ariakit from '@ariakit/react';

import { styled } from '@/styled-system/jsx';
import type { SystemStyleObject } from '@/styled-system/types';

import { ModalDismiss } from './ModalDismiss';

const Container = styled('div', {
  base: {
    position: 'fixed',
    inset: '0.75rem',
    zIndex: 'modal',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    height: 'fit-content',
    maxHeight: '80vh',
    overflow: 'auto',
    rounded: 'lg.xl',
    bgColor: 'white',
    shadow: 'menu.md',
    transformOrigin: 'center',
    opacity: 0,
    transform: 'scale(0.95)',
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: 'easeInOut',
    transitionDuration: 'fast',
    outline: 'none',
    px: 5,
    pt: 5,
    pb: 4,

    '&[data-enter]': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
  variants: {
    size: {
      sm: { maxWidth: '25rem' },
      md: { maxWidth: '37.75rem' },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

const Backdrop = styled('div', {
  base: {
    bgColor: 'rgba(23, 32, 38, 0.30)',
    opacity: 0,
    transitionProperty: 'opacity',
    transitionTimingFunction: 'easeInOut',
    transitionDuration: 'fast',

    '&[data-enter]': {
      opacity: 1,
    },
  },
});

interface ModalProps extends Omit<Ariakit.DialogProps, 'store'> {
  open?: boolean;
  trigger?: React.ReactElement;
  css?: SystemStyleObject;
  size?: React.ComponentProps<typeof Container>['size'];
  onClose?: () => void;
  onUnmount?: () => void;
}

const ModalRoot = forwardRef<HTMLDivElement, ModalProps>(
  (
    { open, onClose, trigger, css, size, onUnmount, ...props },
    forwardedRef
  ) => {
    const dialogStore = Ariakit.useDialogStore({
      open,
      setOpen: _open => !_open && onClose?.(),
      setMounted: mounted => !mounted && onUnmount?.(),
      animated: true,
    });

    return (
      <>
        {!!trigger && (
          <Ariakit.Button render={trigger} onClick={dialogStore.show} />
        )}

        <Ariakit.Dialog
          ref={forwardedRef}
          render={<Container size={size} css={css} />}
          backdrop={<Backdrop />}
          {...props}
          store={dialogStore}
        />
      </>
    );
  }
);

ModalRoot.displayName = 'Modal';

const Heading = styled(Ariakit.DialogHeading, {
  base: {
    color: 'gray.900',
    fontSize: 'md',
    fontWeight: 'semibold',
    lineHeight: '1.375rem',
  },
});

const Description = styled(Ariakit.DialogDescription, {
  base: {
    fontSize: 'sm',
    lineHeight: '1.375rem',
    color: 'gray.700',
  },
});

export const Modal = Object.assign(ModalRoot, {
  Heading,
  Description,
  Dismiss: ModalDismiss,
});
