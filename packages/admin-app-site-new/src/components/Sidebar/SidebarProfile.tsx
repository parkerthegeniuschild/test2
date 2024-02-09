import { forwardRef } from 'react';

import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';
import { SystemStyleObject } from '@/styled-system/types';

import { Avatar } from '../Avatar';
import { Dropdown } from '../Dropdown';
import { Text } from '../Text';

import { SidebarItem } from './SidebarItem';

const AvatarContainer = styled(
  'div',
  cva({
    base: {
      position: 'relative',
      height: 4,
      width: 4,
    },
  })
);

const avatarStyles: SystemStyleObject = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
};

const UserProfileContainer = styled(
  'div',
  cva({
    base: {
      px: 4,
      py: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 3,
    },
  })
);

type SidebarProfileProps = {
  avatarUrl?: string;
  username: string;
  userHandle?: string;
  children?: React.ReactNode;
};

function SidebarProfileRoot({
  username,
  avatarUrl,
  children,
  userHandle,
}: SidebarProfileProps) {
  return (
    <Dropdown
      placement="top"
      borderless
      css={{ minWidth: '15.25rem' }}
      trigger={
        <SidebarItem
          darkTooltip
          leftSlot={
            <AvatarContainer>
              <Avatar
                src={avatarUrl}
                name={username}
                theme="dark"
                size="xs"
                css={avatarStyles}
              />
            </AvatarContainer>
          }
        >
          Profile
        </SidebarItem>
      }
    >
      <UserProfileContainer>
        <Avatar src={avatarUrl} name={username} size="lg" />
        <Text
          css={{ fontSize: 'sm', color: 'gray.900', fontWeight: 'semibold' }}
        >
          {username}
          <Text
            as="span"
            css={{
              display: 'block',
              fontWeight: 'normal',
              fontSize: 'xs',
              color: 'gray.500',
              mt: '1.25',
            }}
          >
            @{userHandle}
          </Text>
        </Text>
      </UserProfileContainer>

      {!!children && <Dropdown.Separator />}

      {children}
    </Dropdown>
  );
}

const SidebarProfileItem = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Dropdown.Item>
>(({ css, ...props }, forwardedRef) => (
  <Dropdown.Item
    ref={forwardedRef}
    css={{ lineHeight: 1, py: 2, ...css }}
    {...props}
  />
));

SidebarProfileItem.displayName = 'SidebarProfileItem';

export const SidebarProfile = Object.assign(SidebarProfileRoot, {
  Item: SidebarProfileItem,
});
