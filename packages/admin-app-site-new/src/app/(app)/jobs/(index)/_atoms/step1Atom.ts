import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

import type { Company, Dispatcher, Driver } from '../_types';

import { customerAtom, isCustomerBoxFocusedAtom } from './customerAtom';
import { dispatcherAtom, isDispatcherBoxFocusedAtom } from './dispatcherAtom';
import { driverAtom, isDriverBoxFocusedAtom } from './driverAtom';

type Step1AtomData = {
  shouldValidateFields?: boolean;
  customerReference: string;
};

const step1Atom = atom<Step1AtomData>({ customerReference: '' });

export function useStep1Atom() {
  const [data, setData] = useAtom(step1Atom);

  const setCustomerAtomData = useSetAtom(customerAtom);
  const setDispatcherAtomData = useSetAtom(dispatcherAtom);
  const setDriverAtomData = useSetAtom(driverAtom);

  function setShouldValidateFields(shouldValidateFields: boolean) {
    setData(prev => ({ ...prev, shouldValidateFields }));
  }

  function setCustomerReference(customerReference: string) {
    setData(prev => ({ ...prev, customerReference }));
  }

  function setInitialData(payload: {
    company?: Company | null;
    dispatchers: Dispatcher[];
    drivers: Driver[];
    customerReference: string;
  }) {
    if (payload.company) {
      setCustomerAtomData({
        state: 'card',
        company: payload.company,
      });
    }

    setData(prev => ({
      ...prev,
      customerReference: payload.customerReference,
    }));

    setDispatcherAtomData({
      state: 'autocomplete',
      dispatchers: payload.dispatchers,
    });

    setDriverAtomData({
      state: payload.drivers.length === 0 ? 'noDrivers' : 'autocomplete',
      drivers: payload.drivers,
    });
  }

  return {
    data,
    setShouldValidateFields,
    setCustomerReference,
    setInitialData,
  };
}

export function useShouldBlurSection() {
  const isCustomerBoxFocused = useAtomValue(isCustomerBoxFocusedAtom);
  const isDispatcherBoxFocused = useAtomValue(isDispatcherBoxFocusedAtom);
  const isDriverBoxFocused = useAtomValue(isDriverBoxFocusedAtom);

  return isCustomerBoxFocused || isDispatcherBoxFocused || isDriverBoxFocused;
}
