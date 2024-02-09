'use client';

import { useEffect, useState } from 'react';

import { nextTickScheduler } from '@/app/_utils';
import { Map, type MapRef } from '@/app/(app)/jobs/(index)/_components';
import { DateTimePicker, Heading, Spinner, Text } from '@/components';
import { css } from '@/styled-system/css';
import { Box } from '@/styled-system/jsx';

import {
  useGetProviderLocations,
  type UseGetProviderLocationsOptions,
} from './_api';
import { ProviderPin } from './_components';

interface ContainerProps {
  providerId: number;
  initialProviderRecentLocations?: UseGetProviderLocationsOptions['initialData'];
}

export function Container({
  providerId,
  initialProviderRecentLocations,
}: ContainerProps) {
  const [map, setMap] = useState<MapRef | null>(null);

  const [fromDate, setFromDate] = useState<Date | null>(
    new Date(Date.now() - 60 * 60 * 1000)
  );
  const [toDate, setToDate] = useState<Date | null>(null);

  const getProviderRecentLocations = useGetProviderLocations(
    {
      providerId,
      timeFrom: fromDate?.getTime() ?? undefined,
      timeTo: toDate?.getTime() ?? undefined,
    },
    { initialData: initialProviderRecentLocations }
  );

  useEffect(() => {
    if (
      initialProviderRecentLocations &&
      initialProviderRecentLocations.length > 0
    ) {
      const [location] = initialProviderRecentLocations;

      nextTickScheduler(() => {
        map?.setCenter({
          lat: location.latitude,
          lng: location.longitude,
        });
        map?.setZoom(10);
      });
    }
  }, [initialProviderRecentLocations, map]);

  return (
    <>
      <Map getMapRef={setMap}>
        {!!map &&
          getProviderRecentLocations.data?.map(location => (
            <Map.Marker
              key={location.id}
              map={map}
              position={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            >
              <ProviderPin location={location} />
            </Map.Marker>
          ))}
      </Map>

      {!!map && (
        <Box
          pos="absolute"
          top={4}
          right={4}
          bgColor="white"
          p={4}
          rounded="lg"
          shadow="menu.sm"
          w="23rem"
          zIndex="docked"
        >
          <Heading
            as="h2"
            variant="subheading"
            display="flex"
            alignItems="center"
            gap={2}
          >
            Control Panel
            {getProviderRecentLocations.isFetching && <Spinner />}
          </Heading>

          <Heading as="h3" fontSize="md" fontWeight="semibold" mt={4}>
            Time range selection
          </Heading>

          <Text mt={3} fontWeight="medium" color="gray.600">
            From
          </Text>

          <Box mt={2}>
            <DateTimePicker value={fromDate} onChange={setFromDate} />
          </Box>

          <Text mt={3} fontWeight="medium" color="gray.600">
            To{' '}
            <span className={css({ fontSize: '2xs.xl', color: 'gray.500' })}>
              (leave empty if you want to get results up to now)
            </span>
          </Text>

          <Box mt={2}>
            <DateTimePicker value={toDate} onChange={setToDate} />
          </Box>
        </Box>
      )}
    </>
  );
}
