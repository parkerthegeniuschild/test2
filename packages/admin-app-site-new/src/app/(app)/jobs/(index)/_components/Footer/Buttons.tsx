import { usePlatform } from '@/app/(app)/_hooks';
import { Button, type ButtonProps, Icon } from '@/components';
import { css } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

const Kbd = styled('kbd', {
  base: {
    rounded: 'xs.2xl',
    px: 1,
    fontSize: 'xs',
    lineHeight: 1,
    height: '1.125rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'semibold',
    position: 'relative',
  },
  variants: {
    variant: {
      primary: {
        bgColor: 'rgba(1, 2, 3, 0.10)',
      },
      secondary: {
        bgColor: 'rgba(1, 2, 3, 0.08)',
        color: 'gray.500',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export function CancelButton(props: Omit<ButtonProps, 'children'>) {
  return (
    <Button
      size="sm"
      variant="secondary"
      rightSlot={
        <Kbd variant="secondary" aria-label="Escape">
          Esc
        </Kbd>
      }
      {...props}
    >
      Cancel
    </Button>
  );
}

export function SaveButton({ children, ...props }: ButtonProps) {
  const platform = usePlatform();

  return (
    <Button
      size="sm"
      rightSlot={
        <span className={css({ display: 'flex', gap: 1 })}>
          {platform === 'pc' && <Kbd aria-label="Control">Ctrl</Kbd>}
          {platform === 'mac' && (
            <Kbd aria-label="Command">
              <Icon.Command />
            </Kbd>
          )}
          {platform === null && (
            <span aria-hidden className={css({ w: '1.125rem' })} />
          )}

          <Kbd w="1.125rem" aria-label="Enter">
            <Icon.Enter className={css({ pos: 'absolute' })} />
          </Kbd>
        </span>
      }
      {...props}
    >
      {children ?? 'Save and next'}
    </Button>
  );
}
