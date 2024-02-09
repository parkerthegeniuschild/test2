/* eslint-disable no-param-reassign */
import { atom, useAtom, useAtomValue } from 'jotai';
import { atomWithImmer } from 'jotai-immer';

import type { ServicePart, VehicleContact, VehicleService } from '../_types';
import { formatPrice } from '../_utils';

type Step3AtomData = {
  shouldValidateFields?: boolean;
  vehicles: VehicleContact[];
  selectedVehicleTabId?: number;
};

const step3Atom = atomWithImmer<Step3AtomData>({ vehicles: [] });

export function useStep3Atom() {
  const [data, setData] = useAtom(step3Atom);

  function setShouldValidateFields(shouldValidateFields: boolean) {
    setData(prev => {
      prev.shouldValidateFields = shouldValidateFields;
    });
  }

  function setSelectedVehicleTabId(vehicleId: number) {
    setData(prev => {
      prev.selectedVehicleTabId = vehicleId;
    });
  }

  function addVehicle(vehicle: VehicleContact) {
    const isVehicleAlreadyAdded = data.vehicles.some(v => v.id === vehicle.id);

    if (isVehicleAlreadyAdded) {
      setData(prev => {
        prev.vehicles = prev.vehicles.map(v => {
          if (v.id === vehicle.id) {
            return vehicle;
          }

          return v;
        });
      });
      return;
    }

    setData(prev => {
      prev.vehicles.push(vehicle);
    });
  }

  function removeVehicle(vehicleId: number) {
    setData(prev => {
      prev.vehicles = prev.vehicles.filter(v => v.id !== vehicleId);
    });
  }

  return {
    data,
    setShouldValidateFields,
    setSelectedVehicleTabId,
    addVehicle,
    removeVehicle,
  };
}

export function useVehicle(vehicleId: number) {
  const [data, setData] = useAtom(step3Atom);

  const vehicleIndex = data.vehicles.findIndex(v => v.id === vehicleId);
  const vehicle = data.vehicles[vehicleIndex];

  function _setData(payload: Partial<VehicleContact>) {
    setData(prev => {
      const _vehicle = prev.vehicles.find(v => v.id === vehicleId);

      if (_vehicle) {
        Object.assign(_vehicle, payload);
      }
    });
  }

  function addService(service: VehicleService) {
    const isServiceAlreadyAdded = vehicle.jobServices.some(
      s => s.id === service.id
    );

    if (isServiceAlreadyAdded) {
      setData(prev => {
        const _vehicle = prev.vehicles.find(v => v.id === vehicleId);

        if (_vehicle) {
          _vehicle.jobServices = _vehicle.jobServices.map(s => {
            if (s.id === service.id) {
              return {
                jobServiceParts: [],
                ...service,
              };
            }

            return s;
          });
        }
      });
      return;
    }

    setData(prev => {
      const _vehicle = prev.vehicles.find(v => v.id === vehicleId);

      if (_vehicle) {
        _vehicle.jobServices.push({
          jobServiceParts: [],
          ...service,
        });
      }
    });
  }

  function removeService(serviceId: number) {
    setData(prev => {
      const _vehicle = prev.vehicles.find(v => v.id === vehicleId);

      if (_vehicle) {
        _vehicle.jobServices = _vehicle.jobServices.filter(
          s => s.id !== serviceId
        );
      }
    });
  }

  return {
    data: vehicle,
    setData: _setData,
    addService,
    removeService,
  };
}

export function useVehicleService({
  vehicleId,
  serviceId,
}: {
  vehicleId: number;
  serviceId: number;
}) {
  const [data, setData] = useAtom(step3Atom);

  const vehicle = data.vehicles.find(v => v.id === vehicleId);
  const vehicleServiceIndex =
    vehicle?.jobServices.findIndex(s => s.id === serviceId) ?? -1;
  const vehicleService = vehicle?.jobServices[vehicleServiceIndex];

  function _setData(payload: Partial<Omit<VehicleService, 'id'>>) {
    setData(prev => {
      const _vehicle = prev.vehicles.find(v => v.id === vehicleId);
      const _vehicleService = _vehicle?.jobServices.find(
        s => s.id === serviceId
      );

      if (_vehicleService) {
        Object.assign(_vehicleService, payload);
      }
    });
  }

  function addPart(part: ServicePart) {
    const isPartAlreadyAdded = vehicleService?.jobServiceParts.some(
      p => p.id === part.id
    );

    if (isPartAlreadyAdded) {
      setData(prev => {
        const _vehicle = prev.vehicles.find(v => v.id === vehicleId);
        const _vehicleService = _vehicle?.jobServices.find(
          s => s.id === serviceId
        );

        if (_vehicleService) {
          _vehicleService.jobServiceParts = _vehicleService.jobServiceParts.map(
            p => {
              if (p.id === part.id) {
                return {
                  ...part,
                  price: part.price
                    ? formatPrice(part.price.toString().replace(/,/g, ''))
                    : '',
                };
              }

              return p;
            }
          );
        }
      });
      return;
    }

    setData(prev => {
      const _vehicle = prev.vehicles.find(v => v.id === vehicleId);
      const _vehicleService = _vehicle?.jobServices.find(
        s => s.id === serviceId
      );

      if (_vehicleService) {
        _vehicleService.jobServiceParts.push({
          ...part,
          price: part.price
            ? formatPrice(part.price.toString().replace(/,/g, ''))
            : '',
        });
      }
    });
  }

  function removePart(partId: number) {
    setData(prev => {
      const _vehicle = prev.vehicles.find(v => v.id === vehicleId);
      const _vehicleService = _vehicle?.jobServices.find(
        s => s.id === serviceId
      );

      if (_vehicleService) {
        _vehicleService.jobServiceParts =
          _vehicleService.jobServiceParts.filter(p => p.id !== partId);
      }
    });
  }

  return { data: vehicleService, setData: _setData, addPart, removePart };
}

export function useVehicleServicePart({
  vehicleId,
  serviceId,
  partId,
}: {
  vehicleId: number;
  serviceId: number;
  partId: number;
}) {
  const [data, setData] = useAtom(step3Atom);

  const vehicle = data.vehicles.find(v => v.id === vehicleId);
  const vehicleService = vehicle?.jobServices.find(s => s.id === serviceId);
  const vehicleServicePartIndex =
    vehicleService?.jobServiceParts.findIndex(p => p.id === partId) ?? -1;
  const vehicleServicePart =
    vehicleService?.jobServiceParts[vehicleServicePartIndex];

  function _setData(payload: Partial<Omit<ServicePart, 'id'>>) {
    setData(prev => {
      const _vehicle = prev.vehicles.find(v => v.id === vehicleId);
      const _vehicleService = _vehicle?.jobServices.find(
        s => s.id === serviceId
      );
      const _vehicleServicePart = _vehicleService?.jobServiceParts.find(
        p => p.id === partId
      );

      if (_vehicleServicePart) {
        Object.assign(_vehicleServicePart, payload);
      }
    });
  }

  return { data: vehicleServicePart, setData: _setData };
}

const selectedVehicleTabIdAtom = atom(
  get => get(step3Atom).selectedVehicleTabId
);

export function useSelectedVehicleTabIdValue() {
  return useAtomValue(selectedVehicleTabIdAtom);
}

export function mountStep3InitialState(initialState: Step3AtomData) {
  return [
    step3Atom,
    {
      selectedVehicleTabId: initialState.vehicles[0]?.id ?? -1,
      ...initialState,
    },
  ] as const;
}
