import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

const Container = styled(
  'div',
  cva({
    base: {
      py: 4,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    },
  })
);

export function SidebarBody({ children }: React.PropsWithChildren) {
  return <Container>{children}</Container>;
}
