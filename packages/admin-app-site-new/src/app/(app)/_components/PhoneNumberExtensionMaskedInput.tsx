import { forwardRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { useMask } from '@react-input/mask';

import { StackedInput } from '@/components';

export const PhoneNumberExtensionMaskedInput = forwardRef<
  HTMLInputElement,
  Omit<
    React.ComponentPropsWithoutRef<typeof StackedInput.TextInput.SubInput>,
    'placeholder'
  >
>((props, forwardedRef) => {
  const inputRef = useMask({ mask: '______', replacement: { _: /\d/ } });

  return (
    <StackedInput.TextInput.SubInput
      ref={mergeRefs([inputRef, forwardedRef])}
      placeholder="Ext"
      {...props}
    />
  );
});

PhoneNumberExtensionMaskedInput.displayName = 'PhoneNumberExtensionMaskedInput';
