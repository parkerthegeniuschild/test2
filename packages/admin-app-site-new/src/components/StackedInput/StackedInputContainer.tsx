import { forwardRef } from 'react';

import { styled } from '@/styled-system/jsx';
import type { SystemStyleObject } from '@/styled-system/types';

const Container = styled('div', {
  base: {
    borderWidth: '1px',
    borderColor: 'gray.200',
    height: 9,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    bgColor: 'white',
    transitionProperty: 'border, background-color',
    transitionDuration: 'fast',
    transitionTimingFunction: 'ease-in-out',

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
      pointerEvents: 'none',
      transition: 'opacity token(durations.fast) ease-in-out',
    },

    '&:not(:last-child)': {
      mb: '-1px',
    },

    _first: {
      roundedTop: 'lg',

      _before: {
        roundedTop: 'calc(token(radii.lg) + 4px)',
      },
    },

    _last: {
      roundedBottom: 'lg',

      _before: {
        roundedBottom: 'calc(token(radii.lg) + 4px)',
      },

      _after: {
        content: '""',
        position: 'absolute',
        bottom: '-1px',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        shadow: 'inset',
        rounded: 'calc(token(radii.lg) - 1px)',
      },
    },

    _focusWithin: {
      borderColor: 'primary',
      zIndex: 2,

      _before: {
        opacity: 0.24,
      },
    },
  },
  variants: {
    error: {
      true: {
        borderColor: 'danger',
        zIndex: 1,

        _before: {
          bgColor: 'danger',
        },

        _focusWithin: {
          borderColor: 'danger',
        },
      },
    },
    disabled: {
      true: {
        bgColor: 'gray.25',
      },
    },
  },
});

const Label = styled('label', {
  base: {
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    flex: 1,
    fontSize: 'sm',
    lineHeight: 1,
    pr: 3,
    color: 'gray.600',
    fontWeight: 'medium',
    height: '100%',
    bgColor: 'inherit',
    rounded: 'inherit',
    position: 'relative',
    whiteSpace: 'nowrap',

    '& .stacked-input-text-input-label-text': {
      bgColor: 'inherit',
      rounded: 'inherit',
      zIndex: 1,
      pl: 3,
      pr: 1.5,
      height: '80%',
      display: 'flex',
      alignItems: 'center',
    },
  },
  variants: {
    required: {
      true: {
        '& .stacked-input-text-input-label-text::after': {
          content: '"*"',
          color: 'danger',
        },
      },
    },
  },
});

export interface StackedInputContainerProps {
  label?: string;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  css?: SystemStyleObject;
}

export const StackedInputContainer = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<StackedInputContainerProps>
>(({ label, children, error, required, disabled, css }, forwardedRef) => (
  <Container ref={forwardedRef} error={error} disabled={disabled} css={css}>
    <Label required={required}>
      {label && (
        <span className="stacked-input-text-input-label-text">{label}</span>
      )}
      {children}
    </Label>
  </Container>
));

StackedInputContainer.displayName = 'StackedInputContainer';
