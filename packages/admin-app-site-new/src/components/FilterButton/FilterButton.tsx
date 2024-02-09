'use client';

import { forwardRef } from 'react';
import * as Ariakit from '@ariakit/react';

import { css } from '@/styled-system/css';

import { Button, type ButtonProps } from '../Button';
import { Icon } from '../icons';

const clearFilterStyles = css({
  fontSize: 'sm',
  color: 'gray.400',
  transition: 'color token(durations.fast) ease-in-out',

  _hover: {
    color: 'gray.500',
  },
});

const chevronStyles = css({
  color: 'gray.500',
  transition: 'color token(durations.medium) ease-in-out',
  width: '0.625rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '& svg': {
    flexShrink: 0,
  },

  _groupHover: {
    color: 'gray.900',
  },

  _groupActive: {
    color: 'gray.500',
  },
});

const activeTextStyles = css({ fontWeight: 'medium', color: 'primary.600' });

type FilterButtonProps = ButtonProps & {
  activeText?: string;
  onClear?: () => void;
};

export const FilterButton = forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ children, activeText, onClear, ...props }, forwardedRef) => (
    <Button
      {...props}
      ref={forwardedRef}
      variant="secondary"
      size="sm"
      leftSlot={
        activeText ? (
          <Ariakit.Focusable
            title="Clear filter"
            className={clearFilterStyles}
            onClick={e => {
              e.stopPropagation();
              onClear?.();
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onClear?.();
              }
            }}
          >
            <Icon.TimesCircle aria-hidden />
          </Ariakit.Focusable>
        ) : null
      }
      rightSlot={
        <span className={chevronStyles}>
          <Icon.ChevronDown />
        </span>
      }
    >
      {children}
      {!!activeText && (
        <>
          : <span className={activeTextStyles}>{activeText}</span>
        </>
      )}
    </Button>
  )
);

FilterButton.displayName = 'FilterButton';
