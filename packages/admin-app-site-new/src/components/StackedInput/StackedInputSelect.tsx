import { forwardRef } from 'react';

import { styled } from '@/styled-system/jsx';

import { Select, type SelectProps } from '../Select';

import {
  StackedInputContainer,
  type StackedInputContainerProps,
} from './StackedInputContainer';

const Container = styled('button', {
  base: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    fontSize: 'sm',
    lineHeight: 1,
    fontWeight: 'medium',
    color: 'gray.900',
    cursor: 'pointer',
    outline: 0,
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    px: 3,
  },
  variants: {
    hasLabel: {
      true: { justifyContent: 'flex-end' },
    },
  },
});

type StackedInputSelectRootProps = Omit<
  SelectProps,
  'resetStyles' | 'label' | 'render'
> &
  StackedInputContainerProps;

const StackedInputSelectRoot = forwardRef<
  HTMLButtonElement,
  StackedInputSelectRootProps
>(({ label, error, required, disabled, ...props }, forwardedRef) => (
  <StackedInputContainer
    label={label}
    error={error}
    required={required}
    disabled={disabled}
  >
    <Select
      {...props}
      ref={forwardedRef}
      resetStyles
      render={<Container hasLabel={!!label} />}
      buttonProps={{ disabled, ...props.buttonProps }}
      popoverProps={{ gutter: 5, ...props.popoverProps }}
    />
  </StackedInputContainer>
));

StackedInputSelectRoot.displayName = 'StackedInputSelect';

export const StackedInputSelect = Object.assign(StackedInputSelectRoot, {
  Item: Select.Item,
});
