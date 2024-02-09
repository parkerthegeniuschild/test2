import { forwardRef } from 'react';
import * as Ariakit from '@ariakit/react';

import { css, cva, cx } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { useSidebar } from './SidebarContext';
import { SidebarTooltip } from './SidebarTooltip';

const Container = styled(
  'div',
  cva({
    base: {
      position: 'relative',
      fontFamily: 'inter',
      color: 'white',
      width: '100%',
      fontSize: 'sm',
      lineHeight: 1,
      fontWeight: 'medium',
      transition: 'token(durations.fast) ease-in-out',
      transitionProperty: 'background-color, color',
      overflow: 'hidden',
      userSelect: 'none',

      _hover: {
        bgColor: 'gray.700',
      },

      _active: {
        bgColor: 'transparent',
      },

      _before: {
        content: '""',
        position: 'absolute',
        width: 0.5,
        height: 4,
        bgColor: 'primary',
        left: 0,
        top: '50%',
        rounded: '1px',
        transition: 'transform token(durations.fast) ease-in-out',
        transform: 'translateX(-3px) translateY(-50%)',
      },
    },
    variants: {
      active: {
        true: {
          // TODO: refactor this when Panda releases the opacify feature
          bgColor: 'rgba(0, 204, 102, 0.12)',
          fontWeight: 'semibold',
          color: 'primary',

          _hover: {
            bgColor: 'rgba(0, 204, 102, 0.12)',
          },

          _active: {
            bgColor: 'rgba(0, 204, 102, 0.12)',
          },

          _before: {
            transform: 'translateX(0px) translateY(-50%)',
          },
        },
      },
    },
  })
);

const anchorStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: 3,
  height: '100%',
  width: '100%',
  cursor: 'pointer',
  px: 5,
  py: 2,
  color: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  lineHeight: 'inherit',
  outline: 0,

  _focusVisible: {
    shadow: '0px 0px 0px 1px token(colors.white) inset',
  },
});

const LeftSlotContainer = styled(
  'span',
  cva({
    base: {
      display: 'flex',
      color: 'gray.300',
      transition: 'color token(durations.fast) ease-in-out',

      _groupHover: {
        color: 'white',
      },

      _groupActive: {
        color: 'gray.300',
      },
    },
    variants: {
      active: {
        true: {
          color: 'primary',

          _groupHover: {
            color: 'primary',
          },

          _groupActive: {
            color: 'primary',
          },
        },
      },
    },
  })
);

type SidebarItemProps = React.ComponentPropsWithoutRef<typeof Ariakit.Role> & {
  active?: boolean;
  leftSlot?: React.ReactNode;
  darkTooltip?: boolean;
  children: string;
};

export const SidebarItem = forwardRef<HTMLButtonElement, SidebarItemProps>(
  (
    { children, active, leftSlot, darkTooltip, className, ...props },
    forwardedRef
  ) => {
    const { open } = useSidebar();

    return (
      <Container className="group" active={active}>
        <SidebarTooltip
          description={children}
          gutter={2}
          hidden={open}
          darkBg={darkTooltip}
        >
          <Ariakit.Role
            ref={forwardedRef as React.RefObject<HTMLDivElement>}
            // eslint-disable-next-line jsx-a11y/control-has-associated-label
            render={<button type="button" />}
            className={cx(anchorStyles, className)}
            {...props}
          >
            {!!leftSlot && (
              <LeftSlotContainer active={active}>{leftSlot}</LeftSlotContainer>
            )}
            {open && children}
          </Ariakit.Role>
        </SidebarTooltip>
      </Container>
    );
  }
);

SidebarItem.displayName = 'SidebarItem';
