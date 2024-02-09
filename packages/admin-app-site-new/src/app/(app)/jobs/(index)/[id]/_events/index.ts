import { createEvent } from 'react-event-hook';

import type { Coordinate } from '@/app/(app)/jobs/(index)/[id]/_types';

type RequestEventModel = {
  status: 'pending' | 'settled' | 'error';
  error?: unknown;
};

export const { emitJobMarkerDragEnd, useJobMarkerDragEndListener } =
  createEvent('jobMarkerDragEnd')<Coordinate>();

export const { emitPatchJobRequestChange, usePatchJobRequestChangeListener } =
  createEvent('patchJobRequestChange')<RequestEventModel>();

export const {
  emitFetchLocationDetailsRequestChange,
  useFetchLocationDetailsRequestChangeListener,
} = createEvent('fetchLocationDetailsRequestChange')<RequestEventModel>();

export const {
  emitFetchPlaceFromCoordinatesRequestChange,
  useFetchPlaceFromCoordinatesRequestChangeListener,
} = createEvent('fetchPlaceFromCoordinatesRequestChange')<RequestEventModel>();

export const { emitVehicleLocationSelect, useVehicleLocationSelectListener } =
  createEvent('vehicleLocationSelect')();

export const { emitViewInvoiceRequest, useViewInvoiceRequestListener } =
  createEvent('viewInvoiceRequest')<{ invoiceUrl: string }>();
