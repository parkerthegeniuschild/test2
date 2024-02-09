import { useDeleteProviderFromJob } from '@/app/(app)/jobs/(index)/[id]/_api';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Button, Modal, toast } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

interface ConfirmProviderRemovalModalProps {
  open: boolean;
  provider: { id: number; name: string };
  onClose: () => void;
  onSuccessfulRemoval: () => void;
}

export function ConfirmProviderRemovalModal({
  open,
  provider,
  onClose,
  onSuccessfulRemoval,
}: ConfirmProviderRemovalModalProps) {
  const jobId = useJobId();

  const deleteProviderFromJob = useDeleteProviderFromJob(jobId, {
    refetchJobOnSuccess: true,
    onSuccess() {
      toast.success('Provider removed successfully');

      onSuccessfulRemoval();
    },
    onError(error) {
      toast.error(
        `Error while removing provider${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });

  function handleClose() {
    if (deleteProviderFromJob.isLoading) {
      return;
    }

    onClose();
  }

  return (
    <Modal
      open={open}
      hideOnEscape={!deleteProviderFromJob.isLoading}
      hideOnInteractOutside={!deleteProviderFromJob.isLoading}
      onClose={handleClose}
    >
      <Modal.Heading>Remove provider?</Modal.Heading>
      <Modal.Description>
        Are you sure you want to remove{' '}
        <strong className={css({ fontWeight: 'semibold' })}>
          {provider?.name}
        </strong>{' '}
        from this job? All job information related to this provider will be
        deleted, including labor hours, earnings and the provider&apos;s route.
      </Modal.Description>

      <Flex mt={3} gap={2} justify="flex-end">
        <Modal.Dismiss disabled={deleteProviderFromJob.isLoading}>
          Cancel
        </Modal.Dismiss>
        <Button
          danger
          size="sm"
          disabled={deleteProviderFromJob.isLoading}
          loading={deleteProviderFromJob.isLoading}
          onClick={() =>
            deleteProviderFromJob.mutate({ providerId: provider.id })
          }
        >
          Remove
        </Button>
      </Flex>
    </Modal>
  );
}
