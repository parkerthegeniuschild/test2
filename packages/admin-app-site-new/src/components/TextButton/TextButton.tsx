import { forwardRef } from 'react';

import { styled } from '@/styled-system/jsx';

const Container = styled('button', {
  base: {
    fontFamily: 'inter',
    fontSize: 'var(--text-button-font-size)',
    lineHeight: 1,
    cursor: 'pointer',
    fontWeight: 'semibold',
    transitionProperty: 'color, opacity',
    transitionDuration: 'fast',
    transitionTimingFunction: 'ease-in-out',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,

    _disabled: { pointerEvents: 'none' },
  },
  variants: {
    size: {
      md: { '--text-button-font-size': 'token(fontSizes.md)' },
      sm: { '--text-button-font-size': 'token(fontSizes.sm)' },
    },
    colorScheme: {
      primary: {
        color: 'primary',

        _hover: { color: 'primary.600' },

        _active: { color: 'primary' },

        _disabled: { opacity: 0.4 },
      },
      danger: {
        color: 'danger',

        _hover: { color: 'danger.600' },

        _active: { color: 'danger' },

        _disabled: { opacity: 0.4 },
      },
      lightGray: {
        color: 'gray.400',

        _hover: { color: 'gray.600' },

        _active: { color: 'gray.400' },
      },
      gray: {
        color: 'gray.500',

        _hover: { color: 'gray.700' },

        _active: { color: 'gray.500' },

        _disabled: { color: 'gray.300' },
      },
    },
  },
  defaultVariants: {
    size: 'sm',
    colorScheme: 'primary',
  },
});

const SlotContainer = styled('span', {
  base: {
    fontSize: 'md',
    height: 0,
    width: 'var(--text-button-font-size)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '& > *': { flexShrink: 0 },
  },
});

interface TextButtonProps
  extends React.ComponentPropsWithoutRef<typeof Container> {
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(
  ({ rightSlot, leftSlot, children, ...props }, forwardedRef) => {
    return (
      <Container ref={forwardedRef} type="button" {...props}>
        {!!leftSlot && <SlotContainer>{leftSlot}</SlotContainer>}

        {children}

        {!!rightSlot && <SlotContainer>{rightSlot}</SlotContainer>}
      </Container>
    );
  }
);

TextButton.displayName = 'TextButton';
