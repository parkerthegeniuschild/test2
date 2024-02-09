import { Icon, Tooltip } from '@/components';
import { css } from '@/styled-system/css';

export function PendingReviewAlert() {
  return (
    <Tooltip
      description="Pending Review"
      aria-label="Pending Review"
      placement="top"
      role="tooltip"
      className={css({ cursor: 'help' })}
      gutter={4}
    >
      <Icon.AlertHexagon className={css({ color: 'warning' })} />
    </Tooltip>
  );
}
