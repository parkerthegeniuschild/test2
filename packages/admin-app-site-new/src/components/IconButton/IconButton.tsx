'use client';

import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { ButtonProps, buttonStyles } from '../Button';
import { Spinner } from '../Spinner';

// TODO: refactor these spreads when Panda understands deep merges
export const containerStyles = cva({
  ...buttonStyles.container.config,
  base: {
    ...buttonStyles.container.config.base,

    '& .button-slot-container': {
      ...buttonStyles.container.config.base?.['& .button-slot-container'],
      transition: 'inherit',
    },
  },
  variants: {
    ...buttonStyles.container.config.variants,
    variant: {
      ...buttonStyles.container.config.variants?.variant,
    },
    full: {
      ...buttonStyles.container.config.variants?.full,
    },
    danger: {
      ...buttonStyles.container.config.variants?.danger,
    },
    size: {
      ...buttonStyles.container.config.variants?.size,
      md: {
        ...buttonStyles.container.config.variants?.size.md,
        width: 9,
        fontSize: 'xl',

        '& .button-slot-container': {
          ...buttonStyles.container.config.variants?.size.md[
            '& .button-slot-container'
          ],
          fontSize: 'inherit',
        },
      },
      sm: {
        ...buttonStyles.container.config.variants?.size.sm,
        width: 8,
        fontSize: 'xl',

        '& .button-slot-container': {
          ...buttonStyles.container.config.variants?.size.sm[
            '& .button-slot-container'
          ],
          fontSize: 'inherit',
        },
      },
      xs: {
        ...buttonStyles.container.config.variants?.size.xs,
        width: 7,
        fontSize: 'md',

        '& .button-slot-container': {
          ...buttonStyles.container.config.variants?.size.xs[
            '& .button-slot-container'
          ],
          fontSize: 'inherit',
        },
      },
    },
  },
});

const Container = styled('button', containerStyles);

export const wrapperStyles = cva({
  ...buttonStyles.wrapper.config,
});

const Wrapper = styled('span', wrapperStyles);

type IconButtonProps = ButtonProps;

export function IconButton({ children, loading, ...props }: IconButtonProps) {
  return (
    <Container type="button" {...props}>
      <Wrapper className="button-wrapper">
        <span className="button-slot-container">
          {loading ? (
            <Spinner aria-hidden css={{ height: '1em', width: '1em' }} />
          ) : (
            children
          )}
        </span>
      </Wrapper>
    </Container>
  );
}
