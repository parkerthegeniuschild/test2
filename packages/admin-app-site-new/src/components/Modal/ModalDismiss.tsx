import { forwardRef } from 'react';
import * as Ariakit from '@ariakit/react';

import { Button } from '../Button';

type ModalDismissProps = Ariakit.DialogDismissProps;

export const ModalDismiss = forwardRef<HTMLButtonElement, ModalDismissProps>(
  (props, forwardedRef) => (
    <Ariakit.DialogDismiss
      ref={forwardedRef}
      render={<Button variant="secondary" size="sm" />}
      {...props}
    />
  )
);

ModalDismiss.displayName = 'ModalDismiss';
