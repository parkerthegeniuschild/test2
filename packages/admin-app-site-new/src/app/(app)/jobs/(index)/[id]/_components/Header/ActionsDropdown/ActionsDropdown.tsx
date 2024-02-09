import { useState } from 'react';

import type { JobStatus } from '@/app/(app)/jobs/_types';
import {
  useGetJob,
  usePatchJobStatus,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import { useIsJobUnlocked } from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Button, Dropdown, toast } from '@/components';

import {
  JobStatusChangeWarningModal,
  type Message,
} from './JobStatusChangeWarningModal';

interface ActionsDropdownProps {
  jobStatus: JobStatus;
}

export function ActionsDropdown({ jobStatus }: ActionsDropdownProps) {
  const jobId = useJobId();

  const getJob = useGetJob(jobId);
  const patchJobStatus = usePatchJobStatus(jobId, {
    onMutate(data) {
      getJob.updateData({ status_id: data.status });
    },
    onSuccess: getJob.refetch,
    onError(error, variables) {
      toast.error(
        `Error while updating job status${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );

      if (variables.oldStatus) {
        getJob.updateData({ status_id: variables.oldStatus });
      }
    },
  });

  const [warningMessage, setWarningMessage] = useState<Message | null>(null);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  const isJobUnlocked = useIsJobUnlocked();

  const shouldShowCompleteOption =
    isJobUnlocked && !jobStatus.includes('COMPLETED');
  const shouldShowCancelOption =
    isJobUnlocked && !jobStatus.includes('CANCELED');

  const shouldShowApproveAndLockOption = jobStatus.includes('PENDING_REVIEW');
  const shouldShowUnlockOption = !isJobUnlocked;

  function mutateJobStatus(status: JobStatus) {
    patchJobStatus.mutate({
      status,
      oldStatus: getJob.data?.status_id,
    });
  }

  function showWarningModal(message: Message) {
    setWarningMessage(message);
    setIsWarningModalOpen(true);
  }

  function handleCompleteJob() {
    const hasProviderAssigned = !!getJob.data?.provider;

    if (!hasProviderAssigned) {
      showWarningModal({
        title: 'Assign a provider first!',
        description:
          "To complete this job, it's necessary to have a provider assigned.",
      });
      return;
    }

    const jobHasAllServicesCompleted = getJob.data?.jobVehicles.every(vehicle =>
      vehicle.jobServices.every(service => service.status === 'COMPLETED')
    );

    if (!jobHasAllServicesCompleted) {
      showWarningModal({
        title: 'Complete all services first!',
        description:
          "To complete this job, it's necessary to have all services completed.",
      });
      return;
    }

    mutateJobStatus('COMPLETED_PENDING_REVIEW');
  }

  function handleCancelJob() {
    mutateJobStatus('CANCELED_PENDING_REVIEW');
  }

  function handleApproveAndLockJob() {
    if (getJob.data?.status_id === 'COMPLETED_PENDING_REVIEW') {
      mutateJobStatus('COMPLETED');
    }

    if (getJob.data?.status_id === 'CANCELED_PENDING_REVIEW') {
      mutateJobStatus('CANCELED');
    }
  }

  function handleUnlockJob() {
    if (getJob.data?.status_id === 'COMPLETED') {
      mutateJobStatus('COMPLETED_PENDING_REVIEW');
    }

    if (getJob.data?.status_id === 'CANCELED') {
      mutateJobStatus('CANCELED_PENDING_REVIEW');
    }
  }

  return (
    <>
      <Dropdown
        css={{ zIndex: 'popover!' }}
        trigger={
          <Button variant="secondary" size="sm">
            More
          </Button>
        }
      >
        <Dropdown.Heading>Actions</Dropdown.Heading>

        {shouldShowCompleteOption && (
          <Dropdown.Item onClick={handleCompleteJob}>
            Complete job
          </Dropdown.Item>
        )}
        {shouldShowCancelOption && (
          <Dropdown.Item css={{ color: 'danger!' }} onClick={handleCancelJob}>
            Cancel job
          </Dropdown.Item>
        )}

        {shouldShowApproveAndLockOption && (
          <Dropdown.Item onClick={handleApproveAndLockJob}>
            Approve & lock job
          </Dropdown.Item>
        )}
        {shouldShowUnlockOption && (
          <Dropdown.Item onClick={handleUnlockJob}>Unlock job</Dropdown.Item>
        )}
      </Dropdown>

      <JobStatusChangeWarningModal
        open={isWarningModalOpen}
        title={warningMessage?.title ?? ''}
        description={warningMessage?.description ?? ''}
        onClose={() => setIsWarningModalOpen(false)}
        onUnmount={() => setWarningMessage(null)}
      />
    </>
  );
}
