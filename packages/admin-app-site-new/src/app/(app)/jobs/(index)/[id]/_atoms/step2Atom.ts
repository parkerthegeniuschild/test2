/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai';
import { atomWithImmer } from 'jotai-immer';

type Step2AtomData = {
  shouldValidateFields?: boolean;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  street?: string | null;
  streetNumber?: string | null;
  zip?: string | null;
  locationType?: string | null;
  locationDetails?: string | null;
  locationNotes?: string | null;
};

const step2Atom = atomWithImmer<Step2AtomData>({});

export function useStep2Atom() {
  const [data, setData] = useAtom(step2Atom);

  function setAddress(address: string) {
    setData(prev => {
      prev.address = address;
    });
  }

  function setAddressMetadata(
    payload: Pick<
      Step2AtomData,
      'city' | 'state' | 'locationType' | 'street' | 'streetNumber' | 'zip'
    >
  ) {
    setData(prev => {
      prev.city = payload.city;
      prev.state = payload.state;
      prev.locationType = payload.locationType;
      prev.street = payload.street;
      prev.streetNumber = payload.streetNumber;
      prev.zip = payload.zip;
    });
  }

  function setLocationDetails(locationDetails: string) {
    setData(prev => {
      prev.locationDetails = locationDetails;
    });
  }

  function setLocationNotes(locationNotes: string) {
    setData(prev => {
      prev.locationNotes = locationNotes;
    });
  }

  function setShouldValidateFields(shouldValidateFields: boolean) {
    setData(prev => {
      prev.shouldValidateFields = shouldValidateFields;
    });
  }

  function setInitialData(payload: Step2AtomData) {
    setData(payload);
  }

  return {
    data,
    setAddress,
    setAddressMetadata,
    setLocationDetails,
    setLocationNotes,
    setShouldValidateFields,
    setInitialData,
  };
}

export function mountStep2InitialState(initialState: Step2AtomData) {
  return [step2Atom, initialState] as const;
}
