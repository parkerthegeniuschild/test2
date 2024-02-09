import { memo } from 'react';

import { css, cx } from '@/styled-system/css';

interface VehiclePhotoProps {
  id: number;
  url: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const VehiclePhoto = memo<VehiclePhotoProps>(
  ({ url, className, loading }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      aria-hidden
      loading={loading}
      fetchPriority="low"
      className={cx(
        css({
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          rounded: 'inherit',
        }),
        className
      )}
    />
  ),
  (prevProps, nextProps) => prevProps.id === nextProps.id
);

VehiclePhoto.displayName = 'VehiclePhoto';
