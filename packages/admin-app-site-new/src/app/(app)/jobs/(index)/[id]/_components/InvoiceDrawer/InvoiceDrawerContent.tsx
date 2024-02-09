import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import {
  type EmailedInvoiceEntryParsed,
  useGetEmailedInvoices,
  usePostInvoiceEmail,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import { usePageAtom } from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import {
  Button,
  ErrorMessage,
  Label,
  StackedInput,
  TextInput,
  toast,
} from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

import { InvoiceDrawerTable } from './InvoiceDrawerTable';

const formSchema = z.object({
  emailTo: z.string().email(),
  subject: z.string().refine(v => v.trim().length > 0),
  body: z.string().refine(v => v.trim().length > 0),
});

type FormData = z.infer<typeof formSchema>;

interface InvoiceDrawerContentProps {
  onViewEmailRequest: (emailViewData: EmailedInvoiceEntryParsed) => void;
  onCancel: () => void;
}

export function InvoiceDrawerContent({
  onViewEmailRequest,
  onCancel,
}: InvoiceDrawerContentProps) {
  const jobId = useJobId();

  const pageAtom = usePageAtom();

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailTo: '',
      subject: `Invoice for job #${jobId} — Truckup`,
      body: `Invoice for job #${jobId}.\n\nThank you for choosing Truckup.`,
    },
  });

  const postInvoiceEmail = usePostInvoiceEmail({
    onSuccess() {
      void queryClient.invalidateQueries([useGetEmailedInvoices.queryKey]);
      reset();

      toast.success('Invoice sent successfully');
    },
    onError(error) {
      toast.error(
        `Error while sending invoice${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });

  useEffect(() => {
    if (!pageAtom.data.isInvoiceDrawerOpen) {
      reset();
    }
  }, [pageAtom.data.isInvoiceDrawerOpen, reset]);

  function handleFormSubmit(payload: FormData) {
    postInvoiceEmail.mutate({
      jobId,
      recipient: payload.emailTo,
      subject: payload.subject,
      message: payload.body,
    });
  }

  return (
    <Flex direction="column" flex={1} overflow="hidden">
      <Flex direction="column" p={5} gap={7} overflow="auto">
        <form
          id="send-invoice-form"
          className={css({ display: 'flex', flexDir: 'column', gap: 5 })}
          noValidate
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <Label required text="To" color="gray.600">
            <TextInput
              placeholder="example@email.com"
              type="email"
              autoComplete="off"
              data-1p-ignore
              list="sent-emails-list"
              error={!!errors.emailTo}
              {...register('emailTo')}
            />
            <datalist id="sent-emails-list">
              {(
                queryClient.getQueryData([useGetEmailedInvoices.queryKey], {
                  exact: false,
                }) as { emails: string[] } | undefined
              )?.emails.map(email => (
                <option key={email}>{email}</option>
              ))}
            </datalist>

            {!!errors.emailTo && (
              <ErrorMessage>Please enter a valid email address</ErrorMessage>
            )}
          </Label>

          <Flex direction="column" gap={2}>
            <Label
              htmlFor="invoice-subject"
              required
              color="gray.600"
              maxW="max"
            >
              Email message
            </Label>

            <StackedInput>
              <StackedInput.TextInput
                id="invoice-subject"
                placeholder="Subject"
                autoComplete="off"
                error={!!errors.subject}
                {...register('subject')}
              />
              <StackedInput.Textarea
                rows={4}
                placeholder="Body"
                autoComplete="off"
                error={!!errors.body}
                {...register('body')}
              />
            </StackedInput>

            {Boolean(errors.subject || errors.body) && (
              <ErrorMessage>Please enter email message info</ErrorMessage>
            )}
          </Flex>
        </form>

        <InvoiceDrawerTable onViewEmailRequest={onViewEmailRequest} />
      </Flex>

      <Flex
        px={5}
        py={4}
        gap={3}
        align="center"
        justify="flex-end"
        borderTopWidth="1px"
        borderColor="gray.100"
        mt="auto"
      >
        <Button
          variant="secondary"
          size="sm"
          disabled={postInvoiceEmail.isLoading}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          form="send-invoice-form"
          type="submit"
          disabled={postInvoiceEmail.isLoading}
          loading={postInvoiceEmail.isLoading}
        >
          Send invoice
        </Button>
      </Flex>
    </Flex>
  );
}
