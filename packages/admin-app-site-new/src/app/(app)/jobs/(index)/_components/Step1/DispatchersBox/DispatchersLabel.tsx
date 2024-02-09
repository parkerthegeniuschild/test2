import { Label, type LabelProps } from '@/components';
import { css } from '@/styled-system/css';

export function DispatchersLabel(props: Omit<LabelProps, 'children'>) {
  return (
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
            bgColor: 'blue',
            mr: 1.5,
          },
        }),
      }}
      {...props}
    >
      Dispatchers
    </Label>
  );
}
