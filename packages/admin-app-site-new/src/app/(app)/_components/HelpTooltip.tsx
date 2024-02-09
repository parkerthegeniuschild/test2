import { Icon, TextButton, Tooltip, type TooltipProps } from '@/components';
import { css } from '@/styled-system/css';

interface HelpTooltipProps {
  description: string;
  placement?: TooltipProps['placement'];
  tabIndex?: number;
}

export function HelpTooltip({
  description,
  placement = 'top',
  tabIndex,
}: HelpTooltipProps) {
  return (
    <Tooltip
      description={description}
      aria-label={description}
      placement={placement}
      className={css({ cursor: 'help!' })}
      tabIndex={tabIndex}
      render={
        <TextButton
          colorScheme="lightGray"
          css={{ _active: { bgColor: 'inherit' } }}
        />
      }
    >
      <Icon.HelpCircle />
    </Tooltip>
  );
}
