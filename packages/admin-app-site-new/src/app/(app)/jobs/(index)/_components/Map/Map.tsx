import { useEffect, useState } from 'react';
import {
  GoogleMap,
  type Libraries,
  useJsApiLoader,
} from '@react-google-maps/api';

import { Button, ButtonGroup, Icon, IconButton } from '@/components';
import { env } from '@/env';
import { css, cva } from '@/styled-system/css';
import { Box, Flex } from '@/styled-system/jsx';

import { Marker, type MarkerElement } from './Marker';
import type { MapRef, MapViewState } from './types';

const MAX_ZOOM_ALLOWED = 22;
const MIN_ZOOM_ALLOWED = 3;
const FULL_USA_VIEW_STATE = {
  longitude: -95.71652175901282,
  latitude: 39.79397994995538,
  zoom: 5,
};
const DEFAULT_CENTER = {
  lat: FULL_USA_VIEW_STATE.latitude,
  lng: FULL_USA_VIEW_STATE.longitude,
};
const GOOGLE_LIBRARIES: Libraries = ['marker'];

const buttonStyles = cva({
  base: {
    shadow: 'none!',
    fontWeight: 'medium!',

    _after: {
      display: 'none',
    },

    '& .button-wrapper': {
      borderTopWidth: '0!',
      borderBottomWidth: '0!',
    },

    _firstOfType: {
      '& .button-wrapper': {
        borderLeftWidth: '0!',
      },
    },

    _lastOfType: {
      '& .button-wrapper': {
        borderRightWidth: '0!',
      },
    },
  },
  variants: {
    active: {
      true: {
        fontWeight: 'semibold!',

        '& .button-wrapper': {
          color: 'primary.600!',
        },
      },
    },
    icon: {
      true: {
        '& .button-slot-container': {
          color: 'gray.500!',
        },

        '&:hover:not(:disabled)': {
          '& .button-slot-container': {
            color: 'gray.700!',
          },
        },

        _active: {
          '& .button-slot-container': {
            color: 'gray.500!',
          },
        },
      },
    },
    vertical: {
      true: {
        transform: 'rotate(90deg)',
      },
    },
    shadow: {
      true: {
        shadow: 'menu.md!',
      },
    },
  },
});

interface MapProps {
  initialViewState?: Partial<MapViewState>;
  getMapRef?: (map: MapRef) => void;
  showLocationButton?: boolean;
  locationButtonProps?: React.ComponentProps<typeof IconButton>;
}

export function Map({
  children,
  initialViewState,
  getMapRef,
  showLocationButton,
  locationButtonProps,
}: React.PropsWithChildren<MapProps>) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_API_KEY ?? '',
    libraries: GOOGLE_LIBRARIES,
  });

  const [map, setMap] = useState<MapRef | null>(null);
  const [mapStyle, setMapStyle] = useState<'roadmap' | 'hybrid'>('roadmap');

  function handleZoomChange(type: 'increase' | 'decrease') {
    return () => {
      const mapZoom = map?.getZoom();

      if (typeof mapZoom !== 'number') {
        return;
      }

      if (type === 'decrease') {
        map?.setZoom(Math.max(mapZoom - 1, MIN_ZOOM_ALLOWED));
      }

      if (type === 'increase') {
        map?.setZoom(Math.min(mapZoom + 1, MAX_ZOOM_ALLOWED));
      }
    };
  }

  useEffect(() => {
    if (!map) {
      return;
    }

    if (typeof initialViewState?.zoom === 'number') {
      map.setZoom(initialViewState.zoom);
    }

    if (
      typeof initialViewState?.latitude === 'number' &&
      typeof initialViewState?.longitude === 'number'
    ) {
      map.setCenter({
        lat: initialViewState.latitude,
        lng: initialViewState.longitude,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return (
    <Box flex={1} bgColor="gray.100" pos="relative">
      {isLoaded && (
        <>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={DEFAULT_CENTER}
            zoom={FULL_USA_VIEW_STATE.zoom}
            mapTypeId={mapStyle}
            options={{
              maxZoom: MAX_ZOOM_ALLOWED,
              minZoom: MIN_ZOOM_ALLOWED,
              mapId: env.NEXT_PUBLIC_GOOGLE_MAPS_ID,
              clickableIcons: false,
            }}
            onLoad={_map => {
              setMap(_map);
              getMapRef?.(_map);
            }}
            onUnmount={() => setMap(null)}
          >
            {children}
          </GoogleMap>

          <ButtonGroup
            pos="absolute"
            top={4}
            left={4}
            size="sm"
            shadow="menu.md"
            rounded="md.xl"
          >
            <Button
              className={buttonStyles({ active: mapStyle === 'roadmap' })}
              onClick={() => setMapStyle('roadmap')}
            >
              Map
            </Button>
            <Button
              className={buttonStyles({ active: mapStyle === 'hybrid' })}
              onClick={() => setMapStyle('hybrid')}
            >
              Satellite
            </Button>
          </ButtonGroup>

          <Flex
            direction="column"
            pos="absolute"
            bottom={4}
            left={4}
            zIndex={2}
            gap={2}
          >
            {showLocationButton && (
              <IconButton
                size="sm"
                variant="secondary"
                className={buttonStyles({ icon: true, shadow: true })}
                {...locationButtonProps}
              >
                <Icon.Target />
              </IconButton>
            )}

            <ButtonGroup
              size="sm"
              shadow="menu.md"
              rounded="md.xl"
              display="flex"
              flexDirection="column"
              css={{ '& > *:not(:last-of-type)': { mb: '-1px' } }}
            >
              <IconButton
                className={buttonStyles({ icon: true, vertical: true })}
                title="Zoom in"
                onClick={handleZoomChange('increase')}
              >
                <Icon.Plus
                  width="1em"
                  height="1em"
                  className={css({ fontSize: 'xl' })}
                />
              </IconButton>
              <IconButton
                className={buttonStyles({ icon: true, vertical: true })}
                title="Zoom out"
                onClick={handleZoomChange('decrease')}
              >
                <Icon.Minus
                  className={css({
                    fontSize: 'xl',
                    transform: 'rotate(90deg)',
                  })}
                />
              </IconButton>
            </ButtonGroup>
          </Flex>
        </>
      )}
    </Box>
  );
}

Map.Marker = Marker;
Map.FULL_USA_VIEW_STATE = FULL_USA_VIEW_STATE;

export type { MarkerElement };
