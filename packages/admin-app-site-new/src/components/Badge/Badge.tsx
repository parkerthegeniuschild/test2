import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

const badgeStyles = cva({
  base: {
    fontFamily: 'inter',
    fontWeight: 'semibold',
    lineHeight: 1,
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',

    '& .badge-text': {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      height: 3,
    },
  },
  variants: {
    variant: {
      neutral: {
        backgroundColor: 'gray.400',
        color: 'white',
      },
      primary: {
        backgroundColor: 'primary',
        color: 'white',
      },
      danger: {
        backgroundColor: 'danger',
        color: 'white',
      },
    },
    size: {
      lg: {
        rounded: 'md',
        fontSize: 'sm',
        p: 1.5,
      },
      md: {
        rounded: 'sm',
        fontSize: 'xs',
        p: 1,
      },
      sm: {
        rounded: '0.1875rem',
        fontSize: '2xs.xl',
        px: 1,
        py: 0.5,
      },
    },
    content: {
      text: {},
      number: {},
    },
    duotone: {
      true: {},
    },
  },
  compoundVariants: [
    {
      variant: 'neutral',
      duotone: true,
      css: {
        // TODO: refactor this when Panda releases the opacify feature
        backgroundColor: 'rgba(1, 2, 3, 0.12)',
        color: 'gray.900',
      },
    },
    {
      variant: 'primary',
      duotone: true,
      css: {
        backgroundColor: 'rgba(0, 204, 102, 0.16)',
        color: 'primary.600',
      },
    },
    {
      variant: 'danger',
      duotone: true,
      css: {
        backgroundColor: 'rgba(242, 93, 38, 0.16)',
        color: 'danger.600',
      },
    },
    {
      size: 'lg',
      content: 'number',
      css: {
        px: 1.25,
        py: 1,
      },
    },
    {
      size: 'md',
      content: 'number',
      css: {
        px: 1,
        py: 0.5,
      },
    },
    {
      size: 'sm',
      content: 'number',
      css: {
        px: '0.1875rem',
        py: '0.0625rem',
      },
    },
  ],
  defaultVariants: {
    variant: 'neutral',
    size: 'md',
    content: 'text',
  },
});

const Container = styled('span', badgeStyles);

export function Badge({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Container>) {
  return (
    <Container {...props}>
      <span className="badge-text">{children}</span>
    </Container>
  );
}
