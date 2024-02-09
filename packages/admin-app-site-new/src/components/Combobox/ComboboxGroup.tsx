import { forwardRef } from 'react';
import * as Ariakit from '@ariakit/react';

import { styled } from '@/styled-system/jsx';

const LabelContainer = styled('div', {
  base: {
    fontSize: 'xs',
    lineHeight: 1,
    color: 'gray.500',
    fontWeight: 'medium',
    py: 2,
    px: 4,
    userSelect: 'none',
  },
});

type ComboboxGroupProps = Ariakit.ComboboxGroupProps & {
  label: React.ReactNode;
  children: React.ReactNode;
};

export const ComboboxGroup = forwardRef<HTMLDivElement, ComboboxGroupProps>(
  ({ label, children, ...props }, forwardedRef) => (
    <Ariakit.ComboboxGroup ref={forwardedRef} {...props}>
      <Ariakit.ComboboxGroupLabel render={<LabelContainer />}>
        {label}
      </Ariakit.ComboboxGroupLabel>

      {children}
    </Ariakit.ComboboxGroup>
  )
);

ComboboxGroup.displayName = 'ComboboxGroup';
