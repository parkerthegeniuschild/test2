'use client';

import { forwardRef } from 'react';
import * as Ariakit from '@ariakit/react';

import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';
import type { SystemStyleObject } from '@/styled-system/types';

import { DropdownHeading } from './DropdownHeading';
import { DropdownItem } from './DropdownItem';
import { DropdownItemCheckbox } from './DropdownItemCheckbox';
import { DropdownSeparator } from './DropdownSeparator';

const Container = styled(
  'div',
  cva({
    base: {
      bgColor: 'white',
      py: 2,
      rounded: 'lg',
      border: '1px solid token(colors.gray.100)',
      zIndex: 'dropdown',
      minWidth: '11.25rem',
      outline: 0,
      opacity: 0,
      transform: 'scale(0.95)',
      transitionProperty: 'opacity, transform',
      transitionTimingFunction: 'easeInOut',
      transitionDuration: 'fast',

      '&[data-enter]': {
        opacity: 1,
        transform: 'scale(1)',
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
      borderless: {
        true: {
          border: 'none',
        },
      },
    },
    defaultVariants: {
      shadow: 'md',
    },
  })
);

type DropdownProps = React.ComponentPropsWithoutRef<'div'> & {
  trigger: Ariakit.MenuButtonProps['render'];
  gutter?: number;
  portal?: Ariakit.MenuProps['portal'];
  placement?: Ariakit.MenuStoreProps['placement'];
  defaultValues?: Ariakit.MenuStoreProps['defaultValues'];
  values?: Ariakit.MenuStoreProps['values'];
  shadow?: React.ComponentProps<typeof Container>['shadow'];
  borderless?: React.ComponentProps<typeof Container>['borderless'];
  css?: SystemStyleObject;
  unmountOnHide?: boolean;
  onValuesChange?: Ariakit.MenuStoreProps['setValues'];
  open?: Ariakit.MenuStoreProps['open'];
  onOpenChange?: Ariakit.MenuStoreProps['setOpen'];
};

const DropdownRoot = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      children,
      trigger,
      gutter = 4,
      portal,
      placement,
      defaultValues,
      values,
      shadow,
      borderless,
      css,
      open,
      unmountOnHide = false,
      onValuesChange,
      onOpenChange,
      ...props
    },
    forwardedRef
  ) => {
    const menuStore = Ariakit.useMenuStore({
      placement,
      animated: true,
      defaultValues,
      values,
      open,
      setValues: onValuesChange,
      setOpen: onOpenChange,
    });

    return (
      <>
        <Ariakit.MenuButton
          store={menuStore}
          ref={forwardedRef}
          render={trigger}
          {...props}
        />

        <Ariakit.Menu
          render={
            <Container shadow={shadow} borderless={borderless} css={css} />
          }
          store={menuStore}
          gutter={gutter}
          portal={portal}
          unmountOnHide={unmountOnHide}
        >
          {children}
        </Ariakit.Menu>
      </>
    );
  }
);

DropdownRoot.displayName = 'Dropdown';

export const Dropdown = Object.assign(DropdownRoot, {
  Heading: DropdownHeading,
  Item: DropdownItem,
  ItemCheckbox: DropdownItemCheckbox,
  Separator: DropdownSeparator,
});
