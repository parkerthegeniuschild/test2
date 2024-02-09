'use client';

import { useState } from 'react';

import { styled } from '@/styled-system/jsx';

import { Icon } from '../icons';

const Container = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row-reverse',
    width: '3.125rem',
    height: 8,
    shadow: 'sm',
    rounded: 'md.xl',
    position: 'relative',
    bgColor: 'white',

    _after: {
      content: '""',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      shadow: 'inset',
      rounded: 'inherit',
    },
  },
  variants: {
    disabled: {
      true: {
        bgColor: 'gray.25',
      },
    },
  },
});

const Input = styled('input', {
  base: {
    width: '100%',
    height: '100%',
    outline: 'none',
    textAlign: 'center',
    fontSize: 'sm',
    lineHeight: 1,
    fontWeight: 'medium',
    color: 'gray.900',
    roundedLeft: 'inherit',
    borderWidth: '1px',
    borderColor: 'gray.200',
    bgColor: 'inherit',
    position: 'relative',
    transition: 'all token(durations.fast) ease-in-out',
    shadow: '0 0 0 4px transparent',

    _placeholder: {
      color: 'gray.400',
    },

    _focus: {
      borderColor: 'primary',
      shadow: '0 0 0 4px rgba(0, 204, 102, 0.24)',
    },

    _disabled: {
      color: 'gray.500',

      _placeholder: {
        color: 'gray.300',
      },
    },
  },
  variants: {
    error: {
      true: {
        '&:not(:disabled)': {
          borderColor: 'danger',

          _focus: {
            borderColor: 'danger',
            shadow: '0 0 0 4px rgba(242, 93, 38, 0.24)',
          },
        },
      },
    },
  },
});

const StepperContainer = styled('div', {
  base: {
    bgColor: 'white',
    height: '100%',
    width: 5,
    flexShrink: 0,
    roundedRight: 'inherit',
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderColor: 'gray.200',
    transition: 'all token(durations.fast) ease-in-out',
    display: 'flex',
    flexDirection: 'column',

    '&:focus-within + input': {
      borderColor: 'primary',
      shadow: '0 0 0 4px rgba(0, 204, 102, 0.24)',
    },
  },
  variants: {
    error: { true: { borderColor: 'danger' } },
    disabled: { true: {} },
  },
  compoundVariants: [
    {
      error: true,
      disabled: true,
      css: { borderColor: 'gray.200' },
    },
  ],
});

const Stepper = styled('button', {
  base: {
    '--stepper-caret-padding': '0.34375rem',
    flex: 1,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    color: 'gray.500',

    '&:hover:not(:disabled)': {
      color: 'gray.900',
    },

    '&:active:not(:disabled)': {
      color: 'gray.500',
      bgColor: 'gray.50',
    },

    _disabled: {
      cursor: 'default',
      opacity: 0.28,
    },
  },
  variants: {
    type: {
      increment: {
        alignItems: 'flex-end',
        pb: 'var(--stepper-caret-padding)',
        roundedTopRight: 'md.lg',
      },
      decrement: {
        alignItems: 'flex-start',
        pt: 'var(--stepper-caret-padding)',
        roundedBottomRight: 'md.lg',
      },
    },
  },
});

const StepperSeparator = styled('hr', {
  base: {
    height: 0,
    width: '100%',
    borderTopWidth: '1px',
    borderColor: 'inherit',
  },
});

type NumberInputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'onChange' | 'value' | 'min' | 'defaultValue'
> & {
  defaultValue?: string;
  value?: string;
  error?: boolean;
  precision?: number;
  min?: number;
  onChange?: (value: string) => void;
};

export function NumberInput({
  error,
  precision,
  value,
  min,
  disabled,
  defaultValue,
  onChange,
  onBlur,
  onKeyDown,
  ...props
}: NumberInputProps) {
  const [localValue, setLocalValue] = useState(defaultValue ?? '');

  const isControlled = typeof value === 'string';
  const computedValue = isControlled ? value : localValue;
  const isFloat = (precision ?? 0) > 0;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;

    const isValidNumber = isFloat
      ? /^-?\d*\.?\d*$/.test(newValue)
      : /^-?\d*$/.test(newValue);

    if (!isValidNumber) return;

    onChange?.(newValue);
    setLocalValue(newValue);
  }

  function handleBumpNumber(type: 'increase' | 'decrease') {
    if (disabled) {
      return;
    }

    const bump = type === 'increase' ? 1 : -1;

    let newValue = computedValue ? Number(computedValue) + bump : bump;

    if (Number.isNaN(newValue)) {
      newValue = 0;
    }

    if (typeof min === 'number' && newValue < min) {
      newValue = min;
    }

    onChange?.(newValue.toString());
    setLocalValue(newValue.toString());
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const isValidNumber = !Number.isNaN(Number.parseFloat(computedValue));

    let newValue = isValidNumber ? computedValue : '';
    const newValueNumber = newValue ? Number.parseFloat(newValue) : null;

    if (
      computedValue !== '' &&
      typeof min === 'number' &&
      (newValueNumber ?? -Infinity) < min
    ) {
      newValue = min.toString();
    }

    onChange?.(newValue);
    onBlur?.(e);
    setLocalValue(newValue);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleBumpNumber('increase');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleBumpNumber('decrease');
    }

    onKeyDown?.(e);
  }

  return (
    <Container disabled={disabled}>
      <StepperContainer aria-hidden error={error} disabled={disabled}>
        <Stepper
          type="increment"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => handleBumpNumber('increase')}
        >
          <Icon.CaretUp />
        </Stepper>
        <StepperSeparator />
        <Stepper
          type="decrement"
          tabIndex={-1}
          disabled={
            disabled ||
            (typeof min === 'number' && computedValue === min.toString())
          }
          onClick={() => handleBumpNumber('decrease')}
        >
          <Icon.CaretDown />
        </Stepper>
      </StepperContainer>

      <Input
        type="text"
        inputMode="decimal"
        role="spinbutton"
        disabled={disabled}
        aria-valuemin={min ?? Number.MIN_SAFE_INTEGER}
        aria-valuemax={Number.MAX_SAFE_INTEGER}
        autoComplete="off"
        autoCorrect="off"
        error={error}
        value={value ?? localValue}
        aria-valuenow={
          Number.isNaN(Number.parseFloat(value ?? localValue))
            ? undefined
            : Number(value ?? localValue)
        }
        aria-valuetext={value ?? (localValue || undefined)}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </Container>
  );
}
