import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type PostInvoiceEmailPayload = {
  jobId: string;
  recipient: string;
  subject: string;
  message: string;
};

async function postInvoiceEmail({
  jobId,
  recipient,
  subject,
  message,
}: PostInvoiceEmailPayload) {
  const response = await api.post('invoices', {
    job_id: Number(jobId),
    recipients: [recipient],
    subject: subject.trim(),
    message: message.trim(),
  });

  return response.data;
}

type UsePostInvoiceEmailParams = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function usePostInvoiceEmail({
  onSuccess,
  onError,
}: UsePostInvoiceEmailParams = {}) {
  return useMutation({
    mutationFn: postInvoiceEmail,
    onSuccess,
    onError,
  });
}
