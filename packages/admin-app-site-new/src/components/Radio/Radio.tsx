'use client';

import { useState } from 'react';
import * as Ariakit from '@ariakit/react';

import { styled } from '@/styled-system/jsx';

interface RadioGroupProps {
  defaultValue?: Ariakit.RadioProviderProps['defaultValue'];
  value?: Ariakit.RadioProviderProps['value'];
  onChange?: Ariakit.RadioProviderProps['setValue'];
}

function RadioGroup({
  children,
  defaultValue,
  value,
  onChange,
}: React.PropsWithChildren<RadioGroupProps>) {
  return (
    <Ariakit.RadioProvider
      defaultValue={defaultValue}
      value={value}
      setValue={onChange}
    >
      <Ariakit.RadioGroup>{children}</Ariakit.RadioGroup>
    </Ariakit.RadioProvider>
  );
}

const Label = styled('label', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    cursor: 'pointer',
    maxWidth: 'max',
    fontSize: 'sm',
    lineHeight: 1,
    fontWeight: 'medium',
    color: 'gray.600',
    userSelect: 'none',
  },
});

const Container = styled('span', {
  base: {
    width: '1.125rem',
    height: '1.125rem',
    borderWidth: '1px',
    borderColor: 'gray.300',
    rounded: 'full',
    shadow: '0px 1px 2px 0px rgba(15, 17, 37, 0.08)',
    bgColor: 'white',
    transition: 'all token(durations.fast) ease-in-out',
    position: 'relative',

    _before: {
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
      rounded: 'inherit',
    },

    _after: {
      content: '""',
      position: 'absolute',
      bottom: '-1px',
      left: '-1px',
      width: 'inherit',
      height: 'inherit',
      pointerEvents: 'none',
      shadow: '0px -1px 0px 0px rgba(15, 17, 37, 0.12) inset',
      rounded: 'inherit',
    },
  },
  variants: {
    isFocused: {
      true: {
        borderColor: 'primary',

        _before: {
          opacity: 0.24,
        },
      },
    },
    isSelected: {
      true: {
        bgColor: 'primary',
        borderColor: 'primary',
      },
    },
  },
});

const Dot = styled('span', {
  base: {
    width: '0.4375rem',
    height: '0.4375rem',
    bgColor: 'white',
    rounded: 'full',
    opacity: 0,
    transform: 'scale(1.25) translate(-50%, -50%)',
    pointerEvents: 'none',
    transition:
      'opacity token(durations.fast) ease-in-out, transform token(durations.fast) ease-in-out',
    position: 'absolute',
    top: '50%',
    left: '50%',
    shadow: '0px 1px 2px rgba(1, 2, 3, 0.08), 0px 1px 4px rgba(1, 2, 3, 0.04)',
  },
  variants: {
    show: {
      true: {
        opacity: 1,
        transform: 'scale(1) translate(-50%, -50%)',
      },
    },
  },
});

function RadioRoot({
  value,
  children,
  ...props
}: React.PropsWithChildren<Ariakit.RadioProps>) {
  const radioContext = Ariakit.useRadioContext();

  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const isSelected = radioContext?.useState('value') === value;

  return (
    <Label>
      <Ariakit.VisuallyHidden>
        <Ariakit.Radio
          value={value}
          onFocusVisible={() => setIsFocusVisible(true)}
          onBlur={() => setIsFocusVisible(false)}
          {...props}
        />
      </Ariakit.VisuallyHidden>

      <Container isFocused={isFocusVisible} isSelected={isSelected}>
        <Dot show={isSelected} />
      </Container>

      {children}
    </Label>
  );
}

export const Radio = Object.assign(RadioRoot, {
  Group: RadioGroup,
});
