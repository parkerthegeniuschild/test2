'use client';

import _toast, {
  Toaster as ReactHotToaster,
  type ToasterProps,
} from 'react-hot-toast';

import { css } from '@/styled-system/css';

import { Icon } from '../icons';

export function Toaster(props: ToasterProps) {
  return (
    <ReactHotToaster
      position="bottom-center"
      containerStyle={{
        top: '1.75rem',
        right: '1.75rem',
        left: '1.75rem',
        bottom: '1.75rem',
      }}
      toastOptions={{
        className: css({
          bgColor: 'gray.500!',
          color: 'white!',
          fontFamily: 'inter',
          py: '2!',
          px: '3!',
          shadow: 'menu.md!',
          lineHeight: 'md!',
          fontWeight: 'medium',
          gap: 2,
          maxW: 'lg!',

          '& > [role="status"]': {
            m: '0!',
          },
        }),
        success: {
          icon: (
            <Icon.CheckCircle
              className={css({
                fontSize: 'md',
                color: 'primary',
                flexShrink: 0,
              })}
            />
          ),
        },
        error: {
          icon: (
            <Icon.AlertTriangle
              className={css({
                fontSize: 'md',
                color: 'danger',
                flexShrink: 0,
              })}
            />
          ),
        },
      }}
      {...props}
    />
  );
}

export function toast(...args: Parameters<typeof _toast>) {
  return _toast(...args);
}

toast.success = _toast.success;
toast.error = _toast.error;
toast.warning = (...args: Parameters<typeof _toast>) =>
  _toast(args[0], {
    icon: (
      <Icon.AlertTriangle
        className={css({ fontSize: 'md', color: 'warning', flexShrink: 0 })}
      />
    ),
    ...args[1],
  });
