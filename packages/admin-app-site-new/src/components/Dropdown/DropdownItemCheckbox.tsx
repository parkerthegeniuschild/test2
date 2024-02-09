import { forwardRef } from 'react';
import * as Ariakit from '@ariakit/react';

import { styled } from '@/styled-system/jsx';

import { Checkbox } from '../Checkbox';
import { Icon } from '../icons';

import { DropdownItem } from './DropdownItem';

const CheckmarkContainer = styled('div', {
  base: {
    color: 'primary',
    opacity: 0,
    transition: 'opacity token(durations.fast) ease-in-out',
  },
  variants: {
    checked: {
      true: {
        opacity: 1,
      },
    },
  },
});

type DropdownItemCheckboxProps = Ariakit.MenuItemCheckboxProps & {
  children: React.ReactNode;
  checkStyle?: 'checkbox' | 'checkmark';
};

export const DropdownItemCheckbox = forwardRef<
  HTMLDivElement,
  DropdownItemCheckboxProps
>(({ checkStyle = 'checkbox', ...props }, forwardedRef) => {
  return (
    <Ariakit.MenuItemCheckbox
      ref={forwardedRef}
      render={<DropdownItem.Container />}
      {...props}
    >
      <Ariakit.MenuItemCheck
        render={innerProps =>
          checkStyle === 'checkbox' ? (
            <Checkbox.Check
              size="sm"
              checked={!!innerProps.children}
              aria-hidden={innerProps['aria-hidden']}
            />
          ) : (
            <CheckmarkContainer
              checked={!!innerProps.children}
              aria-hidden={innerProps['aria-hidden']}
            >
              <Icon.Check />
            </CheckmarkContainer>
          )
        }
      />
      {props.children}
    </Ariakit.MenuItemCheckbox>
  );
});

DropdownItemCheckbox.displayName = 'DropdownItemCheckbox';
