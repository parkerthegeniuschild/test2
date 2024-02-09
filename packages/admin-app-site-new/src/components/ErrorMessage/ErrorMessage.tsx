import { css } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { Icon } from '../icons';

const Message = styled('p', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    color: 'danger',
    fontFamily: 'inter',
    fontSize: 'sm',
    lineHeight: '1.25rem',
    fontWeight: 'normal',
  },
});

const iconStyles = css({
  flexShrink: 0,
  fontSize: '2xs.xl',
});

interface ErrorMessageProps
  extends React.ComponentPropsWithoutRef<typeof Message> {
  showIcon?: boolean;
}

export function ErrorMessage({
  children,
  showIcon = true,
  ...props
}: ErrorMessageProps) {
  return (
    <Message {...props}>
      {showIcon && <Icon.AlertTriangle className={iconStyles} />}
      <span>{children}</span>
    </Message>
  );
}
