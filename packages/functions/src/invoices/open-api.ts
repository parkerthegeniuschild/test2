import { z } from '@openAPI/config';
import { paginated } from '@openAPI/schema';
import {
  Audience,
  Method,
  S3_SIGNED_LINK_EXPIRATION,
  SentInvoiceStatus,
} from '@utils/constants';
import {
  BaseQuerySchema,
  enumFromConst,
  IdScalar,
  MomentExample,
  MomentShape,
  PathIdScalar,
  PositiveIntScalar,
} from '@utils/schema';
import { TOpenAPIAction } from '@openAPI/types';

export const PreviewJobInvoiceRequestSchema = z
  .object({
    job_id: IdScalar,
  })
  .openapi({
    example: {
      job_id: 4555,
    },
  });

const PreviewJobInvoiceResponseSchema = z
  .object({
    job_id: IdScalar,
    invoice_base_64: z.string(),
  })
  .openapi({
    example: {
      invoice_base_64:
        'IT7MXwO97mnMBHOppLgDwfE9zAsBveppnA+jtaT4D4Jks2NcTXwSgpyd+o+c53I3i1G54/Lqe6XZovaFnugvA2p7pSQDX9Uwf5qmJ41Vop0zjisE5XA31ewEuA0jmthRtkfuXoC1y/0/wQrm+GCDpX4AXyryYjyT5vqtgzgTO6YmOgsfM6InmA2jtaS4C0NLTfIWnRoOnoGYZ2WTULFM4CTXLN03oie+GYeN74meA/rGD9I/piZ/01CjxaJTA5K5mFJJHN/WE7ofRRYOrkhhcjfjgDGJAOYF5SJJXJYyi8kNDQCEZF8iug78nuhWAryfaCMDbE80DkJNdAFuW85aeZjIXI+Huc1hEcfl+lWSC5/9zusfz3fSg59udZzzfQDl7kAhBj+cf0V4ckqyev0fPeP4aLfb0RYs8X0YFzyfxgOedLb8hlKA3YYTX7Hkzqvf8odngORk64zkM8vbi9Ps9h6KzPc+DgDwl9TJY0nn2REs9TzarPbubF3kebyZtRs99cM+9zVs92+C+26OLPJtC2fabJIfnRhCSVYBnedzlWRrvxfce8CyJl3kWJ+Cyx7MwBMQd8CwIbfV0hnp5IHfOll4KSyrPlUBLW3O+Z0ozqQseThH10FSU2Kmrs4ZtedaGLcsatqVZq7Uka8NmZM3VjKx9m5k1ZTP2NXoaE4DugGdks99TBU/a3eNJEWJ7PBXN8uNL4r2EaYU7CdPKPPnxiMfTLHim7OWmcZVcGVfKFXC5nI==',
      job_id: 4000,
    },
  });

export type TPreviewJobInvoiceResponseSchema = z.infer<
  typeof PreviewJobInvoiceResponseSchema
>;

export const PreviewJobInvoiceAction: TOpenAPIAction = {
  title: 'PreviewJobInvoiceSchema',
  method: Method.POST,
  path: '/invoices/preview',
  description: 'Preview an invoice for a job',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    body: {
      content: PreviewJobInvoiceRequestSchema,
    },
  },
  response: {
    content: PreviewJobInvoiceResponseSchema,
  },
};

export const CreateJobInvoiceRequestSchema = z
  .object({
    job_id: IdScalar,
    message: z.string(),
    recipients: z.array(z.string().email()),
    subject: z.string(),
  })
  .openapi({
    example: {
      job_id: 4555,
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing eli.',
      recipients: ['davidcurtis@email.com'],
      subject: 'Invoice for Job #4555',
    },
  });

