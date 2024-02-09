import { forwardRef } from 'react';

import { styled } from '@/styled-system/jsx';

import {
  StackedInputContainer,
  type StackedInputContainerProps,
} from './StackedInputContainer';

const Container = styled('div', {
  base: {
    flex: 1,
    height: '100%',
    py: 2,
    pl: 3,
  },
});

const Textarea = styled('textarea', {
  base: {
    outline: 0,
    width: '100%',
    resize: 'none',
    fontSize: 'sm',
    lineHeight: 'md',
    fontWeight: 'medium',
    color: 'gray.900',
    bgColor: 'inherit',

    _placeholder: {
      color: 'gray.400',
    },

    _disabled: {
      color: 'gray.500',
    },
  },
});

type StackedInputTextareaProps = React.ComponentPropsWithoutRef<'textarea'> &
  StackedInputContainerProps;

export const StackedInputTextarea = forwardRef<
  HTMLTextAreaElement,
  StackedInputTextareaProps
>(({ label, error, ...props }, forwardedRef) => (
  <StackedInputContainer
    label={label}
    error={error}
    required={props.required}
    disabled={props.disabled}
    css={{ height: 'auto' }}
  >
    <Container>
      <Textarea ref={forwardedRef} {...props} />
    </Container>
  </StackedInputContainer>
));

StackedInputTextarea.displayName = 'StackedInputTextarea';
