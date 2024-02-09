'use client';

import React, { cloneElement } from 'react';

import { styled } from '@/styled-system/jsx';

import { Button, type ButtonProps } from '../Button';
import { IconButton } from '../IconButton';

const Container = styled('div', {
  base: {
    '& > *': {
      fontSize: 'sm!',

      '&:not(:last-of-type)': {
        mr: '-1px',
        roundedRight: 0,
      },

      '&:not(:first-of-type):not(:last-of-type)': {
        roundedLeft: 0,

        _before: {
          rounded: 0,
        },
      },

      _firstOfType: {
        _before: {
          roundedRight: 0,
        },
      },

      _lastOfType: {
        roundedLeft: 0,

        _before: {
          roundedLeft: 'inherit',
        },
      },

      _focus: {
        zIndex: 1,
      },
    },
  },
});

interface ButtonGroupProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Container>,
    'role' | 'children'
  > {
  children?: React.ReactNode[];
  variant?: 'secondary';
  label?: string;
  size?: ButtonProps['size'];
}

export function ButtonGroup({
  label,
  variant = 'secondary',
  children,
  size = 'xs',
  ...props
}: ButtonGroupProps) {
  const buttons = children?.filter(
    child =>
      typeof child === 'object' &&
      ((child as React.ReactElement)?.type === Button ||
        (child as React.ReactElement)?.type === IconButton)
  ) as React.ReactElement[];

  if (!buttons?.length) {
    return null;
  }

  return (
    <Container role="group" aria-label={label} {...props}>
      {buttons.map((child, index) => {
        return cloneElement(child, {
          // eslint-disable-next-line react/no-array-index-key
          key: index,
          variant,
          size,
        });
      })}
    </Container>
  );
}
