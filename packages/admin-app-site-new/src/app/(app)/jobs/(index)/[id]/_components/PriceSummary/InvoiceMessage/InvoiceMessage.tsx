import { useState } from 'react';
import { match } from 'ts-pattern';

import { S } from '@/app/(app)/jobs/(index)/_components';
import { useGetJob, usePatchJob } from '@/app/(app)/jobs/(index)/[id]/_api';
import { usePageAtom } from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { ButtonGroup, Icon, IconButton, TextButton, toast } from '@/components';
import { css } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { ConfirmInvoiceMessageRemovalModal } from './ConfirmInvoiceMessageRemovalModal';
import { InvoiceMessageForm } from './InvoiceMessageForm';

const TextContainer = styled(S.Common.ActionButtonsContainer, {
  base: {
    position: 'relative',
    fontSize: 'sm',
    lineHeight: 'md',
    fontWeight: 'medium',
    color: 'gray.700',
    maxW: 'max',
  },
});

export function InvoiceMessage() {
  const pageAtom = usePageAtom();

  const jobId = useJobId();

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  const getJob = useGetJob(jobId);
  const patchJob = usePatchJob(jobId, {
    onSuccess(data) {
      getJob.updateData({ invoice_message: data.invoice_message });

      toast.success(
        `Invoice message successfully ${match(
          isConfirmDeleteModalOpen
            ? 'delete_invoice_message'
            : pageAtom.data.priceSummaryFocusedSection
        )
          .with('delete_invoice_message', () => 'deleted')
          .with('add_invoice_message', () => 'added')
          .with('edit_invoice_message', () => 'edited')
          .otherwise(() => '')}`
      );

      pageAtom.setPriceSummaryFocusedSection(null);
      setIsConfirmDeleteModalOpen(false);
    },
  });

  return (
    <>
      {match({
        hasFocus:
          !!pageAtom.data.priceSummaryFocusedSection?.includes(
            'invoice_message'
          ),
        hasMessage: !!getJob.data?.invoice_message?.trim(),
      })
        .with({ hasFocus: true }, () => (
          <InvoiceMessageForm
            loading={patchJob.isLoading && !isConfirmDeleteModalOpen}
            isOnEditMode={
              pageAtom.data.priceSummaryFocusedSection ===
              'edit_invoice_message'
            }
            initialMessage={
              pageAtom.data.priceSummaryFocusedSection ===
              'edit_invoice_message'
                ? getJob.data?.invoice_message
                : null
            }
            onSubmit={message =>
              patchJob.mutate({
                invoice_message: message.trim() ? message.trim() : null,
              })
            }
            onDeleteRequest={() => setIsConfirmDeleteModalOpen(true)}
            onCancel={() => pageAtom.setPriceSummaryFocusedSection(null)}
          />
        ))
        .with({ hasMessage: true }, () => (
          <TextContainer>
            ***{getJob.data?.invoice_message}***
            <ButtonGroup
              className="actions-container"
              pos="absolute"
              top={-1}
              right={-1.5}
              transform="translateX(calc(100% + -2px))"
            >
              <IconButton
                title="Edit invoice message"
                onClick={() =>
                  pageAtom.setPriceSummaryFocusedSection('edit_invoice_message')
                }
              >
                <Icon.Edit />
              </IconButton>
              <IconButton
                title="Delete invoice message"
                onClick={() => setIsConfirmDeleteModalOpen(true)}
              >
                <Icon.Trash className={css({ color: 'danger' })} />
              </IconButton>
            </ButtonGroup>
          </TextContainer>
        ))
        .otherwise(() => (
          <TextButton
            leftSlot={<Icon.Plus />}
            maxW="max"
            onClick={() =>
              pageAtom.setPriceSummaryFocusedSection('add_invoice_message')
            }
          >
            Add invoice message
          </TextButton>
        ))}

      <ConfirmInvoiceMessageRemovalModal
        open={isConfirmDeleteModalOpen}
        loading={patchJob.isLoading}
        onDeleteRequest={() => patchJob.mutate({ invoice_message: null })}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
      />
    </>
  );
}
