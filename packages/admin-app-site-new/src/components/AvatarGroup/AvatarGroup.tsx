import { cloneElement } from 'react';

import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';
import type { SystemStyleObject } from '@/styled-system/types';

import { type AvatarProps, avatarStyles } from '../Avatar';

const Container = styled(
  'div',
  cva({
    base: {
      display: 'flex',
      alignItems: 'center',

      '& > *': {
        marginInlineStart: -1.5,
      },

      _empty: {
        display: 'none',
      },
    },
  })
);

const overflowCountContainerStyles: SystemStyleObject = {
  backgroundColor: 'gray.50',

  '& > span': {
    lineHeight: 1,
    fontWeight: 'medium',
  },
};

const OverflowCountContainer = styled('div', avatarStyles.container);

type AvatarGroupProps = Omit<
  React.ComponentPropsWithoutRef<typeof Container>,
  'children'
> & {
  max?: number;
  size?: AvatarProps['size'];
  children?: React.ReactNode[];
};

export function AvatarGroup({
  children,
  max = Infinity,
  size,
  ...props
}: AvatarGroupProps) {
  if (!children) {
    return null;
  }

  const validChildren = children.filter(Boolean) as React.ReactElement[];
  const overflowedAvatarsLength = validChildren.length - max;

  return (
    <Container {...props} role="group">
      {validChildren
        .slice(0, max)
        // eslint-disable-next-line react/no-array-index-key
        .map((child, index) => cloneElement(child, { key: index, size }))}

      {overflowedAvatarsLength > 0 && (
        <OverflowCountContainer
          size={size}
          specialBorder
          css={overflowCountContainerStyles}
        >
          <span className="avatar-initials">+{overflowedAvatarsLength}</span>
        </OverflowCountContainer>
      )}
    </Container>
  );
}
