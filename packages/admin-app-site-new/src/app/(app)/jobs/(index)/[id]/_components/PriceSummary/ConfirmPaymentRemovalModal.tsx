import {
  useDeletePayment,
  useGetPriceSummary,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Button, Modal, toast } from '@/components';
import { Flex } from '@/styled-system/jsx';

interface ConfirmPaymentRemovalModalProps {
  open: boolean;
  paymentId: number;
  onSuccessfulRemoval: () => void;
  onClose: () => void;
}

export function ConfirmPaymentRemovalModal({
  open,
  paymentId,
  onSuccessfulRemoval,
  onClose,
}: ConfirmPaymentRemovalModalProps) {
  const jobId = useJobId();

  const getPriceSummary = useGetPriceSummary({ jobId }, { enabled: false });
  const deletePayment = useDeletePayment({
    async onAfterMutate() {
      await getPriceSummary.refetch();
    },
    onSuccess() {
      toast.success('Payment deleted successfully');

      onSuccessfulRemoval();
    },
    onError(error) {
      toast.error(
        `Error while deleting payment${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });

  function handleClose() {
    if (deletePayment.isLoading) {
      return;
    }

    onClose();
  }

  return (
    <Modal
      unmountOnHide
      open={open}
      hideOnEscape={!deletePayment.isLoading}
      hideOnInteractOutside={!deletePayment.isLoading}
      onClose={handleClose}
    >
      <Modal.Heading>Delete payment?</Modal.Heading>
      <Modal.Description>
        Are you sure you want to delete this payment?
      </Modal.Description>

      <Flex mt={3} gap={2} justify="flex-end">
        <Modal.Dismiss disabled={deletePayment.isLoading}>Cancel</Modal.Dismiss>
        <Button
          danger
          size="sm"
          disabled={deletePayment.isLoading}
          loading={deletePayment.isLoading}
          onClick={() => deletePayment.mutate({ id: paymentId, jobId })}
        >
          Delete
        </Button>
      </Flex>
    </Modal>
  );
}
