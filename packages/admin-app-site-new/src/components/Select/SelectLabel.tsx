import * as Ariakit from '@ariakit/react';

import { css, cx } from '@/styled-system/css';

const selectLabelStyles = css({
  fontFamily: 'inter',
  color: 'gray.700',
  fontSize: 'sm',
  lineHeight: 1,
  fontWeight: 'medium',
  mb: 2,
});

type SelectLabelProps = Ariakit.SelectLabelProps;

export function SelectLabel({ className, ...props }: SelectLabelProps) {
  return (
    <Ariakit.SelectLabel
      {...props}
      className={cx(selectLabelStyles, className)}
    />
  );
}
