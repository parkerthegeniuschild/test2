import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

const Container = styled(
  'footer',
  cva({
    base: {
      mt: 'auto',
      py: 4,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      borderTop: '1px solid rgba(255, 255, 255, 0.16)',
    },
  })
);

export function SidebarFooter({ children }: React.PropsWithChildren) {
  return <Container>{children}</Container>;
}
