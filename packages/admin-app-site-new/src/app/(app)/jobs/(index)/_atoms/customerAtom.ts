import { atom, useAtom } from 'jotai';

import { nextTickScheduler } from '@/app/_utils';

import type { Company } from '../_types';

import { moveFocusTo } from './moveFocusTo';

type CustomerAtomData = {
  state: 'autocomplete' | 'form' | 'card';
  initialName?: string;
  company?: Company | null;
};

export const customerAtom = atom<CustomerAtomData>({ state: 'autocomplete' });

export function useCustomerAtom() {
  const [data, setData] = useAtom(customerAtom);

  function goToFormState(initialName: string) {
    setData(prev => ({ ...prev, state: 'form', initialName }));
  }

  function goToAutocompleteState() {
    setData(prev => ({ ...prev, state: 'autocomplete', company: null }));
  }

  function goToCardState(company: Company) {
    nextTickScheduler(moveFocusTo.dispatcher);

    setData(prev => ({ ...prev, state: 'card', company }));
  }

  return { data, goToFormState, goToAutocompleteState, goToCardState };
}

export const isCustomerBoxFocusedAtom = atom(
  get => get(customerAtom).state === 'form'
);
