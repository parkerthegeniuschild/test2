/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai';
import { atomWithImmer } from 'jotai-immer';

type ProviderAtomData = {
  selectedStatus: 'online' | 'offline';
  mileRadiusFilter: string;
  highlightedProviderId?: number;
  highlightTimeout?: NodeJS.Timeout;
};

const providerAtom = atomWithImmer<ProviderAtomData>({
  selectedStatus: 'online',
  mileRadiusFilter: '100',
});

export function useProviderAtom() {
  const [data, setData] = useAtom(providerAtom);

  function setSelectedStatus(
    selectedStatus: ProviderAtomData['selectedStatus']
  ) {
    setData(prev => {
      prev.selectedStatus = selectedStatus;
    });
  }

  function setMileRadiusFilter(mileRadiusFilter: string) {
    setData(prev => {
      prev.mileRadiusFilter = mileRadiusFilter;
    });
  }

  function highlightProvider(providerId: number) {
    const timeout = setTimeout(() => {
      setData(prev => {
        prev.highlightedProviderId = undefined;
      });
    }, 2000);

    clearTimeout(data.highlightTimeout);

    setData(prev => {
      prev.highlightedProviderId = providerId;
      prev.highlightTimeout = timeout;
    });
  }

  return { data, setSelectedStatus, setMileRadiusFilter, highlightProvider };
}
