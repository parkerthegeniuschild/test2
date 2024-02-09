import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import { clearObject } from '@/app/_utils';
import { useGetPageSize, usePlatform, useRouter } from '@/app/(app)/_hooks';
import {
  useCustomerAtom,
  useDispatcherAtom,
  useDriverAtom,
  useShouldBlurSection,
  useStep1Atom,
} from '@/app/(app)/jobs/(index)/_atoms';
import { S } from '@/app/(app)/jobs/(index)/_components';
import {
  CancelButton,
  SaveButton,
  Stepper,
} from '@/app/(app)/jobs/(index)/_components/Footer';
import { Button, Modal } from '@/components';
import { Flex } from '@/styled-system/jsx';

import type { PostJobPayload } from '../_api';

interface FooterProps {
  isLoading?: boolean;
  onSaveJob: (payload: PostJobPayload) => void;
}

export function Footer({ isLoading, onSaveJob }: FooterProps) {
  const router = useRouter();

  const shouldBlurSection = useShouldBlurSection();

  const step1Atom = useStep1Atom();
  const customerAtom = useCustomerAtom();
  const driverAtom = useDriverAtom();
  const dispatcherAtom = useDispatcherAtom();

  const platform = usePlatform();

  const [isDeleteDraftModalOpen, setIsDeleteDraftModalOpen] = useState(false);
  const pageSize = useGetPageSize();

  const isCustomerSectionFilled = !!customerAtom.data.company;
  const isDispatcherSectionFilled =
    (dispatcherAtom.data.dispatchers?.length ?? 0) > 0;
  const isDriverSectionFilled =
    (driverAtom.data.drivers?.length ?? 0) > 0 ||
    driverAtom.data.state === 'noDrivers';
  const isCustomerReferenceFilled =
    step1Atom.data.customerReference.trim().length > 0;

  const isSomeSectionFilled =
    isCustomerSectionFilled ||
    isDispatcherSectionFilled ||
    isDriverSectionFilled ||
    isCustomerReferenceFilled;

  const handleSaveJob = useCallback(() => {
    if (shouldBlurSection) {
      return;
    }

    step1Atom.setShouldValidateFields(true);

    const isAllRequiredSectionsFilled =
      isDispatcherSectionFilled && isDriverSectionFilled;

    if (!isAllRequiredSectionsFilled) {
      return;
    }

    onSaveJob({
      company_id: customerAtom.data.company?.id,
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
  }, [
    shouldBlurSection,
    step1Atom,
    isDispatcherSectionFilled,
    isDriverSectionFilled,
    onSaveJob,
    customerAtom.data.company?.id,
    dispatcherAtom.data.dispatchers,
    driverAtom.data.drivers,
  ]);

  const handleCancelDraft = useCallback(() => {
    if (isSomeSectionFilled) {
      setIsDeleteDraftModalOpen(true);
      return;
    }

    router.push(`/jobs?size=${pageSize}`);
  }, [isSomeSectionFilled, pageSize, router]);

  useEffect(() => {
    function handleSaveJobShortcut(e: KeyboardEvent) {
      const isAnyModalOpen = !!document.querySelector(
        '[role="dialog"]:not([hidden])'
      );

      if (isAnyModalOpen) {
        return;
      }

      const hasPressedMacKey = platform === 'mac' && e.metaKey;
      const hasPressedPcKey = platform === 'pc' && e.ctrlKey;
      const hasPressedEnter = e.key === 'Enter';

      if ((hasPressedMacKey || hasPressedPcKey) && hasPressedEnter) {
        e.stopPropagation();
        handleSaveJob();
      }
    }

    document.addEventListener('keydown', handleSaveJobShortcut, {
      capture: true,
    });

    return () => {
      document.removeEventListener('keydown', handleSaveJobShortcut, {
        capture: true,
      });
    };
  }, [handleSaveJob, platform]);

  useEffect(() => {
    function handleCancelDraftShortcut(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        const isAnyOverlayComponentOpened =
          !!document.querySelector('[data-enter]');

        if (isAnyOverlayComponentOpened || shouldBlurSection) {
          return;
        }

        handleCancelDraft();
      }
    }

    document.addEventListener('keydown', handleCancelDraftShortcut);

    return () => {
      document.removeEventListener('keydown', handleCancelDraftShortcut);
    };
  }, [handleCancelDraft, shouldBlurSection]);

  useEffect(() => {
    function handleEvent(e: BeforeUnloadEvent) {
      if (isSomeSectionFilled) {
        e.returnValue = true;
      }
    }

    window.addEventListener('beforeunload', handleEvent, { capture: true });

    return () => {
      window.removeEventListener('beforeunload', handleEvent, {
        capture: true,
      });
    };
  }, [isSomeSectionFilled]);

  return (
    <>
      <S.Footer.Container>
        <Flex align="center" justify="space-between">
          <Stepper activeStep={1} />

          <Flex gap={3}>
            <CancelButton
              disabled={shouldBlurSection || isLoading}
              onClick={handleCancelDraft}
            />

            <SaveButton
              id="save-and-next-button"
              disabled={shouldBlurSection || isLoading}
              loading={isLoading}
              onClick={handleSaveJob}
            />
          </Flex>
        </Flex>
      </S.Footer.Container>

      <Modal
        open={isDeleteDraftModalOpen}
        onClose={() => setIsDeleteDraftModalOpen(false)}
      >
        <Modal.Heading>Delete draft?</Modal.Heading>
        <Modal.Description>
          You have unsaved changes. If you leave now, your draft will be
          deleted.
        </Modal.Description>

        <Flex justify="flex-end" align="center" gap={2} mt={3}>
          <Modal.Dismiss>Cancel</Modal.Dismiss>
          <Button
            size="sm"
            danger
            render={
              <Link href={{ pathname: '/jobs', query: { size: pageSize } }} />
            }
          >
            Delete
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
