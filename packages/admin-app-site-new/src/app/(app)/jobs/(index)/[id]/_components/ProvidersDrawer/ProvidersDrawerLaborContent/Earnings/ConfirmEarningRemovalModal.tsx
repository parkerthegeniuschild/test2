import {
  useDeleteProviderEarning,
  useGetProviderEarnings,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Button, Modal, toast } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

interface ConfirmEarningRemovalModalProps {
  open: boolean;
  earningId: number;
  description: string;
  onSuccessfulRemoval: () => void;
  onClose: () => void;
  onUnmount?: () => void;
}

export function ConfirmEarningRemovalModal({
  open,
  earningId,
  description,
  onSuccessfulRemoval,
  onClose,
  onUnmount,
}: ConfirmEarningRemovalModalProps) {
  const jobId = useJobId();

  const getProviderEarnings = useGetProviderEarnings(
    { jobId },
    { enabled: false }
  );
  const deleteProviderEarning = useDeleteProviderEarning({
    async onAfterMutate() {
      await getProviderEarnings.refetch();
    },
    onSuccess() {
      toast.success('Earning deleted successfully');

      onSuccessfulRemoval();
    },
    onError(error) {
      toast.error(
        `Error while deleting earning${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });

  function handleClose() {
    if (deleteProviderEarning.isLoading) {
      return;
    }

    onClose();
  }

  return (
    <Modal
      unmountOnHide
      open={open}
      hideOnEscape={!deleteProviderEarning.isLoading}
      hideOnInteractOutside={!deleteProviderEarning.isLoading}
      onClose={handleClose}
      onUnmount={onUnmount}
    >
      <Modal.Heading>Delete earning?</Modal.Heading>
      <Modal.Description>
        Are you sure you want to delete{' '}
        <strong className={css({ fontWeight: 'semibold' })}>
          {description}
        </strong>
        ?
      </Modal.Description>

      <Flex mt={3} gap={2} justify="flex-end">
        <Modal.Dismiss disabled={deleteProviderEarning.isLoading}>
          Cancel
        </Modal.Dismiss>
        <Button
          danger
          size="sm"
          disabled={deleteProviderEarning.isLoading}
          loading={deleteProviderEarning.isLoading}
          onClick={() => deleteProviderEarning.mutate({ jobId, id: earningId })}
        >
          Delete
        </Button>
      </Flex>
    </Modal>
  );
}
