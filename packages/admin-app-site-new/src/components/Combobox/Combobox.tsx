'use client';

import { forwardRef, useMemo } from 'react';
import * as Ariakit from '@ariakit/react';

import { styled } from '@/styled-system/jsx';

import { TextInput, type TextInputProps } from '../TextInput';

import { ComboboxContext } from './ComboboxContext';
import { ComboboxGroup } from './ComboboxGroup';
import { ComboboxItem, type ComboboxItemSize } from './ComboboxItem';

const Container = styled('div', {
  base: {
    bgColor: 'white',
    rounded: 'lg',
    shadow: 'menu.sm',
    borderWidth: '1px',
    borderColor: 'gray.100',
    zIndex: 'popover',
    opacity: 0,
    transitionDuration: 'fast',
    transitionTimingFunction: 'easeInOut',

    _empty: {
      display: 'none',
    },

    '&[data-side^="bottom"]': {
      transform: 'translateY(-0.5rem)',
    },

    '&[data-side^="top"]': {
      transform: 'translateY(0.5rem)',
    },

    '&[data-enter]': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
});

const ScrollContainer = styled('div', {
  base: {
    maxHeight: '17.75rem',
    py: 2,
    overflow: 'auto',
    overscrollBehavior: 'contain',

    _empty: {
      display: 'none',
    },
  },
});

const FixedContainer = styled('div', {
  base: {
    borderColor: 'gray.100',
    py: 2,
    borderBottomWidth: '1px',

    _only: {
      borderBottomWidth: 0,
    },
  },
});

export interface ComboboxRootProps
  extends Omit<
    Ariakit.ComboboxProps,
    'store' | 'onChange' | 'size' | 'children'
  > {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  gutter?: number;
  size?: ComboboxItemSize;
  fixedSlot?: React.ReactNode;
  open?: boolean;
  scrollContainerProps?: React.ComponentPropsWithoutRef<typeof FixedContainer>;
  error?: boolean;
  showOnFocus?: boolean;
  portal?: boolean;
  inputProps?: TextInputProps;
  unmountOnHide?: boolean;
  onChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
}

const ComboboxRoot = forwardRef<HTMLInputElement, ComboboxRootProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      children,
      gutter = 5,
      size,
      fixedSlot,
      open,
      scrollContainerProps,
      showOnFocus = true,
      portal = true,
      autoSelect = true,
      inputProps,
      unmountOnHide,
      onOpenChange,
      ...props
    },
    forwardedRef
  ) => {
    const comboboxStore = Ariakit.useComboboxStore({
      animated: true,
      defaultValue,
      value,
      open,
      setValue: onChange,
      setOpen(_open) {
        onOpenChange?.(_open);

        if (_open && autoSelect) {
          comboboxStore.setActiveId(comboboxStore.first());
        }
      },
    });

    const providerValue = useMemo(
      () => ({ store: comboboxStore, size }),
      [comboboxStore, size]
    );

    const fixedContainerProviderValue = useMemo(
      () => ({
        store: comboboxStore,
        size: 'md' as const,
        weight: 'medium' as const,
      }),
      [comboboxStore]
    );

    const currentPlacement = comboboxStore.useState('currentPlacement');

    return (
      <ComboboxContext.Provider value={providerValue}>
        <Ariakit.Combobox
          ref={forwardedRef}
          store={comboboxStore}
          autoSelect={autoSelect}
          render={<TextInput {...inputProps} />}
          {...props}
          onFocus={e => {
            const userHasSelectedAnOption =
              e.relatedTarget?.getAttribute('role') === 'option';

            if (showOnFocus && !userHasSelectedAnOption) {
              comboboxStore.setOpen(true);
            }

            props.onFocus?.(e);
          }}
        />

        <Ariakit.ComboboxPopover
          store={comboboxStore}
          render={<Container />}
          data-side={currentPlacement}
          portal={portal}
          sameWidth
          gutter={gutter}
          unmountOnHide={unmountOnHide}
        >
          {!!fixedSlot && (
            <ComboboxContext.Provider value={fixedContainerProviderValue}>
              <FixedContainer>{fixedSlot}</FixedContainer>
            </ComboboxContext.Provider>
          )}

          {((children && !Array.isArray(children)) ||
            (Array.isArray(children) && children.some(Boolean))) && (
            <ScrollContainer {...scrollContainerProps}>
              {children}
            </ScrollContainer>
          )}
        </Ariakit.ComboboxPopover>
      </ComboboxContext.Provider>
    );
  }
);

ComboboxRoot.displayName = 'Combobox';

export const Combobox = Object.assign(ComboboxRoot, {
  Item: ComboboxItem,
  Group: ComboboxGroup,
});
