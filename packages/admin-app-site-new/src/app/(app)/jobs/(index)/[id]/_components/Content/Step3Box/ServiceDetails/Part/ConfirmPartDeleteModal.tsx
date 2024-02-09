import { useDeleteServicePart } from '@/app/(app)/jobs/(index)/[id]/_api';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Button, Modal, toast } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

interface ConfirmPartDeleteModalProps {
  open: boolean;
  partName: string;
  partId: number;
  vehicleId: number;
  serviceId: number;
  onClose: () => void;
  onSuccessfulDelete: () => void;
}

export function ConfirmPartDeleteModal({
  open,
  partName,
  partId,
  serviceId,
  vehicleId,
  onClose,
  onSuccessfulDelete,
}: ConfirmPartDeleteModalProps) {
  const jobId = useJobId();

  const deleteServicePart = useDeleteServicePart({
    onSuccess() {
      toast.success('Part deleted successfully');

      onSuccessfulDelete();
    },
    onError(error) {
      toast.error(
        `Error while deleting part${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });

  function handleClose() {
    if (deleteServicePart.isLoading) {
      return;
    }

    onClose();
  }

  return (
    <Modal
      open={open}
      hideOnEscape={!deleteServicePart.isLoading}
      hideOnInteractOutside={!deleteServicePart.isLoading}
      unmountOnHide
      onClose={handleClose}
    >
      <Modal.Heading>Delete part?</Modal.Heading>
      <Modal.Description>
        Are you sure you want to delete{' '}
        <strong className={css({ fontWeight: 'semibold' })}>{partName}</strong>?
      </Modal.Description>

      <Flex mt={3} gap={2} justify="flex-end">
        <Modal.Dismiss disabled={deleteServicePart.isLoading}>
          Cancel
        </Modal.Dismiss>
        <Button
          danger
          size="sm"
          disabled={deleteServicePart.isLoading}
          loading={deleteServicePart.isLoading}
          onClick={() =>
            deleteServicePart.mutate({
              id: partId,
              jobId,
              serviceId,
              vehicleId,
            })
          }
        >
          Delete
        </Button>
      </Flex>
    </Modal>
  );
}
