import { atom, useAtom } from 'jotai';

import { nextTickScheduler } from '@/app/_utils';

import type { Driver } from '../_types';

import { moveFocusTo } from './moveFocusTo';

type DriverAtomData = {
  state: 'autocomplete' | 'form' | 'noDrivers';
  initialName?: string;
  initialLastName?: string;
  drivers?: Driver[];
  currentEditingDriverId?: Driver['id'] | null;
};

export const driverAtom = atom<DriverAtomData>({ state: 'autocomplete' });

export const MAX_DRIVERS_ALLOWED = 5;

export function useDriverAtom() {
  const [data, setData] = useAtom(driverAtom);

  function addDriver(driver: Driver) {
    if ((data.drivers?.length ?? 0) >= MAX_DRIVERS_ALLOWED) return;

    nextTickScheduler(() => {
      if ((data.drivers?.length ?? 0) + 1 === MAX_DRIVERS_ALLOWED) {
        moveFocusTo.end();
        return;
      }

      document.getElementById('drivers-autocomplete')?.focus();
    });

    setData(prev => ({
      ...prev,
      drivers: prev.drivers ? [...prev.drivers, driver] : [driver],
    }));
  }

  function removeDriver(driverId: Driver['id']) {
    setData(prev => ({
      ...prev,
      drivers: prev.drivers?.filter(d => d.id !== driverId),
    }));
  }

  function updateDriver(driver: Driver) {
    setData(prev => ({
      ...prev,
      drivers: prev.drivers?.map(d => (d.id === driver.id ? driver : d)),
    }));
  }

  function setEditingDriver(driverId: Driver['id'] | null) {
    setData(prev => ({ ...prev, currentEditingDriverId: driverId }));
  }

  function goToFormState(initialName: string) {
    const [firstName, ...lastNames] = initialName.split(' ');

    setData(prev => ({
      ...prev,
      state: 'form',
      initialName: firstName,
      initialLastName: lastNames.join(' '),
    }));
  }

  function goToAutocompleteState() {
    setData(prev => ({ ...prev, state: 'autocomplete' }));
  }

  function goToNoDriversState() {
    nextTickScheduler(moveFocusTo.end);

    setData(prev => ({ ...prev, state: 'noDrivers', drivers: [] }));
  }

  return {
    data,
    addDriver,
    removeDriver,
    updateDriver,
    setEditingDriver,
    goToFormState,
    goToAutocompleteState,
    goToNoDriversState,
  };
}

export const isDriverBoxFocusedAtom = atom(get => {
  const driver = get(driverAtom);

  return (
    driver.state === 'form' || typeof driver.currentEditingDriverId === 'number'
  );
});
