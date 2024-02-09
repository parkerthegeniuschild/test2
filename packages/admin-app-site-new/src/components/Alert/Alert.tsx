import { Center, styled } from '@/styled-system/jsx';
import type { StyledVariantProps } from '@/styled-system/types';

import { Icon } from '../icons';

const Container = styled('div', {
  base: {
    display: 'flex',
    gap: 2.3,
    rounded: 'lg',
    px: 3,
    py: 2.3,
  },
  variants: {
    variant: {
      warning: {
        color: 'warning.600',
        bgColor: 'rgba(219, 142, 7, 0.08)',
      },
      danger: {
        color: 'danger',
        bgColor: 'rgba(242, 93, 38, 0.08)',
      },
    },
  },
  defaultVariants: {
    variant: 'warning',
  },
});

const TextContainer = styled('div', {
  base: {
    display: 'flex',
    flexDir: 'column',
    gap: 0.5,
  },
});

const Title = styled('strong', {
  base: {
    fontFamily: 'inter',
    fontSize: 'sm',
    fontWeight: 'bold',
    lineHeight: 'md',
  },
});

const Description = styled('p', {
  base: {
    fontFamily: 'inter',
    fontSize: 'sm',
    lineHeight: 'md',
  },
});

const IconContainer = styled(Center, {
  base: {
    h: 5,
    w: 3.5,
    fontSize: 'md',

    '& > svg': {
      flexShrink: 0,
    },
  },
});

interface AlertProps extends StyledVariantProps<typeof Container> {
  title: string;
  description: string;
}

export function Alert({ title, description, variant = 'warning' }: AlertProps) {
  return (
    <Container variant={variant}>
      <IconContainer>
        {variant === 'warning' ? <Icon.AlertCircle /> : <Icon.AlertTriangle />}
      </IconContainer>

      <TextContainer>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </TextContainer>
    </Container>
  );
}
