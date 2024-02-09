'use client';

import { forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';

import { styled } from '@/styled-system/jsx';

const Container = styled('div', {
  base: {
    rounded: 'lg',
    bgColor: 'white',
    display: 'flex',
    borderWidth: '1px',
    borderColor: 'gray.200',
    py: 2.1,
    px: 1.5,
    transitionProperty: 'border-color, background-color',
    transitionDuration: 'fast',
    transitionTimingFunction: 'ease-in-out',
    cursor: 'text',
    position: 'relative',

    _before: {
      content: '""',
      zIndex: -1,
      position: 'absolute',
      inset: 0,
      bgColor: 'primary',
      opacity: 0,
      width: 'calc(100% + 10px)',
      height: 'calc(100% + 10px)',
      transform: 'translate(-5px, -5px)',
      rounded: 'calc(token(radii.lg) + 4px)',
      transition: 'opacity token(durations.fast) ease-in-out',
    },

    _after: {
      content: '""',
      position: 'absolute',
      left: 0,
      bottom: '-1px',
      shadow: 'inset',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      rounded: 'calc(token(radii.lg) - 1px)',
    },

    _focusWithin: {
      borderColor: 'primary',

      _before: {
        opacity: 0.24,
      },
    },
  },
  variants: {
    active: {
      true: {
        borderColor: 'primary',
      },
    },
    error: {
      true: {
        borderColor: 'danger',

        _before: {
          bgColor: 'danger',
        },

        _focusWithin: {
          borderColor: 'danger',
        },
      },
    },
  },
});

const Input = styled('textarea', {
  base: {
    fontFamily: 'inter',
    outline: 0,
    resize: 'none',
    appearance: 'none',
    bgColor: 'transparent',
    width: '100%',
    fontSize: 'sm',
    lineHeight: 'sm',
    fontWeight: 'medium',
    color: 'gray.900',
    px: 1.5,

    _placeholder: {
      color: 'gray.400',
    },
  },
});

export interface TextareaProps
  extends React.ComponentPropsWithoutRef<typeof Input> {
  active?: boolean;
  error?: boolean;
  containerProps?: React.ComponentPropsWithoutRef<typeof Container>;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ active, error, containerProps, children, ...props }, forwardedRef) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    return (
      <Container
        active={active}
        error={error}
        {...containerProps}
        onClick={e => {
          textareaRef.current?.focus();
          containerProps?.onClick?.(e);
        }}
      >
        <Input ref={mergeRefs([forwardedRef, textareaRef])} {...props} />

        {children}
      </Container>
    );
  }
);

Textarea.displayName = 'Textarea';
