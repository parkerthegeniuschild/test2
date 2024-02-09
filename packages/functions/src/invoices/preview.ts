/* eslint-disable @typescript-eslint/naming-convention */

import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupBadRequestError, TruckupForbiddenError } from 'src/errors';
import { userIsAgent } from 'clients/auth';
import { useBody } from 'sst/node/api';
import { generatePDF } from 'clients/puppeteer';
import { invoiceDataGenerator } from '@utils/helpers';
import { useTemplates } from 'clients/templates';
import { JobInvoice } from '@core/jobInvoice';
import {
  PreviewJobInvoiceRequestSchema,
  TPreviewJobInvoiceResponseSchema,
} from './open-api';

export const handler = TupApiHandler(
  async () => {
    if (!userIsAgent()) throw new TruckupForbiddenError();

    const _body = useBody();
    if (!_body) throw new TruckupBadRequestError('Missing body');

    const { job_id: jobId } = PreviewJobInvoiceRequestSchema.parse(
      JSON.parse(_body)
    );

    const templates = await useTemplates();

    const data = await JobInvoice.getAllJobCharges(jobId);

    const { content, layout } = invoiceDataGenerator({
      data,
      templates,
    });

    const pdfBuffer = await generatePDF({
      content,
      layout,
    });

    return {
      job_id: jobId,
      invoice_base_64: pdfBuffer.toString('base64'),
    } satisfies TPreviewJobInvoiceResponseSchema;
  },
  { method: 'POST' }
);
