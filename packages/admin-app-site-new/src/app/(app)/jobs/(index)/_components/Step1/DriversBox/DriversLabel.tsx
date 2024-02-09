import { HelpTooltip } from '@/app/(app)/_components';
import { Label, type LabelProps } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

export function DriversLabel(props: Omit<LabelProps, 'children'>) {
  return (
    <Flex align="center" gap={1.5}>
      <Label
        required
        color="gray.600"
        maxW="max"
        textProps={{
          className: css({
            display: 'flex',
            alignItems: 'center',

            _before: {
              content: '""',
              display: 'inline-block',
              height: 3.5,
              width: 'token(spacing.0.75)',
              bgColor: 'primary',
              mr: 1.5,
            },
          }),
        }}
        {...props}
      >
        Drivers
      </Label>

      <HelpTooltip
        placement="right"
        description="Any individuals on-site with the vehicle(s)"
        tabIndex={-1}
      />
    </Flex>
  );
}
