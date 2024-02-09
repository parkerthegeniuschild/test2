import * as Ariakit from '@ariakit/react';

import { css, cva, cx } from '@/styled-system/css';

import { Icon } from '../icons';

import { useSelect } from './SelectContext';

const selectItemStyles = cva({
  base: {
    color: 'gray.900',
    fontWeight: 'medium',
    px: 4,
    py: 1.75,
    cursor: 'pointer',
    transition: 'background-color token(durations.fast) ease-in-out',
    display: 'flex',
    alignItems: 'center',
    gap: 2.3,

    _hover: {
      bgColor: 'gray.50',
    },

    _active: {
      bgColor: 'transparent',
    },

    '&[aria-selected="true"] .select-item-check-icon': {
      opacity: 1,
    },

    '& .select-item-check-icon': {
      color: 'primary',
      opacity: 0,
    },
  },
  variants: {
    size: {
      md: { fontSize: 'sm', lineHeight: 'sm' },
      sm: { fontSize: 'sm', lineHeight: 'sm' },
      xs: { fontSize: 'xs', lineHeight: 1 },
    },
  },
});

const checkWrapperStyles = css({
  height: 3,
  width: 3,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  '& .select-item-check-icon': {
    flexShrink: 0,
  },
});

type SelectItemProps = Ariakit.SelectItemProps & {
  children?: React.ReactNode;
};

export function SelectItem({ className, children, ...props }: SelectItemProps) {
  const { size } = useSelect();

  return (
    <Ariakit.SelectItem
      {...props}
      className={cx(selectItemStyles({ size }), className)}
    >
      <div aria-hidden className={checkWrapperStyles}>
        <Icon.Check className="select-item-check-icon" />
      </div>
      {children ?? props.value}
    </Ariakit.SelectItem>
  );
}
