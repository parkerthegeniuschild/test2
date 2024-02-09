'use client';

import { forwardRef, useState } from 'react';
import * as Ariakit from '@ariakit/react';

import type { SystemStyleObject } from '@/styled-system/types';

import { Label } from '../Label';

import { CheckboxCheck } from './CheckboxCheck';

const labelStyles: SystemStyleObject = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  color: 'gray.700',
  cursor: 'pointer',
  userSelect: 'none',
  position: 'relative',
  zIndex: 0,
};

type CheckboxProps = {
  children?: React.ReactNode;
  size?: React.ComponentProps<typeof CheckboxCheck>['size'];
  labelProps?: React.ComponentProps<typeof Label>;
} & Omit<React.ComponentProps<typeof Ariakit.Checkbox>, 'size'>;

const CheckboxRoot = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ children, size, labelProps, ...props }, forwardedRef) => {
    const checkboxStore = Ariakit.useCheckboxStore({ value: props.checked });

    const [isFocusVisible, setIsFocusVisible] = useState(false);

    const checked = checkboxStore.useState('value');

    return (
      <Label {...labelProps} css={{ ...labelStyles, ...labelProps?.css }}>
        <Ariakit.VisuallyHidden>
          <Ariakit.Checkbox
            {...props}
            ref={forwardedRef}
            store={checkboxStore}
            clickOnEnter
            onFocusVisible={() => setIsFocusVisible(true)}
            onBlur={() => setIsFocusVisible(false)}
          />
        </Ariakit.VisuallyHidden>

        <CheckboxCheck
          checked={checked as Ariakit.CheckboxProps['checked']}
          isFocused={isFocusVisible}
          size={size}
        />

        {children}
      </Label>
    );
  }
);

CheckboxRoot.displayName = 'Checkbox';

export const Checkbox = Object.assign(CheckboxRoot, { Check: CheckboxCheck });
