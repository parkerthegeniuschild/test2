import { forwardRef } from 'react';
import * as Ariakit from '@ariakit/react';

import { css, cva, cx } from '@/styled-system/css';

const tabsTabStyles = cva({
  base: {
    height: 7,
    display: 'flex',
    alignItems: 'flex-start',
    cursor: 'pointer',
    fontFamily: 'inter',
    fontSize: 'sm',
    lineHeight: 1,
    color: 'gray.500',
    fontWeight: 'medium',
    position: 'relative',
    transition:
      'color token(durations.medium) ease-in-out, border-bottom-color token(durations.fast) ease-in-out',
    flexShrink: 0,

    '&:hover, &:active': {
      color: 'gray.900',
    },

    _after: {
      content: '""',
      position: 'absolute',
      bottom: '-1px',
      width: '100%',
      height: '2px',
      bgColor: 'primary',
      opacity: 0,
      transition: 'opacity token(durations.fast) ease-in-out',
    },

    '&[aria-selected="true"]': {
      color: 'gray.900',
      fontWeight: 'semibold',

      _after: {
        opacity: 1,
      },
    },
  },
  variants: {
    full: {
      true: {
        width: '100%',
        justifyContent: 'center',
      },
    },
    bordered: {
      true: {
        borderBottomWidth: '2px',
        borderBottomColor: 'transparent',

        _after: { display: 'none' },

        '&[aria-selected="true"]': { borderBottomColor: 'primary' },
      },
    },
  },
});

const innerWrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
});

interface TabsTabProps extends Ariakit.TabProps {
  children?: React.ReactNode;
  full?: boolean;
  bordered?: boolean;
  textProps?: React.ComponentProps<'span'>;
}

export const TabsTab = forwardRef<HTMLButtonElement, TabsTabProps>(
  (
    { className, children, full, bordered, textProps, ...props },
    forwardedRef
  ) => {
    return (
      <Ariakit.Tab
        {...props}
        ref={forwardedRef}
        className={cx(tabsTabStyles({ full, bordered }), className)}
      >
        <span
          {...textProps}
          className={cx(innerWrapperStyles, textProps?.className)}
        >
          {children}
        </span>
      </Ariakit.Tab>
    );
  }
);

TabsTab.displayName = 'TabsTab';
