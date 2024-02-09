import { forwardRef } from 'react';

import type { SystemStyleObject } from '@/styled-system/types';

import { Combobox, type ComboboxProps } from '../Combobox';

import {
  StackedInputContainer,
  type StackedInputContainerProps,
} from './StackedInputContainer';
import { StackedInputTextInput } from './StackedInputTextInput';

const inputStyles: SystemStyleObject = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  px: 3,
  bgColor: 'transparent',
};

type StackedInputComboboxRootProps = Omit<ComboboxProps, 'render'> &
  StackedInputContainerProps & {
    inputProps?: React.ComponentPropsWithoutRef<'input'>;
  };

const StackedInputComboboxRoot = forwardRef<
  HTMLInputElement,
  StackedInputComboboxRootProps
>(({ label, error, inputProps, ...props }, forwardedRef) => (
  <StackedInputContainer
    label={label}
    error={error}
    required={props.required}
    disabled={props.disabled}
  >
    <Combobox
      ref={forwardedRef}
      render={
        <StackedInputTextInput.Input
          css={inputStyles}
          withLabel={!!label}
          {...inputProps}
        />
      }
      {...props}
    />
  </StackedInputContainer>
));

StackedInputComboboxRoot.displayName = 'StackedInputComboboxRoot';

export const StackedInputCombobox = Object.assign(StackedInputComboboxRoot, {
  Item: Combobox.Item,
});
