'use client';

import * as Ariakit from '@ariakit/react';

import { css, cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { UserCardPermissionsAlert } from './UserCardPermissionsAlert';
import { UserCardPhone } from './UserCardPhone';
import { UserCardRole } from './UserCardRole';
import { UserCardStats } from './UserCardStats';
import { UserCardStatus } from './UserCardStatus';

const Container = styled(
  'div',
  cva({
    base: {
      bgColor: 'gray.800',
      rounded: 'md.lg',
      shadow:
        '0px 1px 2px 0px rgba(1, 2, 3, 0.08), 0px 4px 16px -8px rgba(1, 2, 3, 0.24)',
      opacity: 0,
      transitionProperty: 'opacity, transform',
      transitionTimingFunction: 'easeInOut',
      transitionDuration: 'fast',
      zIndex: 'popover',

      '&[data-side="bottom"]': {
        transform: 'scale(0.95) translateY(-0.5rem)',
      },

      '&[data-side="top"]': {
        transform: 'scale(0.95) translateY(0.5rem)',
      },

      '&[data-enter]': {
        opacity: 1,
        transform: 'scale(1) translateY(0)',
      },
    },
    variants: {
      size: {
        md: { minWidth: '14.75rem' },
        lg: { minWidth: '17.5rem' },
      },
    },
    defaultVariants: {
      size: 'md',
    },
  })
);

type UserCardProps = Ariakit.HovercardStoreProps & {
  trigger: Ariakit.HovercardAnchorProps['render'];
  children: React.ReactNode;
  size?: React.ComponentProps<typeof Container>['size'];
  tabIndex?: number;
};

function UserCardRoot({
  trigger,
  children,
  size,
  tabIndex,
  ...props
}: UserCardProps) {
  const hovercardStore = Ariakit.useHovercardStore({
    showTimeout: 200,
    hideTimeout: 150,
    ...props,
    animated: true,
  });

  const currentPlacement = hovercardStore.useState('currentPlacement');

  return (
    <>
      <Ariakit.HovercardAnchor
        store={hovercardStore}
        render={trigger}
        tabIndex={tabIndex}
        className={css({ cursor: 'pointer' })}
        onClick={() => hovercardStore.setOpen(true)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            hovercardStore.setOpen(!hovercardStore.getState().open);
          }
        }}
      />

      <Ariakit.Hovercard
        store={hovercardStore}
        render={<Container data-side={currentPlacement} size={size} />}
        gutter={5}
        portal
        unmountOnHide
      >
        <Ariakit.HovercardArrow size={15} />

        {children}
      </Ariakit.Hovercard>
    </>
  );
}

const UserCardHeader = styled(
  'header',
  cva({
    base: {
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      gap: 1.5,
      borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
    },
  })
);

const UserCardName = styled(
  Ariakit.HovercardHeading,
  cva({
    base: {
      color: 'white',
      fontSize: 'sm',
      lineHeight: 1,
      fontWeight: 'semibold',
    },
  })
);

const UserCardItem = styled(
  'div',
  cva({
    base: {
      py: 2,
      borderBottom: '1px solid rgba(255, 255, 255, 0.16)',

      '&:last-of-type': {
        borderBottom: 'none',
      },
    },
  })
);

export const UserCard = Object.assign(UserCardRoot, {
  Header: UserCardHeader,
  Name: UserCardName,
  Role: UserCardRole,
  PermissionsAlert: UserCardPermissionsAlert,
  Stats: UserCardStats,
  Item: UserCardItem,
  Status: UserCardStatus,
  Phone: UserCardPhone,
});
