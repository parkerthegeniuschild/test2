import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { Icon } from '../icons';

const Container = styled(
  'p',
  cva({
    base: {
      color: 'danger',
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      fontSize: 'xs',
      lineHeight: 1,
      fontWeight: 'semibold',
      maxWidth: 'fit',
      transition: 'color token(durations.fast) ease-in-out',

      '& svg': {
        fontSize: 'sm',
        flexShrink: 0,
      },

      // _hover: {
      //   color: 'danger.400',
      // },
    },
  })
);

export function UserCardPermissionsAlert() {
  return (
    <Container>
      <Icon.AlertTriangle />
      Missing permissions
    </Container>
  );
}
