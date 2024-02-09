import { useState } from 'react';
import { FocusTrapRegion } from '@ariakit/react';

import { Button, Label, TextInput } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

interface InvoiceMessageFormProps {
  loading?: boolean;
  initialMessage?: string | null;
  isOnEditMode?: boolean;
  onSubmit?: (message: string) => void;
  onDeleteRequest?: () => void;
  onCancel: () => void;
}

export function InvoiceMessageForm({
  loading,
  initialMessage,
  isOnEditMode,
  onSubmit,
  onDeleteRequest,
  onCancel,
}: InvoiceMessageFormProps) {
  const [message, setMessage] = useState(initialMessage ?? '');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onSubmit?.(message.trim());
  }

  return (
    <FocusTrapRegion
      render={
        <form
          className={css({ display: 'flex', flexDir: 'column', gap: 4 })}
          onSubmit={handleSubmit}
        />
      }
      enabled
    >
      <Label color="gray.600">
        Invoice message
        <TextInput
          placeholder="Enter message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
      </Label>

      <Flex gap={3} justify={isOnEditMode ? 'flex-start' : 'flex-end'}>
        <Button
          variant="secondary"
          size="sm"
          disabled={loading}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={loading} loading={loading}>
          {isOnEditMode ? 'Save changes' : 'Add message'}
        </Button>

        {isOnEditMode && (
          <Button
            size="sm"
            variant="secondary"
            danger
            ml="auto"
            disabled={loading}
            onClick={onDeleteRequest}
          >
            Delete
          </Button>
        )}
      </Flex>
    </FocusTrapRegion>
  );
}
