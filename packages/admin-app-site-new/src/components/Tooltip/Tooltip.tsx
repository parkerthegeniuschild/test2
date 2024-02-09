'use client';

import { forwardRef } from 'react';
import * as Ariakit from '@ariakit/react';

import { styled } from '@/styled-system/jsx';
import type {
  StyledVariantProps,
  SystemStyleObject,
} from '@/styled-system/types';

const Container = styled('div', {
  base: {
    zIndex: 'tooltip',
    cursor: 'default',
    bgColor: 'gray.500',
    rounded: 'sm',
    color: 'white',
    fontSize: 'xs',
    fontWeight: 'medium',
    lineHeight: 1,
    pt: 1.5,
    pb: 1.5,
    px: 2,
    shadow: 'menu.md',
    opacity: 0,
    transitionProperty: 'opacity',
    transitionTimingFunction: 'easeInOut',
    transitionDuration: 'fast',

    '&[data-enter]': {
      opacity: 1,
    },
  },
  variants: {
    variant: {
      popover: {
        maxWidth: '17.5rem',
        bgColor: 'gray.800',
        rounded: 'lg',
        px: 3,
        pt: 3,
        pb: 2.3,
        shadow:
          '0px 1px 2px 0px rgba(1, 2, 3, 0.08), 0px 4px 16px -8px rgba(1, 2, 3, 0.24)',
      },
    },
  },
});

export interface TooltipProps extends React.ComponentPropsWithoutRef<'div'> {
  description: React.ReactNode;
  variant?: StyledVariantProps<typeof Container>['variant'];
  render?: Ariakit.TooltipAnchorProps['render'];
  placement?: Ariakit.TooltipStoreProps['placement'];
  gutter?: number;
  css?: SystemStyleObject;
  portal?: boolean;
  showArrow?: boolean;
  closeOnClick?: boolean;
  forceShowOnHover?: boolean;
  unmountOnHide?: boolean;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      description,
      variant,
      placement = 'right',
      hidden,
      gutter,
      css,
      portal,
      showArrow,
      closeOnClick,
      forceShowOnHover,
      unmountOnHide,
      ...props
    },
    forwardedRef
  ) => {
    const tooltipStore = Ariakit.useTooltipStore({
      placement,
      timeout: 0,
      animated: true,
    });

    return (
      <>
        <Ariakit.TooltipAnchor
          store={tooltipStore}
          ref={forwardedRef}
          {...props}
          onMouseOverCapture={e => {
            if (forceShowOnHover) {
              tooltipStore.show();
            }

            props.onMouseOverCapture?.(e);
          }}
          onClick={e => {
            if (closeOnClick) {
              tooltipStore.hide();
            }

            props.onClick?.(e);
          }}
        />

        <Ariakit.Tooltip
          render={<Container css={css} variant={variant} />}
          store={tooltipStore}
          gutter={gutter ?? 4}
          hidden={hidden || undefined}
          portal={portal}
          unmountOnHide={unmountOnHide}
        >
          {showArrow && <Ariakit.TooltipArrow size={20} />}

          {description}
        </Ariakit.Tooltip>
      </>
    );
  }
);

Tooltip.displayName = 'Tooltip';
