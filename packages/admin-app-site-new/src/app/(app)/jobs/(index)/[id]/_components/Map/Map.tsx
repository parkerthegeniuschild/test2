import { Fragment, useRef, useState } from 'react';

import {
  getZoomByLocationType,
  Map as MapView,
  type MarkerDragEvent,
  MarkerElement,
} from '@/app/(app)/jobs/(index)/_components';
import {
  useGetJob,
  useGetNearbyProviders,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  useMapAtom,
  usePageAtom,
  useProviderAtom,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { emitJobMarkerDragEnd } from '@/app/(app)/jobs/(index)/[id]/_events';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';

import { JobPin } from './JobPin';
import { ProviderPin } from './ProviderPin';

export function Map() {
  const jobId = useJobId();

  const jobMarkerRef = useRef<MarkerElement>(null);

  const getJob = useGetJob(jobId);

  const mapAtom = useMapAtom();
  const providerAtom = useProviderAtom();
  const pageAtom = usePageAtom();

  const getNearbyProviders = useGetNearbyProviders(
    {
      jobId,
      isOnline: providerAtom.data.selectedStatus === 'online',
      mileRadius: providerAtom.data.mileRadiusFilter,
    },
    { enabled: false }
  );

  const [isDraggingJobPin, setIsDraggingJobPin] = useState(false);

  const shouldGetJobLocationFromServerData =
    pageAtom.data.currentStep > 2 && pageAtom.data.focusedSection !== 'address';

  function handleJobMarkerDrag(e: MarkerDragEvent) {
    const { lat, lng } = e.latLng?.toJSON() ?? {};

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return;
    }

    mapAtom.setJobMarkerLocation({
      latitude: lat,
      longitude: lng,
    });
    mapAtom.hideJobMarkerHint();
  }

  return (
    <MapView
      initialViewState={mapAtom.data.viewState}
      getMapRef={mapAtom.setMapRef}
      showLocationButton={
        typeof getJob.data?.location_latitude === 'number' &&
        typeof getJob.data?.location_longitude === 'number'
      }
      locationButtonProps={{
        title: 'Spotlight job location',
        onClick: () =>
          mapAtom.navigateToLocation({
            latitude: getJob.data?.location_latitude ?? 0,
            longitude: getJob.data?.location_longitude ?? 0,
            zoom: getZoomByLocationType(getJob.data?.location_type),
            showJobMarkerHint: false,
            mutateJobMarker: false,
          }),
      }}
    >
      {!!mapAtom.data.mapRef && !!mapAtom.data.jobMarkerLocation && (
        <MapView.Marker
          ref={jobMarkerRef}
          map={mapAtom.data.mapRef}
          zIndex={2}
          position={{
            latitude:
              getJob.data?.location_latitude &&
              shouldGetJobLocationFromServerData
                ? getJob.data.location_latitude
                : mapAtom.data.jobMarkerLocation.latitude,
            longitude:
              getJob.data?.location_longitude &&
              shouldGetJobLocationFromServerData
                ? getJob.data.location_longitude
                : mapAtom.data.jobMarkerLocation.longitude,
          }}
          draggable={
            (pageAtom.data.currentStep === 2 &&
              !pageAtom.data.focusedSection) ||
            pageAtom.data.focusedSection === 'address'
          }
          onDragStart={() => {
            setIsDraggingJobPin(true);
            jobMarkerRef.current?.rerender();
          }}
          onDrag={handleJobMarkerDrag}
          onDragEnd={e => {
            setIsDraggingJobPin(false);

            const { lat, lng } = e.latLng?.toJSON() ?? {};

            if (typeof lat !== 'number' || typeof lng !== 'number') {
              return;
            }

            emitJobMarkerDragEnd({
              latitude: lat,
              longitude: lng,
            });
          }}
        >
          <JobPin
            showHint={mapAtom.data.showJobMarkerHint && !isDraggingJobPin}
            showEllipses={isDraggingJobPin}
          />
        </MapView.Marker>
      )}

      {!!mapAtom.data.mapRef &&
        typeof getJob.data?.provider?.position?.location?.latitude ===
          'number' &&
        typeof getJob.data?.provider?.position?.location?.longitude ===
          'number' && (
          <MapView.Marker
            map={mapAtom.data.mapRef}
            zIndex={1}
            position={{
              latitude: getJob.data.provider.position.location.latitude,
              longitude: getJob.data.provider.position.location.longitude,
            }}
          >
            <ProviderPin
              providerInitials={`${getJob.data.provider.firstname.charAt(0)}${
                getJob.data.provider.lastname?.charAt(0) ?? ''
              }`}
              providerName={getJob.data.provider.name!}
              showNameHighlight={
                getJob.data.provider.id ===
                providerAtom.data.highlightedProviderId
              }
            />
          </MapView.Marker>
        )}

      {getNearbyProviders.data?.data
        .filter(provider => provider.id !== getJob.data?.provider?.id)
        .map(provider => {
          return (
            <Fragment key={provider.id}>
              {!!mapAtom.data.mapRef &&
                typeof provider.latitude === 'number' &&
                typeof provider.longitude === 'number' && (
                  <MapView.Marker
                    map={mapAtom.data.mapRef}
                    zIndex={1}
                    position={{
                      latitude: provider.latitude,
                      longitude: provider.longitude,
                    }}
                  >
                    <ProviderPin
                      providerInitials={`${provider.firstname.charAt(0)}${
                        provider.lastname?.charAt(0) ?? ''
                      }`}
                      providerName={provider.name!}
                      showNameHighlight={
                        provider.id === providerAtom.data.highlightedProviderId
                      }
                    />
                  </MapView.Marker>
                )}
            </Fragment>
          );
        })}

      {/* <MapView.Marker
        longitude={-108.3803243}
        latitude={43.0257916}
        anchor="bottom"
      >
        <ProviderPin providerInitials="RH" />
      </MapView.Marker>

      <MapView.Marker
        longitude={-87.6483207}
        latitude={41.8758309}
        anchor="bottom"
      >
        <ProviderPin providerInitials="JD" />
      </MapView.Marker>

      <MapView.Marker
        longitude={-105.8757755}
        latitude={33.6456307}
        anchor="bottom"
      >
        <ProviderPin providerInitials="CB" />
      </MapView.Marker> */}
    </MapView>
  );
}
