import {
  useDeleteProviderLabor,
  useGetJob,
  useGetProviderLabors,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Button, Modal, toast } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

interface ConfirmLaborRemovalModalProps {
  open: boolean;
  laborTitle: string;
  timerId: number;
  onSuccessfulRemoval: () => void;
  onClose: () => void;
}

export function ConfirmLaborRemovalModal({
  open,
  laborTitle,
  timerId,
  onSuccessfulRemoval,
  onClose,
}: ConfirmLaborRemovalModalProps) {
  const jobId = useJobId();

  const getJob = useGetJob(jobId);
  const getProviderLabors = useGetProviderLabors({ jobId }, { enabled: false });
  const deleteProviderLabor = useDeleteProviderLabor({
    async onAfterMutate() {
      void getJob.refetch();
      await getProviderLabors.refetch();
    },
    onSuccess() {
      toast.success('Labor deleted successfully');

      onSuccessfulRemoval();
    },
    onError(error) {
      toast.error(
        `Error while removing labor entry${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });

  function handleClose() {
    if (deleteProviderLabor.isLoading) {
      return;
    }

    onClose();
  }

  return (
    <Modal
      unmountOnHide
      open={open}
      hideOnEscape={!deleteProviderLabor.isLoading}
      hideOnInteractOutside={!deleteProviderLabor.isLoading}
      onClose={handleClose}
    >
      <Modal.Heading>Delete labor entry?</Modal.Heading>
      <Modal.Description>
        Are you sure you want to delete a labor entry for{' '}
        <strong className={css({ fontWeight: 'semibold' })}>
          {laborTitle}
        </strong>
        ? Once deleted, the information will be lost permanently.
      </Modal.Description>

      <Flex mt={3} gap={2} justify="flex-end">
        <Modal.Dismiss disabled={deleteProviderLabor.isLoading}>
          Cancel
        </Modal.Dismiss>
        <Button
          danger
          size="sm"
          disabled={deleteProviderLabor.isLoading}
          loading={deleteProviderLabor.isLoading}
          onClick={() => deleteProviderLabor.mutate({ jobId, timerId })}
        >
          Delete
        </Button>
      </Flex>
    </Modal>
  );
}
