'use client';

import ReactPaginate, { type ReactPaginateProps } from 'react-paginate';

import { css, cva, cx } from '@/styled-system/css';

import { iconButtonStyles } from '../IconButton';
import { Icon } from '../icons';

// @ts-expect-error https://github.com/AdeleD/react-paginate/issues/426
const ReactPagination = ReactPaginate as (
  props: ReactPaginateProps
) => JSX.Element;

const containerStyles = css({
  display: 'flex',
  gap: 1,
  alignItems: 'center',
});

const itemStyles = css({
  '& a': {
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    fontSize: 'xs',
    lineHeight: 1,
    color: 'gray.500',
    fontWeight: 'medium',
    rounded: 'md.lg',
    transition: 'background-color token(durations.medium) ease-in-out',
    px: '1px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 7,
    minHeight: 7,
    userSelect: 'none',
  },

  '&:hover, &:active': {
    '& a': {
      // TODO: refactor this when Panda releases the opacify feature
      bgColor: 'rgba(1, 2, 3, 0.04)',
    },
  },

  '&.selected': {
    '& a': {
      bgColor: 'rgba(1, 2, 3, 0.04)',
      color: 'gray.900',
      fontWeight: 'semibold',
    },
  },
});

const linkStyles = css(
  iconButtonStyles.container.raw({ size: 'xs', variant: 'secondary' }),
  {
    display: 'block',
    '& span.button-slot-container, &:active:not(:disabled) span.button-slot-container':
      {
        color: 'gray.500',
      },
  }
);

const prevNextStyles = cva({
  base: {
    '&.disabled': {
      display: 'none',
    },
  },
  variants: {
    type: {
      prev: { mr: 1 },
      next: { ml: 1 },
    },
  },
});

function PrevNextButton({ children }: React.PropsWithChildren) {
  return (
    <span className={cx('button-wrapper', iconButtonStyles.wrapper())}>
      <span className="button-slot-container">{children}</span>
    </span>
  );
}

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onChange?: (newPage: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  onChange,
}: PaginationProps) {
  const isOnMiddle = currentPage > 3 && currentPage < totalPages - 2;

  return (
    <ReactPagination
      containerClassName={containerStyles}
      pageClassName={itemStyles}
      breakClassName={itemStyles}
      previousClassName={prevNextStyles({ type: 'prev' })}
      previousLinkClassName={linkStyles}
      previousLabel={
        <PrevNextButton>
          <Icon.ChevronLeft />
        </PrevNextButton>
      }
      nextClassName={prevNextStyles({ type: 'next' })}
      nextLinkClassName={linkStyles}
      nextLabel={
        <PrevNextButton>
          <Icon.ChevronRight />
        </PrevNextButton>
      }
      pageCount={totalPages}
      forcePage={currentPage - 1}
      onPageChange={({ selected }) => onChange?.(selected + 1)}
      pageRangeDisplayed={isOnMiddle ? 2 : 3}
      marginPagesDisplayed={isOnMiddle ? 1 : 2}
      renderOnZeroPageCount={null}
    />
  );
}
