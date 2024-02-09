'use client';

import { forwardRef, useReducer } from 'react';

import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { Icon } from '../icons';
import { TextInput, type TextInputProps } from '../TextInput';

const Button = styled(
  'button',
  cva({
    base: {
      appearance: 'none',
      color: 'inherit',
      display: 'flex',
      cursor: 'pointer',
    },
  })
);

type PasswordInputProps = Omit<TextInputProps, 'type' | 'rightSlot'>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, forwardedRef) => {
    const [isShowingPassword, toggleIsShowingPassword] = useReducer(
      state => !state,
      false
    );

    return (
      <TextInput
        {...props}
        ref={forwardedRef}
        type={isShowingPassword ? 'text' : 'password'}
        rightSlot={
          <Button
            type="button"
            title={isShowingPassword ? 'Hide password' : 'Show password'}
            onClick={toggleIsShowingPassword}
          >
            {isShowingPassword ? <Icon.EyeOff /> : <Icon.Eye />}
          </Button>
        }
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
