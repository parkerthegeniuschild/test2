'use client';

import React, { forwardRef, useMemo } from 'react';
import * as Ariakit from '@ariakit/react';

import { css, cva, cx, type RecipeVariantProps } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { Dropdown } from '../Dropdown';
import { Icon } from '../icons';

import { SelectContext } from './SelectContext';
import { SelectGroup } from './SelectGroup';
import { SelectGroupLabel } from './SelectGroupLabel';
import { SelectItem } from './SelectItem';
import { SelectLabel } from './SelectLabel';
import { SelectPopover } from './SelectPopover';
import { SelectSeparator } from './SelectSeparator';

const selectRootStyles = cva({
  base: {
    display: 'flex',
    gap: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'gray.900',
    fontWeight: 'medium',
    fontSize: 'sm',
    lineHeight: 1,
    width: '100%',
    cursor: 'pointer',
    bgColor: 'white',
    borderWidth: '1px',
    borderColor: 'gray.200',
    shadow: 'sm',
    position: 'relative',
    outline: 0,
    userSelect: 'none',
    transitionProperty: 'border-color, color, background-color',
    transitionDuration: 'fast',
    transitionTimingFunction: 'ease-in-out',

    '&[aria-expanded="true"], &[data-focus-visible]': {
      borderColor: 'primary',

      _before: {
        opacity: 0.24,
      },
    },

    _before: {
      content: '""',
      zIndex: -1,
      position: 'absolute',
      inset: 0,
      bgColor: 'primary',
      opacity: 0,
      width: 'calc(100% + 10px)',
      height: 'calc(100% + 10px)',
      transform: 'translate(-5px, -5px)',
      transition: 'opacity token(durations.fast) ease-in-out',
    },

    _after: {
      content: '""',
      position: 'absolute',
      left: 0,
      bottom: '-1px',
      shadow: 'inset',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    },

    _disabled: {
      color: 'gray.500',
      bgColor: 'gray.25',
    },
  },
  variants: {
    size: {
      md: {
        rounded: 'lg',
        height: 9,
        px: 3,

        _before: {
          rounded: 'calc(token(radii.lg) + 4px)',
        },

        _after: {
          rounded: 'calc(token(radii.lg) - 1px)',
        },
      },
      sm: {
        rounded: 'md.xl',
        height: 8,
        px: 2.3,

        _before: {
          rounded: 'calc(token(radii.md.xl) + 4px)',
        },

        _after: {
          rounded: 'calc(token(radii.md.xl) - 1px)',
        },
      },
      xs: {
        fontSize: 'xs',
        rounded: 'md.lg',
        height: 7,
        px: 2,

        _before: {
          rounded: 'calc(token(radii.md.lg) + 4px)',
        },

        _after: {
          rounded: 'calc(token(radii.md.lg) - 1px)',
        },
      },
    },
    error: {
      true: {
        borderColor: 'danger',

        '&[aria-expanded="true"], &[data-focus-visible]': {
          borderColor: 'danger',
        },

        _before: { bgColor: 'danger' },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const Placeholder = styled('span', { base: { color: 'gray.400' } });

export type SelectRootProps = Omit<
  Ariakit.SelectStoreProps,
  'animated' | 'setValue'
> &
  RecipeVariantProps<typeof selectRootStyles> & {
    children?: React.ReactNode;
    label?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    activeText?: React.ReactNode;
    sameWidth?: boolean;
    placeholder?: string;
    render?: Ariakit.SelectProps['render'];
    resetStyles?: boolean;
    showOnFocus?: boolean;
    popoverProps?: Omit<
      React.ComponentPropsWithoutRef<typeof SelectPopover>,
      'store'
    >;
    labelProps?: Omit<
      React.ComponentPropsWithoutRef<typeof SelectLabel>,
      'store'
    >;
    buttonProps?: Omit<Ariakit.SelectProps, 'store'>;
    onChange?: Ariakit.SelectStoreProps['setValue'];
  };

const SelectRoot = forwardRef<HTMLButtonElement, SelectRootProps>(
  (
    {
      children,
      label,
      disabled,
      className,
      size = 'md',
      activeText,
      sameWidth = true,
      placeholder,
      render,
      resetStyles,
      error,
      showOnFocus = false,
      popoverProps,
      labelProps,
      buttonProps,
      onChange,
      ...props
    },
    forwardedRef
  ) => {
    const selectStore = Ariakit.useSelectStore({
      ...props,
      animated: true,
      setValue: onChange,
    });

    const value = selectStore.useState('value');
    const open = selectStore.useState('open');

    const providerValue = useMemo(() => ({ size }), [size]);

    const shouldShowPlaceholder = !value && !activeText && !!placeholder;

    return (
      <>
        {!!label && (
          <SelectLabel {...labelProps} store={selectStore}>
            {label}
          </SelectLabel>
        )}

        <Ariakit.Select
          ref={forwardedRef}
          store={selectStore}
          className={cx(
            resetStyles ? null : selectRootStyles({ size, error }),
            className
          )}
          render={render}
          disabled={disabled}
          {...buttonProps}
          tabIndex={buttonProps?.tabIndex ?? (open ? -1 : undefined)}
          onFocusVisible={(e: React.SyntheticEvent<HTMLElement>) => {
            const event = e as React.FocusEvent<HTMLElement>;

            const userHasInteractedWithSelect =
              event.relatedTarget === selectStore.getState().contentElement;

            if (
              showOnFocus &&
              e.type === 'focus' &&
              !userHasInteractedWithSelect
            ) {
              selectStore.setOpen(true);

              const userHasntSelectedAnOption = !value;

              if (userHasntSelectedAnOption) {
                selectStore.setActiveId(selectStore.first());
              }
            }

            buttonProps?.onFocusVisible?.(e);
          }}
        >
          {shouldShowPlaceholder ? (
            <Placeholder>{placeholder}</Placeholder>
          ) : (
            activeText ?? value
          )}
          <Ariakit.SelectArrow
            render={({ 'aria-hidden': ariaHidden }) => (
              <Icon.Sort
                aria-hidden={ariaHidden}
                className={css({ color: 'gray.500' })}
              />
            )}
          />
        </Ariakit.Select>

        <SelectContext.Provider value={providerValue}>
          <SelectPopover
            store={selectStore}
            gutter={4}
            sameWidth={sameWidth}
            {...popoverProps}
          >
            {children}
          </SelectPopover>
        </SelectContext.Provider>
      </>
    );
  }
);

SelectRoot.displayName = 'Select';

export const Select = Object.assign(SelectRoot, {
  Heading: Dropdown.Heading,
  Item: SelectItem,
  Separator: SelectSeparator,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
});
