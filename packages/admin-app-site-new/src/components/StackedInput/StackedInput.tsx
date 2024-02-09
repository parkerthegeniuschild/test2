'use client';

import { styled } from '@/styled-system/jsx';

import { StackedInputCombobox } from './StackedInputCombobox';
import { StackedInputSelect } from './StackedInputSelect';
import { StackedInputTextarea } from './StackedInputTextarea';
import { StackedInputTextInput } from './StackedInputTextInput';

const StackedInputRoot = styled('div', {
  base: {
    shadow: 'sm',
    rounded: 'lg',
  },
});

const HStack = styled('div', {
  base: {
    display: 'flex',

    '&:not(:last-of-type)': {
      mb: '-1px',
    },

    _firstOfType: {
      '& > *': {
        _firstOfType: {
          roundedTopLeft: 'lg!',

          _before: {
            roundedTopLeft: 'calc(token(radii.lg) + 4px)!',
          },
        },

        _lastOfType: {
          roundedTopRight: 'lg!',

          _before: {
            roundedTopRight: 'calc(token(radii.lg) + 4px)!',
          },
        },
      },
    },

    _lastOfType: {
      position: 'relative',

      _after: {
        content: '""',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        shadow: 'inset',
        rounded: 'lg',
        zIndex: 2,
      },

      '& > *': {
        _firstOfType: {
          roundedBottomLeft: 'lg!',

          _before: {
            roundedBottomLeft: 'calc(token(radii.lg) + 4px)!',
          },
        },

        _lastOfType: {
          roundedBottomRight: 'lg!',

          _before: {
            roundedBottomRight: 'calc(token(radii.lg) + 4px)!',
          },
        },
      },
    },

    '& > *': {
      rounded: '0!',
      flex: 1,

      '&:not(:last-child)': {
        mr: '-1px',
      },

      _before: {
        rounded: '0!',
      },

      _after: {
        display: 'none',
      },
    },
  },
});

export const StackedInput = Object.assign(StackedInputRoot, {
  Combobox: StackedInputCombobox,
  TextInput: StackedInputTextInput,
  Textarea: StackedInputTextarea,
  Select: StackedInputSelect,
  HStack,
});
