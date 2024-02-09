import { forwardRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { useMask } from '@react-input/mask';

import { StackedInput } from '@/components';

export const PhoneNumberMaskedInput = forwardRef<
  HTMLInputElement,
  Omit<
    React.ComponentPropsWithoutRef<typeof StackedInput.TextInput>,
    'placeholder'
  >
>((props, forwardedRef) => {
  const inputRef = useMask({
    mask: '(___) ___-____',
    replacement: { _: /\d/ },
  });

  return (
    <StackedInput.TextInput
      ref={mergeRefs([inputRef, forwardedRef])}
      placeholder="(000) 000-0000"
      {...props}
    />
  );
});

PhoneNumberMaskedInput.displayName = 'PhoneNumberMaskedInput';
