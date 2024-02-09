'use client';

import { forwardRef } from 'react';
import * as Ariakit from '@ariakit/react';

import { cva, cx } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { Spinner } from '../Spinner';

export const containerStyles = cva({
  base: {
    position: 'relative',
    fontFamily: 'inter',
    fontWeight: 'semibold',
    cursor: 'pointer',
    outline: 0,
    lineHeight: 1,
    shadow: 'sm',
    transition: 'all token(durations.medium) ease-in-out, font-weight 0s',
    userSelect: 'none',

    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },

    '&:focus::before': {
      opacity: 0.24,
    },

    '&::before': {
      zIndex: -1,
      content: '""',
      position: 'absolute',
      inset: 0,
      bgColor: 'primary',
      opacity: 0,
      width: 'calc(100% + 8px)',
      height: 'calc(100% + 8px)',
      transform: 'translate(-4px, -4px)',
      transition: 'opacity token(durations.fast) ease-in-out',
    },

    '&::after': {
      content: '""',
      pointerEvents: 'none',
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      shadow: 'inset',
      rounded: 'inherit',
    },
  },
  variants: {
    variant: {
      primary: {
        '& .button-wrapper, & .button-slot-container': {
          color: 'white',
        },

        '& .button-wrapper, &:active:not(:disabled) .button-wrapper': {
          bgColor: 'primary',
        },

        '&:hover:not(:disabled) .button-wrapper': {
          bgColor: 'primary.600',
        },
      },
      secondary: {
        '&:disabled': {
          opacity: 0.4,
        },

        '& .button-wrapper': {
          bgColor: 'white',
          color: 'gray.900',
          borderWidth: '1px',
          borderColor: 'gray.200',
        },

        '& .button-slot-container, &:active:not(:disabled) .button-slot-container':
          {
            color: 'gray.600',
          },

        '&:hover:not(:disabled) .button-slot-container': {
          color: 'gray.900',
        },
      },
      tertiary: {
        shadow: 'none',

        '&::before, &::after': {
          display: 'none',
        },

        '& .button-wrapper': {
          bgColor: 'rgba(1, 2, 3, 0.04)',
          color: 'gray.900',
        },

        '& .button-slot-container, &:active:not(:disabled) .button-slot-container':
          {
            color: 'gray.600',
          },

        '&:hover:not(:disabled) .button-slot-container': {
          color: 'gray.900',
        },

        '&:is(:hover, :focus):not(:disabled) .button-wrapper': {
          bgColor: 'rgba(1, 2, 3, 0.08)',
        },

        '&:is(:active):not(:disabled) .button-wrapper': {
          bgColor: 'rgba(1, 2, 3, 0.04)',
        },
      },
      quaternary: {
        shadow: 'none',

        '&::before, &::after': {
          display: 'none',
        },

        '& .button-wrapper, &:hover:not(:disabled) .button-slot-container': {
          color: 'gray.900',
        },

        '& .button-slot-container, &:active:not(:disabled) .button-slot-container':
          {
            color: 'gray.600',
          },

        '&:is(:hover, :focus):not(:disabled) .button-wrapper': {
          // TODO: refactor this when Panda releases the opacify feature
          bgColor: 'rgba(1, 2, 3, 0.04)',
        },
      },
    },
    size: {
      md: {
        rounded: 'lg',
        fontSize: 'sm',
        height: 9,

        '& .button-wrapper': {
          px: 3,
        },

        '& .button-slot-container': {
          fontSize: 'md',
        },

        '&::before': {
          // (inner radius) + (ring width)
          rounded: 'calc(token(radii.lg) + 4px)',
        },
      },
      sm: {
        rounded: 'md.xl',
        fontSize: 'sm',
        height: 8,

        '& .button-wrapper': {
          px: 3,
        },

        '& .button-slot-container': {
          fontSize: 'md',
        },

        '&::before': {
          rounded: 'calc(token(radii.md.xl) + 4px)',
        },
      },
      xs: {
        rounded: 'md.lg',
        fontSize: 'xs',
        height: 7,

        '& .button-wrapper': {
          px: 2.3,
        },

        '& .button-slot-container': {
          fontSize: 'sm',
        },

        '&::before': {
          rounded: 'calc(token(radii.md.lg) + 4px)',
        },
      },
    },
    full: {
      true: {
        width: '100%',
      },
    },
    danger: { true: {} },
  },
  compoundVariants: [
    {
      variant: 'primary',
      danger: true,
      css: {
        '& .button-wrapper, &:active:not(:disabled) .button-wrapper': {
          bgColor: 'danger',
        },

        '&:hover:not(:disabled) .button-wrapper': {
          bgColor: 'danger.600',
        },

        '&::before': {
          bgColor: 'danger',
        },
      },
    },
    {
      variant: 'secondary',
      danger: true,
      css: {
        '& .button-wrapper': {
          color: 'danger',
        },

        '& .button-slot-container, &:active:not(:disabled) .button-slot-container':
          {
            color: 'danger',
          },

        '&:hover:not(:disabled) .button-slot-container': {
          color: 'danger',
        },

        '&::before': {
          bgColor: 'danger',
        },
      },
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

const Container = styled(Ariakit.Button, containerStyles);

export const wrapperStyles = cva({
  base: {
    transition: 'inherit',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    rounded: 'inherit',
    width: '100%',
    height: '100%',
  },
});

const Wrapper = styled('span', wrapperStyles);

const Text = styled(
  'span',
  cva({
    base: {
      transition: 'padding token(durations.fast) ease-in-out',
    },
    variants: {
      spanRight: {
        true: {
          // (spinner width) + (spacing between text and spinner)
          pr: 'calc(token(spacing.3.5) + token(spacing.2))',
        },
      },
    },
  })
);

const SlotContainer = styled(
  'span',
  cva({
    base: {
      transition: 'inherit',
      height: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    variants: {
      spanRight: {
        true: {
          // (spinner width) + (spacing between text and spinner)
          pr: 'calc(token(spacing.3.5) + token(spacing.2))',
        },
      },
    },
  })
);

const SpinnerContainer = styled(
  'span',
  cva({
    base: {
      position: 'absolute',
      opacity: 0,
      transition: 'opacity token(durations.fast) ease-in-out',

      '& > span': {
        borderColor: 'inherit',
      },
    },
    variants: {
      size: {
        md: { right: 3 },
        sm: { right: 3 },
        xs: { right: 2.3 },
      },
      show: {
        true: {
          opacity: 1,
        },
      },
    },
    defaultVariants: {
      size: 'md',
    },
  })
);

export interface ButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Container>, 'children'> {
  children?: React.ReactNode;
  loading?: boolean;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, loading, size, leftSlot, rightSlot, className, ...props },
    forwardedRef
  ) => (
    <Container
      ref={forwardedRef}
      size={size}
      className={cx('group', className)}
      {...props}
    >
      <Wrapper className="button-wrapper">
        {!!leftSlot && (
          <SlotContainer className="button-slot-container">
            {leftSlot}
          </SlotContainer>
        )}

        <Text spanRight={!!loading && !props.full && !rightSlot}>
          {children}
        </Text>

        {!!rightSlot && (
          <SlotContainer
            className="button-slot-container"
            spanRight={!!loading && !props.full}
          >
            {rightSlot}
          </SlotContainer>
        )}

        <SpinnerContainer size={size} show={!!loading} aria-hidden>
          <Spinner as="span" />
        </SpinnerContainer>
      </Wrapper>
    </Container>
  )
);

Button.displayName = 'Button';
