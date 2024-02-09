import { forwardRef } from 'react';
import { match, P } from 'ts-pattern';

import { cva, cx } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { Icon } from '../icons';

export const containerStyles = cva({
  base: {
    rounded: 'full',
    bgColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    border: '1px solid transparent',

    _before: {
      content: '""',
      zIndex: 1,
      opacity: 0,
      position: 'absolute',
      rounded: 'full',
      bottom: 0,
      right: 0,
    },
  },
  variants: {
    theme: {
      light: {},
      dark: {
        borderColor: 'white',
      },
    },
    size: {
      lg: {
        width: '2.125rem',
        height: '2.125rem',

        _before: {
          width: 2,
          height: 2,
        },

        '& .avatar-initials': {
          fontSize: '2xs.xl',
        },

        '& .avatar-icon-wrapper': {
          fontSize: 'md',
        },
      },
      md: {
        width: 7,
        height: 7,

        _before: {
          width: '0.4375rem',
          height: '0.4375rem',
        },

        '& .avatar-initials': {
          fontSize: '0.6875rem',
        },

        '& .avatar-icon-wrapper': {
          fontSize: 'sm',
        },
      },
      sm: {
        width: 6,
        height: 6,

        _before: {
          width: 1.5,
          height: 1.5,
        },

        '& .avatar-initials': {
          fontSize: '0.625rem',
        },

        '& .avatar-icon-wrapper': {
          fontSize: 'xs',
        },
      },
      xs: {
        width: 5,
        height: 5,

        _before: {
          width: '0.3125rem',
          height: '0.3125rem',
        },

        '& .avatar-initials': {
          fontSize: '0.5rem',
        },

        '& .avatar-icon-wrapper': {
          fontSize: '0.6875rem',
        },
      },
      '2xs': {
        width: 'token(spacing.4.5)',
        height: 'token(spacing.4.5)',

        _before: {
          width: 1,
          height: 1,
        },

        '& .avatar-initials': {
          fontSize: '0.375rem',
        },

        '& .avatar-icon-wrapper': {
          fontSize: '0.625rem',
        },
        unapproved: {
          _before: {
            opacity: 1,
            bgColor: 'danger',
          },
        },
      },
    },
    specialBorder: { true: {} },
    status: {
      online: {
        _before: {
          opacity: 1,
          bgColor: 'primary',
        },
      },
      offline: {
        _before: {
          opacity: 1,
          bgColor: 'gray.300',
        },
      },
      unapproved: {
        _before: {
          opacity: 1,
          bgColor: 'danger',
        },
      },
      onJob: {
        _before: {
          opacity: 1,
          bgColor: 'white',
          borderColor: 'primary',
          borderWidth: '1px',
          boxShadow: '0px 0px 0px 0.5px token(colors.primary) inset',
        },
      },
    },
  },
  compoundVariants: [
    {
      theme: 'light',
      specialBorder: true,
      css: {
        border: '1px solid',
        borderColor: 'gray.200',
        shadow: 'sm',

        '&::after': {
          content: '""',
          position: 'absolute',
          shadow: '0px 1px 0px 0px rgba(1, 2, 3, 0.12)',
          width: '106%',
          height: '100%',
          bottom: 0,
          rounded: '50%',
        },
      },
    },
  ],
  defaultVariants: {
    theme: 'light',
    size: 'md',
  },
});

const Container = styled('div', containerStyles);

const Image = styled(
  'img',
  cva({
    base: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      rounded: 'full',
    },
  })
);

const Initials = styled(
  'div',
  cva({
    base: {
      fontFamily: 'inter',
      lineHeight: 1,
      fontWeight: 'semibold',
      textTransform: 'uppercase',
      userSelect: 'none',
    },
    variants: {
      userRole: {
        dispatcher: { color: 'blue' },
        driver: { color: 'primary.600' },
        provider: { color: 'gray.700' },
      },
    },
    defaultVariants: {
      userRole: 'provider',
    },
  })
);

const IconWrapper = styled('div', cva({ base: { color: 'gray.400' } }));

type ContainerProps = React.ComponentPropsWithoutRef<typeof Container>;

export interface AvatarProps extends Omit<ContainerProps, 'specialBorder'> {
  src?: string;
  name?: string;
  userRole?: React.ComponentProps<typeof Initials>['userRole'];
  icon?: React.ElementType;
  initialsProps?: React.ComponentPropsWithoutRef<typeof Initials>;
}

function mountInitials(name: string) {
  const [firstName, lastName] = name.split(' ');

  return `${firstName[0]}${lastName?.[0] ?? ''}`;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ name, src, userRole, icon, initialsProps, ...props }, forwardedRef) => {
    const IconComponent = icon ?? Icon.User;

    return (
      <Container {...props} specialBorder={!src} ref={forwardedRef}>
        {match({ name, src })
          .with({ src: P.string.minLength(1) }, () => (
            <Image src={src} alt={name} />
          ))
          .with({ name: P.string.minLength(1) }, data => (
            <Initials
              {...initialsProps}
              role="img"
              aria-label={data.name}
              className={cx('avatar-initials', initialsProps?.className)}
              userRole={userRole}
            >
              {mountInitials(data.name)}
            </Initials>
          ))
          .otherwise(() => (
            <IconWrapper className="avatar-icon-wrapper">
              <IconComponent />
            </IconWrapper>
          ))}
      </Container>
    );
  }
);

Avatar.displayName = 'Avatar';
