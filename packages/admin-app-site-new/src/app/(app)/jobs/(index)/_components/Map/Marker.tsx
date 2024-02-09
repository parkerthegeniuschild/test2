import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { nextTickScheduler } from '@/app/_utils';

import type { MapRef, MapViewState, MarkerDragEvent } from './types';

type AdvancedMarkerElement = google.maps.marker.AdvancedMarkerElement;

export type MarkerElement = {
  rerender: () => void;
};

interface MarkerProps {
  map: MapRef;
  position: Omit<MapViewState, 'zoom'>;
  zIndex?: number;
  draggable?: boolean;
  onDragStart?: (e: MarkerDragEvent) => void;
  onDrag?: (e: MarkerDragEvent) => void;
  onDragEnd?: (e: MarkerDragEvent) => void;
}

export const Marker = forwardRef<
  MarkerElement,
  React.PropsWithChildren<MarkerProps>
>(
  (
    {
      map,
      position,
      zIndex,
      children,
      draggable = false,
      onDragStart,
      onDrag,
      onDragEnd,
    },
    forwardedRef
  ) => {
    const markerRef = useRef<AdvancedMarkerElement>();
    const rootRef = useRef<Root>();

    useImperativeHandle(forwardedRef, () => ({
      rerender() {
        rootRef.current?.render(children);
      },
    }));

    useEffect(() => {
      if (rootRef.current) {
        return () => {};
      }

      const container = document.createElement('div');
      rootRef.current = createRoot(container);
      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        zIndex,
        position: {
          lat: position.latitude,
          lng: position.longitude,
        },
        content: container,
      });

      return () => {
        nextTickScheduler(() => rootRef.current?.unmount());
        markerRef.current?.remove();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (!markerRef.current || !rootRef.current) {
        return;
      }

      rootRef.current.render(children);
      markerRef.current.position = {
        lat: position.latitude,
        lng: position.longitude,
      };
      markerRef.current.map = map;
      markerRef.current.gmpDraggable = draggable;
    }, [children, draggable, map, position.latitude, position.longitude]);

    useEffect(() => {
      function handleDragStart(e: MarkerDragEvent) {
        onDragStart?.(e);
      }

      const listener = markerRef.current?.addListener(
        'dragstart',
        handleDragStart
      );

      return () => {
        listener?.remove();
      };
    }, [onDragStart]);

    useEffect(() => {
      function handleDrag(e: MarkerDragEvent) {
        onDrag?.(e);
      }

      const listener = markerRef.current?.addListener('drag', handleDrag);

      return () => {
        listener?.remove();
      };
    }, [onDrag]);

    useEffect(() => {
      function handleDragEnd(e: MarkerDragEvent) {
        onDragEnd?.(e);
      }

      const listener = markerRef.current?.addListener('dragend', handleDragEnd);

      return () => {
        listener?.remove();
      };
    }, [onDragEnd]);

    return null;
  }
);

Marker.displayName = 'Marker';
