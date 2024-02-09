import { forwardRef } from 'react';

import { cva, cx } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { Icon } from '../icons';

const Wrapper = styled(
  'div',
  cva({
    base: {
      zIndex: 0,
      position: 'relative',
    },
  })
);

const Container = styled(
  'div',
  cva({
    base: {
      position: 'relative',
      bgColor: 'white',
      border: '1px solid',
      borderColor: 'gray.200',
      display: 'flex',
      alignItems: 'center',
      transitionProperty: 'border-color, background-color',
      transitionDuration: 'fast',
      transitionTimingFunction: 'ease-in-out',
      shadow: 'sm',

      '&:focus-within': {
        borderColor: 'primary',
      },

      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-1px',
        shadow: 'inset',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      },
    },
    variants: {
      size: {
        md: {
          rounded: 'lg',
          height: 9,
          '--padding-x': 'token(spacing.3)',

          '& .focus-border': {
            // (inner radius) + (ring width)
            rounded: 'calc(token(radii.lg) + 4px)',
          },

          '&::after': {
            // (parent border radius) - 1px
            rounded: 'calc(token(radii.lg) - 1px)',
          },
        },
        sm: {
          rounded: 'md.xl',
          height: 8,
          '--padding-x': 'token(spacing.2.3)',

          '& .focus-border': {
            rounded: 'calc(token(radii.md.xl) + 4px)',
          },

          '&::after': {
            rounded: 'calc(token(radii.md.xl) - 1px)',
          },
        },
      },
      error: {
        true: {
          borderColor: 'danger',

          '&:focus-within': {
            borderColor: 'danger',
          },

          '& .focus-border': {
            bgColor: 'danger',
          },
        },
      },
      disabled: {
        true: {
          bgColor: 'gray.25',
        },
      },
    },
    defaultVariants: {
      size: 'md',
    },
  })
);

const Input = styled(
  'input',
  cva({
    base: {
      bgColor: 'transparent',
      outline: 0,
      fontFamily: 'inter',
      color: 'gray.900',
      fontWeight: 'medium',
      fontSize: 'sm',
      lineHeight: 1,
      height: '100%',
      width: '100%',
      rounded: 'inherit',
      px: 'var(--padding-x)',
      transitionProperty: 'color',
      transitionDuration: 'fast',
      transitionTimingFunction: 'ease-in-out',

      '&:-webkit-autofill': {
        // @ts-expect-error Custom property not mapped on Panda types
        '-webkit-box-shadow': '0 0 0px 1000px token(colors.white) inset',
      },

      '&::-webkit-calendar-picker-indicator': {
        display: 'none!',
        bgColor: 'inherit!',
        opacity: '0!',
      },

      '&::placeholder': {
        color: 'gray.400',
      },

      _disabled: {
        color: 'gray.500',
      },
    },
  })
);

const FocusBorder = styled(
  'div',
  cva({
    base: {
      zIndex: -1,
      position: 'absolute',
      inset: 0,
      bgColor: 'primary',
      opacity: 0,
      width: 'calc(100% + 10px)',
      height: 'calc(100% + 10px)',
      transform: 'translate(-5px, -5px)',
      rounded: 'inherit',
      transition: 'opacity token(durations.fast) ease-in-out',

      'input:focus ~ &': {
        opacity: 0.24,
      },
    },
  })
);

const SlotContainer = styled(
  'div',
  cva({
    base: {
      color: 'gray.400',
      fontSize: 'sm',
      lineHeight: 1,
      fontWeight: 'medium',
      cursor: 'default',
      userSelect: 'none',
    },
    variants: {
      side: {
        left: {
          ml: 'var(--padding-x)',
          // (input left padding) - (distance between input and left slot)
          mr: 'calc(0px - (var(--padding-x) - token(spacing.2) + 1px))',
        },
        right: {
          mr: 'var(--padding-x)',
          // (input right padding) - (distance between input and right slot)
          ml: 'calc(0px - (var(--padding-x) - token(spacing.2) + 1px))',
        },
      },
    },
  })
);

const ClearButton = styled(
  'button',
  cva({
    base: {
      appearance: 'none',
      cursor: 'pointer',
      display: 'flex',
      color: 'inherit',
      fontSize: '2xs.xl',
      transition: 'color token(durations.fast) ease-in-out',

      _hover: {
        color: 'gray.500',
      },
    },
  })
);

export type TextInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'size'
> & {
  containerProps?: React.ComponentProps<typeof Container>;
  size?: React.ComponentProps<typeof Container>['size'];
  error?: React.ComponentProps<typeof Container>['error'];
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      containerProps,
      size,
      error,
      leftSlot,
      rightSlot,
      clearable,
      onClear,
      ...props
    },
    forwardedRef
  ) => (
    <Wrapper>
      <Container
        size={size}
        error={error}
        disabled={props.disabled}
        {...containerProps}
      >
        {!!leftSlot && <SlotContainer side="left">{leftSlot}</SlotContainer>}
        <Input
          {...props}
          ref={forwardedRef}
          className={cx('text-input', props.className)}
        />
        {!!rightSlot && <SlotContainer side="right">{rightSlot}</SlotContainer>}
        {!!clearable && (
          <SlotContainer side="right">
            <ClearButton type="button" title="Clear input" onClick={onClear}>
              <Icon.TimesCircle aria-hidden />
            </ClearButton>
          </SlotContainer>
        )}

        <FocusBorder aria-hidden className="focus-border" />
      </Container>
    </Wrapper>
  )
);

TextInput.displayName = 'TextInput';
