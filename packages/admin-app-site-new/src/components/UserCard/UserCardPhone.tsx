import { styled } from '@/styled-system/jsx';

import { Icon } from '../icons';

const Container = styled('p', {
  base: {
    px: 4,
    py: 1.5,
    color: 'white',
    fontWeight: 'medium',
    fontSize: 'sm',
    lineHeight: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 3,
  },
});

const IconsContainer = styled('span', {
  base: {
    color: 'gray.400',
    display: 'flex',
    alignItems: 'center',
    gap: 3,
  },
});

const IconWrapper = styled('a', {
  base: {
    transitionProperty: 'color',
    transitionDuration: 'fast',
    transitionTimingFunction: 'ease-in-out',

    _hover: {
      color: 'gray.100',
    },
  },
  variants: {
    disabled: {
      true: {
        color: 'gray.600',
        pointerEvents: 'none',
      },
    },
  },
});

type UserCardPhoneProps = Omit<
  React.ComponentPropsWithoutRef<typeof Container>,
  'children'
> & {
  children: React.ReactNode;
  disableSMS?: boolean;
  withSMS?: boolean;
};

export function UserCardPhone({
  children,
  disableSMS,
  withSMS = true,
  ...props
}: UserCardPhoneProps) {
  return (
    <Container {...props}>
      {children}

      <IconsContainer>
        {withSMS && (
          <IconWrapper
            href={typeof children === 'string' ? `sms:${children}` : undefined}
            disabled={disableSMS}
            tabIndex={disableSMS ? -1 : undefined}
          >
            <Icon.SMS />
          </IconWrapper>
        )}
        <IconWrapper
          href={typeof children === 'string' ? `callto:${children}` : undefined}
        >
          <Icon.Phone />
        </IconWrapper>
      </IconsContainer>
    </Container>
  );
}
