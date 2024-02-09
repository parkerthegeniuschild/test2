import { forwardRef } from 'react';

import { Button, Icon } from '@/components';
import { css } from '@/styled-system/css';

type ColumnsButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  columns: Record<string, boolean>;
};

export const ColumnsButton = forwardRef<HTMLButtonElement, ColumnsButtonProps>(
  ({ columns, ...props }, forwardedRef) => {
    const haveColumnsChanged = Object.values(columns).some(
      value => value === false
    );

    return (
      <Button
        {...props}
        size="sm"
        variant="secondary"
        leftSlot={<Icon.Columns />}
        rightSlot={
          haveColumnsChanged ? (
            <span
              aria-label="Columns changed"
              className={css({
                width: 1.5,
                height: 1.5,
                rounded: 'full',
                bgColor: 'primary.600',
              })}
            />
          ) : null
        }
        ref={forwardedRef}
      >
        Columns
      </Button>
    );
  }
);

ColumnsButton.displayName = 'ColumnsButton';
