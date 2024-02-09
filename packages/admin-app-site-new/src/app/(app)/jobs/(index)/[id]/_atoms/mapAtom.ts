/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai';
import { atomWithImmer } from 'jotai-immer';

import {
  Map,
  type MapRef,
  type MapViewState,
} from '@/app/(app)/jobs/(index)/_components';
import type { Coordinate } from '@/app/(app)/jobs/(index)/[id]/_types';

type MapAtomData = {
  viewState?: MapViewState;
  jobMarkerLocation?: Coordinate;
  showJobMarkerHint?: boolean;
  mapRef?: MapRef;
};

const mapAtom = atomWithImmer<MapAtomData>({
  viewState: Map.FULL_USA_VIEW_STATE,
});

export function useMapAtom() {
  const [data, setData] = useAtom(mapAtom);

  function setMapRef(mapRef: MapRef) {
    if (!data.mapRef) {
      setData(prev => {
        prev.mapRef = mapRef;
      });
    }
  }

  function setViewState(
    viewState: MapViewState | ((viewState?: MapViewState) => MapViewState)
  ) {
    setData(prev => {
      prev.viewState =
        typeof viewState === 'function' ? viewState(prev.viewState) : viewState;
    });
  }

  function setJobMarkerLocation({ latitude, longitude }: Coordinate) {
    setData(prev => {
      prev.jobMarkerLocation = { latitude, longitude };
    });
  }

  function navigateToLocation({
    latitude,
    longitude,
    showJobMarkerHint: _showJobMarkerHint = true,
    zoom = 15,
    mutateJobMarker = true,
  }: Coordinate & {
    showJobMarkerHint?: boolean;
    zoom?: number;
    mutateJobMarker?: boolean;
  }) {
    data.mapRef?.setCenter({
      lat: latitude,
      lng: longitude,
    });
    data.mapRef?.setZoom(zoom);

    if (mutateJobMarker) {
      setData(prev => {
        prev.showJobMarkerHint = _showJobMarkerHint;
        prev.jobMarkerLocation = { latitude, longitude };
      });
    }
  }

  function showJobMarkerHint() {
    setData(prev => {
      prev.showJobMarkerHint = true;
    });
  }

  function hideJobMarkerHint() {
    setData(prev => {
      prev.showJobMarkerHint = false;
    });
  }

  return {
    data,
    setMapRef,
    setViewState,
    setJobMarkerLocation,
    navigateToLocation,
    showJobMarkerHint,
    hideJobMarkerHint,
  };
}

export function mountMapInitialState(initialState: MapAtomData) {
  return [mapAtom, initialState] as const;
}
