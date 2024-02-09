import * as Ariakit from '@ariakit/react';

import { cva, cx, type RecipeVariantProps } from '@/styled-system/css';

const selectPopoverStyles = cva({
  base: {
    zIndex: 'popover',
    bgColor: 'white',
    rounded: 'lg',
    borderWidth: '1px',
    borderColor: 'gray.100',
    py: 2,
    outline: 0,
    opacity: 0,
    transform: 'translateY(-0.5rem) scale(0.95)',
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: 'easeInOut',
    transitionDuration: 'fast',

    '&[data-enter]': {
      opacity: 1,
      transform: 'translateY(0) scale(1)',
    },

    '&[data-leave]': {
      transitionDuration: '1ms',
    },
  },
  variants: {
    shadow: {
      sm: {
        shadow: 'menu.sm',
      },
      md: {
        shadow: 'menu.md',
      },
    },
  },
  defaultVariants: {
    shadow: 'md',
  },
});

type SelectPopoverProps = Ariakit.SelectPopoverProps &
  RecipeVariantProps<typeof selectPopoverStyles>;

export function SelectPopover({
  className,
  shadow,
  ...props
}: SelectPopoverProps) {
  return (
    <Ariakit.SelectPopover
      {...props}
      className={cx(selectPopoverStyles({ shadow }), className)}
    />
  );
}
