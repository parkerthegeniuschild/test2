import { Button, Icon, Modal, TextButton } from '@/components';
import { Center, styled } from '@/styled-system/jsx';

const IconContainer = styled(Center, {
  base: {
    fontSize: 'md',
    color: 'warning',
    mx: 'auto',
    mb: 2,
    w: 8,
    h: 8,
    rounded: 'full',
    borderWidth: '1px',
    borderColor: 'gray.200',
    shadow: 'sm',
    position: 'relative',

    _after: {
      content: '""',
      position: 'absolute',
      height: 'calc(100% + 2px)',
      width: 'calc(100% + 2px)',
      pointerEvents: 'none',
      shadow: 'inset',
      left: '-1px',
      bottom: '-1px',
      rounded: 'full',
    },
  },
});

export type Message = { title: string; description: string };

interface JobStatusChangeWarningModalProps extends Message {
  open: boolean;
  onClose: () => void;
  onUnmount?: () => void;
}

export function JobStatusChangeWarningModal({
  open,
  title,
  description,
  onClose,
  onUnmount,
}: JobStatusChangeWarningModalProps) {
  return (
    <Modal open={open} onClose={onClose} onUnmount={onUnmount} unmountOnHide>
      <IconContainer>
        <Icon.AlertTriangle />
      </IconContainer>

      <Modal.Heading textAlign="center">{title}</Modal.Heading>
      <Modal.Description>{description}</Modal.Description>

      <Modal.Dismiss
        render={
          <Button size="sm" mt={2}>
            OK
          </Button>
        }
      />

      <Modal.Dismiss
        render={
          <TextButton
            colorScheme="lightGray"
            fontSize="md"
            pos="absolute"
            top={4}
            right={4}
          >
            <Icon.XClose />
          </TextButton>
        }
      />
    </Modal>
  );
}
