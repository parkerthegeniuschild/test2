'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';

import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { TableHead } from './TableHead';

const Wrapper = styled(
  'div',
  cva({
    base: {
      maxWidth: '100%',
      maxHeight: 'inherit',
      display: 'block',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      whiteSpace: 'nowrap',
    },
  })
);

const Container = styled(
  'table',
  cva({
    base: {
      width: '100%',
      fontSize: 'sm',
      fontFamily: 'inter',
    },
  })
);

const TableHeader = styled(
  'thead',
  cva({
    base: {
      bgColor: 'gray.75',
      borderBottomWidth: '2px',
      borderColor: 'transparent',
      position: 'sticky',
      top: 0,
      zIndex: 'docked',

      _before: {
        content: '""',
        position: 'absolute',
        top: 0,
        height: '1px',
        width: '100%',
        bgColor: 'gray.200',
      },

      _after: {
        content: '""',
        position: 'absolute',
        bottom: '-2px',
        height: '2px',
        width: '100%',
        bgColor: 'gray.200',
      },
    },
  })
);

const TableRow = styled(
  'tr',
  cva({
    base: {
      borderBottomWidth: '1px',
      borderColor: 'gray.100',

      '&:last-child': {
        border: 0,
      },
    },
  })
);

const TableBody = styled(
  'tbody',
  cva({
    base: {
      bgColor: 'white',
      borderBottomWidth: '1px',
      borderColor: 'gray.200',
      transitionProperty: 'opacity, filter',
      transitionDuration: 'fast',
      transitionTimingFunction: 'ease-in-out',

      '& tr': {
        transitionProperty: 'background-color',
        transitionDuration: 'fast',
        transitionTimingFunction: 'easeInOut',

        _hover: {
          bgColor: 'gray.50',
        },
      },
    },
    variants: {
      isPreviousData: {
        true: {
          opacity: 0.6,
          filter: 'blur(1px)',
          pointerEvents: 'none',
        },
      },
    },
  })
);

const TableCell = styled(
  'td',
  cva({
    base: {
      px: 3,
      color: 'gray.900',
      fontWeight: 'medium',
      lineHeight: 1,
      height: '2.875rem',

      '&:first-child': {
        pl: 6,
      },

      '&:last-child': {
        pr: 6,
      },
    },
  })
);

export type TableElement = {
  scrollToTop(): void;
};

interface TableProps extends React.ComponentPropsWithoutRef<typeof Container> {
  wrapperProps?: React.ComponentPropsWithoutRef<typeof Wrapper>;
}

const TableRoot = forwardRef<TableElement, TableProps>(
  ({ wrapperProps, ...props }, forwardedRef) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(forwardedRef, () => ({
      scrollToTop() {
        wrapperRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      },
    }));

    return (
      <Wrapper ref={wrapperRef} {...wrapperProps}>
        <Container {...props} />
      </Wrapper>
    );
  }
);

TableRoot.displayName = 'Table';

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Row: TableRow,
  Head: TableHead,
  Body: TableBody,
  Cell: TableCell,
});
