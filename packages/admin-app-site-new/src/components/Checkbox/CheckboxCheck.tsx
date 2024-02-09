import type { CheckboxProps } from '@ariakit/react';

import { css, cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { Icon } from '../icons';

const Container = styled(
  'div',
  cva({
    base: {
      position: 'relative',
      border: '1px solid token(colors.gray.300)',
      bgColor: 'white',
      color: 'white',
      transition: 'all token(durations.fast) ease-in-out',
      shadow: '0px 1px 2px 0px rgba(15, 17, 37, 0.08)',

      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

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
        position: 'absolute',
        bottom: '-1px',
        shadow: '0px -1px 0px 0px rgba(15, 17, 37, 0.12) inset',
        width: '108%',
        height: '100%',
        pointerEvents: 'none',
      },
    },
    variants: {
      size: {
        md: {
          height: 'token(spacing.4.5)',
          width: 'token(spacing.4.5)',
          rounded: 'md',

          '&::before': {
            // (inner radius) + (ring width)
            rounded: 'calc(token(radii.md) + 3px)',
          },

          '&::after': {
            rounded: 'calc(token(radii.md) - 1px)',
          },
        },
        sm: {
          height: 4,
          width: 4,
          rounded: 'sm',

          '&::before': {
            rounded: 'calc(token(radii.sm) + 3px)',
          },

          '&::after': {
            rounded: 'calc(token(radii.sm) - 1px)',
          },
        },
      },
      isFocused: {
        true: {
          borderColor: 'primary',

          '&::before': {
            opacity: 0.24,
          },
        },
      },
      checked: {
        true: {
          borderColor: 'primary',
          bgColor: 'primary',
        },
      },
    },
    defaultVariants: {
      size: 'md',
    },
  })
);

function Check() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 14 14"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12.08 3.088a.583.583 0 010 .824L5.661 10.33a.583.583 0 01-.824 0L1.92 7.412a.583.583 0 01.825-.824L5.25 9.092l6.004-6.004a.583.583 0 01.825 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

type CheckboxCheckProps = {
  size?: React.ComponentProps<typeof Container>['size'];
  isFocused?: boolean;
  checked: CheckboxProps['checked'];
  'aria-hidden'?: React.ComponentProps<typeof Container>['aria-hidden'];
};

export function CheckboxCheck({
  size,
  isFocused,
  checked,
  'aria-hidden': ariaHidden,
}: CheckboxCheckProps) {
  return (
    <Container
      size={size}
      isFocused={isFocused}
      checked={!!checked}
      aria-hidden={ariaHidden}
    >
      {checked === true && <Check />}
      {checked === 'mixed' && (
        <Icon.Minus className={css({ fontSize: 'sm' })} />
      )}
    </Container>
  );
}
