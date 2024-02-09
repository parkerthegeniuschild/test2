import { useCallback, useEffect, useState, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useGetPageSize, usePlatform, useRouter } from '@/app/(app)/_hooks';
import { S } from '@/app/(app)/jobs/(index)/_components';
import {
  CancelButton,
  SaveButton,
  Stepper,
} from '@/app/(app)/jobs/(index)/_components/Footer';
import {
  useGetJob,
  useGetPriceSummary,
  usePublishJob,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  useJobWorkflowStatus,
  useMapAtom,
  usePageAtom,
  useShouldBlurSection,
  useStep2Atom,
  useStep3Atom,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { vehicleValidation } from '@/app/(app)/jobs/(index)/[id]/_utils';
import { Text, toast } from '@/components';
import { Flex } from '@/styled-system/jsx';

import { usePatchJobRequestChangeListener } from '../_events';

import { DraftOnly } from './DraftOnly';
import { LeaveJobModal } from './LeaveJobModal';
import { PriceSummary } from './PriceSummary';

export function Footer() {
  const router = useRouter();

  const pageSize = useGetPageSize();

  const jobId = useJobId();

  const getJob = useGetJob(jobId);

  const shouldBlurSection = useShouldBlurSection();
  const jobWorkflowStatus = useJobWorkflowStatus();

  const pageAtom = usePageAtom();
  const step2Atom = useStep2Atom();
  const step3Atom = useStep3Atom();
  const mapAtom = useMapAtom();

  const queryClient = useQueryClient();

  const publishJob = usePublishJob(jobId, {
    refetchJobOnSuccess: true,
    onMutate() {
      pageAtom.setIsPublishing(true);
    },
    onSuccess() {
      pageAtom.goToNextStep();
      step3Atom.setShouldValidateFields(false);

      void queryClient.invalidateQueries({
        queryKey: [useGetPriceSummary.queryKey],
      });
    },
    onError(error) {
      toast.error(
        `Error while finishing job${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
    onSettled() {
      pageAtom.setIsPublishing(false);
    },
  });

  const platform = usePlatform();

  const [isNavigating, startNavigationTransition] = useTransition();

  const [isPageDirty, setIsPageDirty] = useState(false);
  const [isGoingToNextStep, setIsGoingToNextStep] = useState(false);
  const [isLeaveJobWorkflowModalOpen, setIsLeaveJobWorkflowModalOpen] =
    useState(false);

  usePatchJobRequestChangeListener(
    ({ status }) => status === 'pending' && setIsPageDirty(true)
  );

  const hasSetLocation =
    typeof getJob.data?.location_latitude === 'number' &&
    typeof getJob.data?.location_longitude === 'number';

  const handleSaveAndNext = useCallback(async () => {
    if (shouldBlurSection || isGoingToNextStep) {
      return;
    }

    step2Atom.setShouldValidateFields(true);

    const isAllStep2FieldsFilled =
      step2Atom.data.address && step2Atom.data.locationDetails;

    if (!isAllStep2FieldsFilled) {
      return;
    }

    setIsGoingToNextStep(true);
    try {
      await getJob.refetch();
      pageAtom.goToNextStep();
      mapAtom.hideJobMarkerHint();
    } finally {
      setIsGoingToNextStep(false);
    }
  }, [
    getJob,
    isGoingToNextStep,
    mapAtom,
    pageAtom,
    shouldBlurSection,
    step2Atom,
  ]);

  const handleFinishJobCreation = useCallback(() => {
    if (shouldBlurSection || publishJob.isLoading || publishJob.isSuccess) {
      return;
    }

    step3Atom.setShouldValidateFields(true);

    const isAllVehiclesValid = step3Atom.data.vehicles.every(vehicle =>
      vehicleValidation.validate(vehicle)
    );

    if (!isAllVehiclesValid) {
      return;
    }

    publishJob.mutate();
  }, [publishJob, shouldBlurSection, step3Atom]);

  const handleCancelJobWorkflow = useCallback(() => {
    if (shouldBlurSection || isGoingToNextStep || publishJob.isLoading) {
      return;
    }

    if (isPageDirty || !getJob.data?.is_abandoned) {
      setIsLeaveJobWorkflowModalOpen(true);
      return;
    }

    startNavigationTransition(() => router.push(`/jobs?size=${pageSize}`));
  }, [
    getJob.data?.is_abandoned,
    isGoingToNextStep,
    isPageDirty,
    pageSize,
    publishJob.isLoading,
    router,
    shouldBlurSection,
  ]);

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
        if (pageAtom.data.currentStep === 2) {
          e.stopPropagation();
          void handleSaveAndNext();
        }

        if (pageAtom.data.currentStep === 3) {
          e.stopPropagation();
          handleFinishJobCreation();
        }
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
  }, [
    handleFinishJobCreation,
    handleSaveAndNext,
    pageAtom.data.currentStep,
    platform,
  ]);

  useEffect(() => {
    function handleCancelJobWorkflowShortcut(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        const isAnyOverlayComponentOpened =
          !!document.querySelector('[data-enter]');

        if (isAnyOverlayComponentOpened) {
          return;
        }

        handleCancelJobWorkflow();
      }
    }

    if (jobWorkflowStatus === 'published') {
      return () => {};
    }

    document.addEventListener('keydown', handleCancelJobWorkflowShortcut);

    return () => {
      document.removeEventListener('keydown', handleCancelJobWorkflowShortcut);
    };
  }, [handleCancelJobWorkflow, jobWorkflowStatus]);

  return (
    <>
      <S.Footer.Container overflow="auto">
        {!hasSetLocation && (
          <Text lineHeight="md">Enter an address for service area rates.</Text>
        )}

        {hasSetLocation && (
          <div>
            <PriceSummary />
          </div>
        )}

        <DraftOnly>
          <Flex align="center" justify="space-between">
            <Stepper activeStep={pageAtom.data.currentStep} />

            <Flex gap={3}>
              <CancelButton
                disabled={
                  shouldBlurSection ||
                  isNavigating ||
                  publishJob.isLoading ||
                  isGoingToNextStep
                }
                onClick={handleCancelJobWorkflow}
              />

              {pageAtom.data.currentStep === 2 && (
                <SaveButton
                  disabled={
                    shouldBlurSection || isNavigating || isGoingToNextStep
                  }
                  loading={isGoingToNextStep}
                  onClick={handleSaveAndNext}
                />
              )}

              {pageAtom.data.currentStep === 3 && (
                <SaveButton
                  disabled={
                    shouldBlurSection || isNavigating || publishJob.isLoading
                  }
                  loading={publishJob.isLoading}
                  onClick={handleFinishJobCreation}
                >
                  Finish
                </SaveButton>
              )}
            </Flex>
          </Flex>
        </DraftOnly>
      </S.Footer.Container>

      <DraftOnly>
        <LeaveJobModal
          open={isLeaveJobWorkflowModalOpen}
          onClose={() => setIsLeaveJobWorkflowModalOpen(false)}
        />
      </DraftOnly>
    </>
  );
}
