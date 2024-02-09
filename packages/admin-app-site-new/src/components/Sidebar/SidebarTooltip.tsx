import { Tooltip } from '../Tooltip';

type SidebarTooltipProps = {
  children: React.ReactElement;
  description: React.ReactNode;
  gutter?: number;
  hidden?: boolean;
  darkBg?: boolean;
};

export function SidebarTooltip({
  children,
  description,
  gutter,
  hidden,
  darkBg,
}: SidebarTooltipProps) {
  return (
    <Tooltip
      render={children}
      description={description}
      aria-label={typeof description === 'string' ? description : undefined}
      gutter={gutter}
      css={{ userSelect: 'none', bgColor: darkBg ? 'gray.900' : undefined }}
      hidden={hidden}
    />
  );
}
