import { atom, useAtom } from 'jotai';

import { nextTickScheduler } from '@/app/_utils';

import type { Dispatcher } from '../_types';

import { moveFocusTo } from './moveFocusTo';

type DispatcherAtomData = {
  state: 'autocomplete' | 'form';
  initialName?: string;
  initialLastName?: string;
  dispatchers?: Dispatcher[];
  currentEditingDispatcherId?: Dispatcher['id'] | null;
};

export const dispatcherAtom = atom<DispatcherAtomData>({
  state: 'autocomplete',
});

export const MAX_DISPATCHERS_ALLOWED = 1;

export function useDispatcherAtom() {
  const [data, setData] = useAtom(dispatcherAtom);

  function addDispatcher(dispatcher: Dispatcher) {
    if ((data.dispatchers?.length ?? 0) >= MAX_DISPATCHERS_ALLOWED) return;

    nextTickScheduler(moveFocusTo.driver);

    setData(prev => ({
      ...prev,
      dispatchers: prev.dispatchers
        ? [...prev.dispatchers, dispatcher]
        : [dispatcher],
    }));
  }

  function removeDispatcher(dispatcherId: Dispatcher['id']) {
    setData(prev => ({
      ...prev,
      dispatchers: prev.dispatchers?.filter(d => d.id !== dispatcherId),
    }));
  }

  function updateDispatcher(dispatcher: Dispatcher) {
    setData(prev => ({
      ...prev,
      dispatchers: prev.dispatchers?.map(d =>
        d.id === dispatcher.id ? dispatcher : d
      ),
    }));
  }

  function setEditingDispatcher(dispatcherId: Dispatcher['id'] | null) {
    setData(prev => ({ ...prev, currentEditingDispatcherId: dispatcherId }));
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

  return {
    data,
    addDispatcher,
    removeDispatcher,
    updateDispatcher,
    setEditingDispatcher,
    goToFormState,
    goToAutocompleteState,
  };
}

export const isDispatcherBoxFocusedAtom = atom(get => {
  const dispatcher = get(dispatcherAtom);

  return (
    dispatcher.state === 'form' ||
    typeof dispatcher.currentEditingDispatcherId === 'number'
  );
});
