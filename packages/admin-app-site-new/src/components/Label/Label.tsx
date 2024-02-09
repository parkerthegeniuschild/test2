import { forwardRef } from 'react';

import { styled } from '@/styled-system/jsx';

const Container = styled('label', {
  base: {
    fontFamily: 'inter',
    color: 'gray.500',
    lineHeight: 1,
    fontWeight: 'medium',
    fontSize: 'sm',
    display: 'inline-flex',
    flexDirection: 'column',
    gap: 2,
    cursor: 'default',
  },
});

const Text = styled('span', {
  base: {},
  variants: {
    required: {
      true: {
        _after: {
          content: '"*"',
          color: 'danger',
        },
      },
    },
  },
});

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof Container> {
  as?: React.ElementType;
  text?: string;
  textProps?: React.ComponentPropsWithoutRef<typeof Text>;
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, text, textProps, required, ...props }, forwardedRef) => (
    <Container ref={forwardedRef} {...props}>
      {typeof children === 'string' || !!text ? (
        <Text required={required} {...textProps}>
          {text ?? children}
        </Text>
      ) : null}
      {typeof children !== 'string' && children}
    </Container>
  )
);

Label.displayName = 'Label';
