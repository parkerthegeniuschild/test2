import { forwardRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { useMask } from '@react-input/mask';

import { StackedInput } from '@/components';

export const UsdotMaskedInput = forwardRef<
  HTMLInputElement,
  Omit<
    React.ComponentPropsWithoutRef<typeof StackedInput.TextInput>,
    'placeholder'
  >
>((props, forwardedRef) => {
  const inputRef = useMask({ mask: '________', replacement: { _: /\d/ } });

  return (
    <StackedInput.TextInput
      ref={mergeRefs([inputRef, forwardedRef])}
      placeholder="Enter USDOT #"
      {...props}
    />
  );
});

UsdotMaskedInput.displayName = 'UsdotMaskedInput';
