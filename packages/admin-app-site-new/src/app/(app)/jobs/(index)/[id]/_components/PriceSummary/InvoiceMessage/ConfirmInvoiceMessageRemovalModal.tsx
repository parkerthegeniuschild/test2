import { Button, Modal } from '@/components';
import { Flex } from '@/styled-system/jsx';

interface ConfirmInvoiceMessageRemovalModalProps {
  open: boolean;
  loading?: boolean;
  onDeleteRequest: () => void;
  onClose: () => void;
}

export function ConfirmInvoiceMessageRemovalModal({
  open,
  loading,
  onDeleteRequest,
  onClose,
}: ConfirmInvoiceMessageRemovalModalProps) {
  function handleClose() {
    if (loading) {
      return;
    }

    onClose();
  }

  return (
    <Modal
      unmountOnHide
      open={open}
      hideOnEscape={!loading}
      hideOnInteractOutside={!loading}
      onClose={handleClose}
    >
      <Modal.Heading>Delete invoice message?</Modal.Heading>
      <Modal.Description>
        Are you sure you want to delete the invoice message?
      </Modal.Description>

      <Flex mt={3} gap={2} justify="flex-end">
        <Modal.Dismiss disabled={loading}>Cancel</Modal.Dismiss>
        <Button
          danger
          size="sm"
          disabled={loading}
          loading={loading}
          onClick={onDeleteRequest}
        >
          Delete
        </Button>
      </Flex>
    </Modal>
  );
}