export const CreateJobInvoiceResponsechema = z
  .object({
    filename: z.string(),
    invoice_url: z.string().url(),
    message_id: z.string(),
    response: z.string(),
  })
  .openapi({
    example: {
      filename: 'invoice-1704664741727.pdf',
      invoice_url:
        'https://dev-truckup-api-storage-invoicebucketc8304226-xgolba5lilc8.s3.us-east-2.amazonaws.com/invoice-1704664741727.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAS2JE%20240102%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20240102T104154Z&X-Amz-Expires=604800&X-Amz-Security-Token=IQoJb3JpZA8HLmg4CO1ML71K1LT5Ce5TSlCTawem4KTQbKtfzj%2FxSup012I7MFqsZ59XLTudqEJl3kCvWcQ2W%2FiOThgm03hFNpbjlbMAqaYr8wGOKEmi8TZA1cuZ7uQmjLQBwrUarAzqP3Du7H9kQtCzFvftDAAlZaA%2BMOE1p9%2F9X%2BRAXnYzkDYv%2FGhv3Y6PRoVvie3cHrAOgk32PcY%2F9c69gyEE%2FgwOG4gJAh81f%2Ba6f%2BehA6%2Fmim6BMGhlRCCjkQMAHuKHLX%2BXL2F6XvlR8xTJg8GFHxlhdBPMrrcxIUvhEnDzhn%2FEENasRLVc16kxfxsALwxyPMfYxmqEgE8ejjDp0M%2BsBjqeAcv6ELpnEEXHPU2X26E%2BuxtG1pwniwK1kI4AYbp%2B1%2BiKJNosv8AsIMBXCchPZU2eE3zWRzWFbDu3YqR%2FW691GzrkcMoBf5kdcHIrSoBBfFNA6lf%2BDFYkoEZpu1aswSsHtLSSS19IdYO%2FXeZLwihIH4RQhi76m9b5F7cKKzz&X-Amz-Signature=73e0ce69c4d1f6fe083e426ed2478ee9&X-Amz-SignedHeaders=host&x-id=GetObject',
      message_id:
        '<010f018cd414b50d-f1f62a95-95c8-4aae-8f6c-c62806f075c5-000000@us-east-2.amazonses.com>',
      response: '010f018cd414b50d-f1f62a95-95c8-4aae-8f6c-c62806f075c5-000000',
    },
  });

export type TCreateJobInvoiceResponsechema = z.infer<
  typeof CreateJobInvoiceResponsechema
>;

export const CreateJobInvoiceAction: TOpenAPIAction = {
  title: 'CreateJobInvoiceSchema',
  method: Method.POST,
  path: '/invoices',
  description:
    'Create an invoice for a job (which can be previewed or dispatched via email)',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    body: {
      content: CreateJobInvoiceRequestSchema,
    },
  },
  response: {
    content: CreateJobInvoiceResponsechema,
  },
};

const GetAllJobInvoicesResponsechema = paginated(
  z
    .object({
      ...MomentShape,
      email_from: z.string().email(),
      email_to: z.string(),
      subject: z.string(),
      body: z.string(),
      sent_by_user: IdScalar,
      sent_at: z.string().datetime().nullable(),
      status: enumFromConst(SentInvoiceStatus),
      filename: z.string(),
      job_id: IdScalar,
      invoice_url: z.string().url(),
      invoice_url_expires_in: PositiveIntScalar,
    })
    .openapi({
      example: {
        ...MomentExample,
        email_from: 'billing@truckup.tech',
        email_to: 'mitchell@truckup.com',
        subject: 'Invoice for Job #4555',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing eli.',
        sent_by_user: 1,
        sent_at: '2024-01-07T22:10:25.174Z',
        status: SentInvoiceStatus.SENT,
        filename: 'invoice-1704664741727.pdf',
        job_id: 4555,
        invoice_url: 'https://www.truckup.com',
        invoice_url_expires_in: S3_SIGNED_LINK_EXPIRATION * 1000,
      },
    })
);

export const ListSentInvoicesAction: TOpenAPIAction = {
  title: 'SentInvoicesSchema',
  method: Method.GET,
  path: '/invoices',
  description: 'List the sent invoices for all jobs',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    query: BaseQuerySchema,
  },
  response: {
    content: GetAllJobInvoicesResponsechema,
  },
};

export const ListSentInvoicesByJobIdPathParamsSchema = z.object({
  id: PathIdScalar,
});

export const ListSentInvoicesByJobIdAction: TOpenAPIAction = {
  title: 'SentInvoicesByJobIdSchema',
  method: Method.GET,
  path: '/jobs/{id}/invoices',
  description: 'List the sent invoices for a job',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    query: BaseQuerySchema,
    params: ListSentInvoicesByJobIdPathParamsSchema,
  },
  response: {
    content: GetAllJobInvoicesResponsechema,
  },
};
