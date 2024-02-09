'use client';

import * as Ariakit from '@ariakit/react';
import { match } from 'ts-pattern';

import { css, cva, cx, type RecipeVariantProps } from '@/styled-system/css';
import { Box } from '@/styled-system/jsx';
import type { SystemStyleObject } from '@/styled-system/types';

import { Dropdown } from '../Dropdown';
import { Icon } from '../icons';

const tableHeadStyles = cva({
  base: {
    p: 3,
    color: 'gray.400',
    lineHeight: 1,
    fontWeight: 'semibold',
    whiteSpace: 'nowrap',

    '&:first-child': {
      pl: 6,
    },

    '&:last-child': {
      pr: 6,
    },
  },
  variants: {
    align: {
      left: { textAlign: 'left' },
      right: { textAlign: 'right' },
    },
  },
  defaultVariants: {
    align: 'left',
  },
});

const sortButtonStyles = cva({
  base: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
    color: 'inherit',
    cursor: 'pointer',
    fontWeight: 'inherit',
    transition: 'color token(durations.fast) ease-in-out',

    '& .table-head-sort-icon': {
      color: 'gray.300',
      transition: 'inherit',
    },

    '&:is([aria-expanded="true"], [data-sort="true"], :hover)': {
      color: 'gray.900',

      '& .table-head-sort-icon': {
        color: 'gray.500',
      },
    },
  },
  variants: {
    align: {
      left: {},
      right: { ml: 'auto' },
    },
  },
  defaultVariants: {
    align: 'left',
  },
});

const innerWrapperStyles = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,

    '& .table-head-arrow-container': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 3,

      '& svg': {
        flexShrink: 0,
        transitionProperty: 'transform',
        transitionDuration: 'fast',
        transitionTimingFunction: 'easeInOut',
      },
    },
  },
  variants: {
    rotate: {
      true: {
        '& .table-head-arrow-container svg': {
          transform: 'scaleY(-1)',
        },
      },
    },
    align: {
      left: {},
      right: { justifyContent: 'flex-end' },
    },
  },
});

const arrowStyles = cva({
  base: {
    ml: 'auto',
    fontSize: 'md',
  },
});

const checkWrapperStyles = cva({
  base: {
    width: 3,
    height: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',

    '& svg': {
      flexShrink: 0,
    },
  },
  variants: {
    icon: {
      primary: {
        '& svg': {
          color: 'primary',
        },
      },
      neutral: {
        '& svg': {
          color: 'gray.700',
        },
      },
    },
  },
  defaultVariants: {
    icon: 'primary',
  },
});

const clearSortDropdownItemStyles: SystemStyleObject = {
  maxHeight: '1000px',
  '--delayed-transition-duration': '1s token(easings.easeInOut) 3s',
  transition: `background-color token(durations.fast) ease-in-out,
     max-height var(--delayed-transition-duration),
     padding var(--delayed-transition-duration),
     opacity var(--delayed-transition-duration),
     margin var(--delayed-transition-duration),
     border-width var(--delayed-transition-duration),
     visibility var(--delayed-transition-duration)`,

  '&[data-show="false"]': {
    maxHeight: 0,
    p: 0,
    pointerEvents: 'none',
    visibility: 'hidden',
    opacity: 0,
    m: 0,
    borderWidth: 0,
  },
};

type TableHeadProps = React.ComponentPropsWithoutRef<'th'> &
  RecipeVariantProps<typeof tableHeadStyles> & {
    showHideColumnOption?: boolean;
    hideColumnDisabled?: boolean;
    sortType?: 'alphabetic' | 'numeric';
    sortButtonCss?: SystemStyleObject;
    sortOrder?: 'asc' | 'desc' | 'none';
    sortDisabled?: boolean;
    onSort?: (order: 'asc' | 'desc') => void;
    onClearSort?: () => void;
    onHideColumn?: () => void;
  };

