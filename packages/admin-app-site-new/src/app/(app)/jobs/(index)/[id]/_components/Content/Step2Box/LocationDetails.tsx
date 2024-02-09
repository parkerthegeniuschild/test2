import { useRef } from 'react';
import { useDebounce } from 'react-use';
import { useParams } from 'next/navigation';

import { usePatchJob } from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  usePageAtom,
  useShouldBlurSection,
  useStep2Atom,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { ErrorMessage, Label, StackedInput } from '@/components';
import { Flex } from '@/styled-system/jsx';

export function LocationDetails() {
  const params = useParams();

  const patchJob = usePatchJob(params.id as string);

  const shouldBlurSection = useShouldBlurSection();
  const pageAtom = usePageAtom();
  const step2Atom = useStep2Atom();

  const isFirstDebouncePass = useRef(true);

  const isFocusedOnADifferentSection =
    shouldBlurSection && pageAtom.data.focusedSection !== 'address';
  const isOnEditMode = pageAtom.data.focusedSection === 'address';

  useDebounce(
    () => {
      if (!isFirstDebouncePass.current && !isOnEditMode) {
        patchJob.mutate({
          location_notes: step2Atom.data.locationNotes?.trim() ?? '',
        });
      }

      isFirstDebouncePass.current = false;
    },
    200,
    [step2Atom.data.locationNotes]
  );

  const shouldShowLocationDetailsError = Boolean(
    step2Atom.data.shouldValidateFields && !step2Atom.data.locationDetails
  );

  function handleLocationTypeChange(newLocationType: string) {
    step2Atom.setLocationDetails(newLocationType);

    if (isOnEditMode) {
      return;
    }

    patchJob.mutate({ location_details: newLocationType });
  }

  return (
    <Flex direction="column" gap={2} mt={6}>
      <Label as="p" required color="gray.600">
        Location details
      </Label>

      <StackedInput>
        <StackedInput.Select
          required
          showOnFocus
          buttonProps={{
            tabIndex: isFocusedOnADifferentSection ? -1 : undefined,
          }}
          placeholder="Select location type"
          error={shouldShowLocationDetailsError}
          value={step2Atom.data.locationDetails ?? ''}
          onChange={handleLocationTypeChange}
        >
          <StackedInput.Select.Item value="Highway" />
          <StackedInput.Select.Item value="Street" />
          <StackedInput.Select.Item value="Parking lot" />
          <StackedInput.Select.Item value="Loading dock" />
          <StackedInput.Select.Item value="On-ramp" />
          <StackedInput.Select.Item value="Off-ramp" />
          <StackedInput.Select.Item value="Rest stop" />
          <StackedInput.Select.Item value="Weigh station" />
          <StackedInput.Select.Item value="Garage" />
          <StackedInput.Select.Item value="Driveway" />
        </StackedInput.Select>
        <StackedInput.Textarea
          rows={4}
          placeholder="Helpful info to locate & identify the vehicle or location"
          tabIndex={isFocusedOnADifferentSection ? -1 : undefined}
          value={step2Atom.data.locationNotes ?? ''}
          onChange={e => step2Atom.setLocationNotes(e.target.value)}
        />
      </StackedInput>

      {shouldShowLocationDetailsError && (
        <ErrorMessage>Please enter location details</ErrorMessage>
      )}
    </Flex>
  );
}
