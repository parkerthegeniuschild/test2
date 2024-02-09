import { useDeleteVehiclePhoto } from '@/app/(app)/jobs/(index)/[id]/_api';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Button, Modal, toast } from '@/components';
import { Flex } from '@/styled-system/jsx';

interface ConfirmPhotoDeleteModalProps {
  open: boolean;
  photoId: number;
  vehicleId: number;
  onClose: () => void;
  onSuccessfulDelete: () => void;
}

export function ConfirmPhotoDeleteModal({
  open,
  photoId,
  vehicleId,
  onClose,
  onSuccessfulDelete,
}: ConfirmPhotoDeleteModalProps) {
  const jobId = useJobId();

  const deleteVehiclePhoto = useDeleteVehiclePhoto({
    onSuccess() {
      toast.success('Photo deleted successfully');

      onSuccessfulDelete();
    },
    onError(error) {
      toast.error(
        `Error while deleting photo${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });

  function handleClose() {
    if (deleteVehiclePhoto.isLoading) {
      return;
    }

    onClose();
  }

  return (
    <Modal
      open={open}
      hideOnEscape={!deleteVehiclePhoto.isLoading}
      hideOnInteractOutside={!deleteVehiclePhoto.isLoading}
      unmountOnHide
      onClose={handleClose}
    >
      <Modal.Heading>Delete photo?</Modal.Heading>
      <Modal.Description>
        Are you sure you want to delete this photo?
      </Modal.Description>

      <Flex mt={3} gap={2} justify="flex-end">
        <Modal.Dismiss disabled={deleteVehiclePhoto.isLoading}>
          Cancel
        </Modal.Dismiss>
        <Button
          danger
          size="sm"
          disabled={deleteVehiclePhoto.isLoading}
          loading={deleteVehiclePhoto.isLoading}
          onClick={() =>
            deleteVehiclePhoto.mutate({ jobId, photoId, vehicleId })
          }
        >
          Delete
        </Button>
      </Flex>
    </Modal>
  );
}
