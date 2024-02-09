import { cva } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

const Container = styled(
  'div',
  cva({
    base: {
      height: 0,
      width: '100%',
      borderTopWidth: '1px',
      borderColor: 'danger',
      position: 'fixed',
      top: 0,
      zIndex: 'banner',
    },
  })
);

const Badge = styled(
  'div',
  cva({
    base: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      textTransform: 'uppercase',
      bgColor: 'danger',
      color: 'white',
      fontSize: '0.625rem',
      fontWeight: 'bold',
      lineHeight: '0.4375rem',
      fontFamily: 'inter',
      px: 1.5,
      pt: '0.28125rem',
      pb: '0.40625rem',
      roundedBottom: 'sm',
      userSelect: 'none',
    },
  })
);

type TestBannerProps = React.ComponentPropsWithoutRef<typeof Badge> & {
  children: React.ReactNode;
  containerProps?: React.ComponentPropsWithoutRef<typeof Container>;
};

export function TestBanner({ containerProps, ...props }: TestBannerProps) {
  return (
    <Container {...containerProps} role="banner">
      <Badge {...props} />
    </Container>
  );
}
