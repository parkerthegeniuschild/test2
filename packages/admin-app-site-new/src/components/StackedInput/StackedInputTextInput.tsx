import { forwardRef } from 'react';

import { styled } from '@/styled-system/jsx';
import type { SystemStyleObject } from '@/styled-system/types';

import {
  StackedInputContainer,
  type StackedInputContainerProps,
} from './StackedInputContainer';

const inputStyles: SystemStyleObject = {
  outline: 0,
  fontSize: 'sm',
  lineHeight: 1,
  fontWeight: 'medium',
  color: 'gray.900',
  bgColor: 'transparent',
  width: '100%',

  '&:-webkit-autofill': {
    // @ts-expect-error Custom property not mapped on Panda types
    '-webkit-box-shadow': '0 0 0px 1000px token(colors.white) inset',
  },

  _placeholder: {
    color: 'gray.400',
  },

  _disabled: {
    color: 'gray.500',
  },
};

const Input = styled('input', {
  base: inputStyles,
  variants: {
    withLabel: {
      true: { textAlign: 'right' },
      false: { textAlign: 'left', pl: 3 },
    },
  },
});

const SubInput = styled('input', {
  base: {
    ...inputStyles,
    textAlign: 'left',
    maxWidth: '3.4375rem',
    ml: 3,
  },
});

type StackedInputTextInputProps = React.ComponentPropsWithoutRef<'input'> &
  StackedInputContainerProps;

const StackedInputTextInputRoot = forwardRef<
  HTMLInputElement,
  StackedInputTextInputProps
>(({ label, error, children, ...props }, forwardedRef) => (
  <StackedInputContainer
    label={label}
    error={error}
    required={props.required}
    disabled={props.disabled}
  >
    <Input
      ref={forwardedRef}
      {...props}
      css={{ flex: 1 }}
      withLabel={!!label}
    />

    {children}
  </StackedInputContainer>
));

StackedInputTextInputRoot.displayName = 'StackedInputTextInput';

export const StackedInputTextInput = Object.assign(StackedInputTextInputRoot, {
  Input,
  SubInput,
});
