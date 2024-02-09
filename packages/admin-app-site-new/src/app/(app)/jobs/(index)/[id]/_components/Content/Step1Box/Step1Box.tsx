import { useParams } from 'next/navigation';
import { FocusTrapRegion } from '@ariakit/react';

import { clearObject } from '@/app/_utils';
import {
  useCustomerAtom,
  useDispatcherAtom,
  useDriverAtom,
  useShouldBlurSection,
  useStep1Atom,
} from '@/app/(app)/jobs/(index)/_atoms';
import { Step1 } from '@/app/(app)/jobs/(index)/_components';
import { useDispatcherEditListener } from '@/app/(app)/jobs/(index)/_events';
import { useGetJob, usePatchJob } from '@/app/(app)/jobs/(index)/[id]/_api';
import { usePageAtom } from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { Button, Heading, toast } from '@/components';
import { Box, Flex } from '@/styled-system/jsx';

import { Step1Showcase } from './Step1Showcase';

export function Step1Box() {
  const params = useParams();

  const jobId = params.id as string;

  const pageAtom = usePageAtom();
  const step1Atom = useStep1Atom();
  const customerAtom = useCustomerAtom();
  const dispatcherAtom = useDispatcherAtom();
  const driverAtom = useDriverAtom();
  const shouldBlurSection = useShouldBlurSection();

  const getJob = useGetJob(jobId);

  useDispatcherEditListener(getJob.refetch);

  const patchJob = usePatchJob(jobId, {
    refetchJobOnSuccess: true,
    onSuccess() {
      pageAtom.setFocusedSection(null);
      step1Atom.setShouldValidateFields(false);

      toast.success('Customer data successfully updated');
    },
  });

  function handleCancelStep1Edit() {
    pageAtom.setFocusedSection(null);
    step1Atom.setShouldValidateFields(false);
  }

  async function handleSaveStep1Data() {
    if (shouldBlurSection) {
      return;
    }

    step1Atom.setShouldValidateFields(true);

    const isDispatcherSectionFilled =
      (dispatcherAtom.data.dispatchers?.length ?? 0) > 0;
    const isDriverSectionFilled =
      (driverAtom.data.drivers?.length ?? 0) > 0 ||
      driverAtom.data.state === 'noDrivers';

    const isAllRequiredSectionsFilled =
      isDispatcherSectionFilled && isDriverSectionFilled;

    if (!isAllRequiredSectionsFilled) {
      return;
    }

    patchJob.mutate({
      company_id: customerAtom.data.company?.id ?? null,
      dispatcher_id: dispatcherAtom.data.dispatchers![0].id,
      drivers:
        driverAtom.data.drivers?.map(driver => {
          const _driver = {
            firstname: driver.firstname,
            phone: driver.phone,
            email: driver.email,
            lastname: driver.lastname,
            secondary_phone: driver.secondary_phone,
          };

          return clearObject(_driver);
        }) ?? [],
      customer_ref:
        step1Atom.data.customerReference.trim().length > 0
          ? step1Atom.data.customerReference.trim()
          : null,
    });
  }

  if (pageAtom.data.focusedSection !== 'customer') {
    return <Step1Showcase />;
  }

  return (
    <FocusTrapRegion
      render={
        <Flex direction="column" px="var(--content-padding-x)" pt={3} pb={5} />
      }
      enabled
    >
      <Flex align="center" justify="space-between" w="100%">
        <Heading as="h2" fontSize="md" fontWeight="semibold">
          Edit customer
        </Heading>

        <Flex gap={3}>
          <Button
            variant="secondary"
            size="sm"
            disabled={shouldBlurSection || patchJob.isLoading}
            onClick={handleCancelStep1Edit}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            id="edit-customer-save-button"
            disabled={shouldBlurSection || patchJob.isLoading}
            loading={patchJob.isLoading}
            onClick={handleSaveStep1Data}
          >
            Save
          </Button>
        </Flex>
      </Flex>

      <Box mt={3}>
        <Step1.CustomerBox />
      </Box>

      <Box mt={6}>
        <Step1.DispatchersBox />
      </Box>

      <Box mt={6}>
        <Step1.DriversBox />
      </Box>

      <Box mt={6}>
        <Step1.CustomerReference />
      </Box>
    </FocusTrapRegion>
  );
}
