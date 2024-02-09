import { forwardRef } from 'react';
import * as Ariakit from '@ariakit/react';

import { styled } from '@/styled-system/jsx';
import type { SystemStyleObject } from '@/styled-system/types';

import { Icon } from '../icons';

import { useCombobox } from './ComboboxContext';

const Container = styled('div', {
  base: {
    px: 4,
    cursor: 'pointer',
    transitionProperty: 'background-color',
    transitionDuration: 'fast',
    transitionTimingFunction: 'ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'gray.900',
    fontSize: 'sm',
    lineHeight: 1,
    gap: 1,

    '&[aria-selected="true"]': {
      bgColor: 'gray.50',
    },

    _active: {
      bgColor: 'transparent',
    },

    _focusVisible: {
      outlineOffset: '-2px',
    },
  },
  variants: {
    size: {
      md: { minHeight: 8 },
      lg: { minHeight: 10 },
    },
    weight: {
      semibold: { fontWeight: 'semibold' },
      medium: { fontWeight: 'medium' },
    },
  },
  defaultVariants: {
    size: 'md',
    weight: 'semibold',
  },
});

const InnerContainer = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
  },
});

const CheckContainer = styled('div', {
  base: {
    color: 'primary.600',
    display: 'none',
  },
  variants: {
    show: {
      true: {
        display: 'block',
      },
    },
  },
});

export type ComboboxItemSize = React.ComponentProps<typeof Container>['size'];

interface ComboboxItemProps extends Ariakit.ComboboxItemProps {
  children?: React.ReactNode;
  endSlot?: React.ReactNode;
  css?: SystemStyleObject;
  active?: boolean;
}

export const ComboboxItem = forwardRef<HTMLDivElement, ComboboxItemProps>(
  ({ children, css, endSlot, active, ...props }, forwardedRef) => {
    const { size, store, weight } = useCombobox();

    const isActive = active ?? store.useState('value') === props.value;

    return (
      <Ariakit.ComboboxItem
        ref={forwardedRef}
        focusOnHover
        render={<Container size={size} weight={weight} css={css} />}
        {...props}
      >
        <InnerContainer>{children ?? props.value}</InnerContainer>

        <InnerContainer gap={1.5}>
          {endSlot}
          <CheckContainer show={isActive} aria-hidden>
            <Icon.Check />
          </CheckContainer>
        </InnerContainer>
      </Ariakit.ComboboxItem>
    );
  }
);

ComboboxItem.displayName = 'ComboboxItem';