export function TableHead({
  children,
  showHideColumnOption = true,
  hideColumnDisabled,
  sortButtonCss = {},
  sortType = 'alphabetic',
  sortOrder,
  sortDisabled,
  onSort,
  className,
  align,
  onClearSort,
  onHideColumn,
  ...props
}: TableHeadProps) {
  const isSortable = Boolean(
    sortOrder || onSort || typeof sortDisabled === 'boolean'
  );
  const isSortActive = !!sortOrder && sortOrder !== 'none';

  return (
    <Ariakit.Role
      {...props}
      render={({ children: innerChildren, ...innerProps }) =>
        isSortable ? (
          <th
            {...innerProps}
            aria-sort={match({ sortOrder })
              .with({ sortOrder: 'asc' }, () => 'ascending' as const)
              .with({ sortOrder: 'desc' }, () => 'descending' as const)
              .with(
                { sortOrder: 'none' },
                { sortOrder: undefined },
                () => 'none' as const
              )
              .exhaustive()}
          >
            <Dropdown
              portal
              unmountOnHide
              gutter={8}
              trigger={
                <button
                  type="button"
                  data-sort={!!sortOrder && sortOrder !== 'none'}
                  className={css(
                    sortButtonStyles.raw({ align }),
                    sortButtonCss
                  )}
                >
                  {innerChildren}
                </button>
              }
              shadow="sm"
            >
              <Dropdown.Item
                disabled={sortDisabled}
                onClick={() => onSort?.('asc')}
              >
                <Box className={checkWrapperStyles()}>
                  {sortOrder === 'asc' && <Icon.Check aria-label="Selected" />}
                </Box>
                {match(sortType)
                  .with('alphabetic', () => 'Sort A-Z')
                  .with('numeric', () => 'Sort 0-9')
                  .exhaustive()}

                <Icon.ArrowUp
                  aria-label="Sort ascending"
                  className={arrowStyles()}
                />
              </Dropdown.Item>
              <Dropdown.Item
                disabled={sortDisabled}
                onClick={() => onSort?.('desc')}
              >
                <Box className={checkWrapperStyles()}>
                  {sortOrder === 'desc' && <Icon.Check aria-label="Selected" />}
                </Box>
                {match(sortType)
                  .with('alphabetic', () => 'Sort Z-A')
                  .with('numeric', () => 'Sort 9-0')
                  .exhaustive()}

                <Icon.ArrowUp
                  aria-label="Sort descending"
                  className={css(arrowStyles.raw(), {
                    transform: 'rotate(180deg)',
                  })}
                />
              </Dropdown.Item>
              <Dropdown.Separator
                data-show={Boolean(isSortActive || showHideColumnOption)}
                css={clearSortDropdownItemStyles}
              />
              <Dropdown.Item
                data-show={isSortActive}
                css={clearSortDropdownItemStyles}
                onClick={onClearSort}
              >
                <Box
                  className={checkWrapperStyles({ icon: 'neutral' })}
                  aria-hidden
                >
                  <Icon.Times />
                </Box>
                Clear sort
              </Dropdown.Item>
              {showHideColumnOption && (
                <Dropdown.Item
                  disabled={hideColumnDisabled}
                  onClick={onHideColumn}
                >
                  <Box
                    className={checkWrapperStyles({ icon: 'neutral' })}
                    aria-hidden
                  >
                    <Icon.EyeOff2 />
                  </Box>
                  Hide column
                </Dropdown.Item>
              )}
            </Dropdown>
          </th>
        ) : (
          <th {...innerProps}>{innerChildren}</th>
        )
      }
      className={cx(tableHeadStyles({ align }), className)}
    >
      <span
        className={innerWrapperStyles({ rotate: sortOrder === 'desc', align })}
      >
        {children}
        {!!sortOrder && sortOrder !== 'none' && (
          <span className="table-head-arrow-container" aria-hidden>
            <Icon.ArrowUp />
          </span>
        )}
      </span>
      {isSortable && <Icon.Sort className="table-head-sort-icon" />}
    </Ariakit.Role>
  );
}
