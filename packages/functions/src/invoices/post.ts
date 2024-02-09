/* eslint-disable @typescript-eslint/naming-convention */

import TupApiHandler from 'handlers/TupApiHandler';
import {
  TruckupBadRequestError,
  TruckupForbiddenError,
  TruckupInternalServerErrorError,
} from 'src/errors';
import { useAuth, userIsAgent } from 'clients/auth';
import { storage } from 'clients/storage';
import { Bucket } from 'sst/node/bucket';
import { useBody } from 'sst/node/api';
import { Config } from 'sst/node/config';
import { S3_SIGNED_LINK_EXPIRATION, SentInvoiceStatus } from '@utils/constants';
import { sendEmailViaSES } from 'clients/mailer';
import { SentInvoice } from '@core/sentInvoice';
import { JobInvoice } from '@core/jobInvoice';
import {
  buildUpdatedPropertiesV2,
  getInvoiceFilePath,
  invoiceDataGenerator,
} from '@utils/helpers';
import { generatePDF } from 'clients/puppeteer';
import { useTemplates } from 'clients/templates';
import {
  CreateJobInvoiceRequestSchema,
  type TCreateJobInvoiceResponsechema,
} from './open-api';

const emailFrom = Config.BILLING_EMAIL;
const from = `${Config.BILLING_NAME} <${emailFrom}>`;

export const handler = TupApiHandler(
  async ({ event }) => {
    if (!userIsAgent()) throw new TruckupForbiddenError();

    const _body = useBody();
    if (!_body) throw new TruckupBadRequestError('Missing body');

    const {
      job_id: jobId,
      message,
      recipients,
      subject,
    } = CreateJobInvoiceRequestSchema.parse(JSON.parse(_body));

    const { userId, username } = useAuth();

    const { filename, publicFilename } = getInvoiceFilePath({
      jobId,
      prefix: 'invoice',
    });

    const jobInvoice = await JobInvoice.getOrCreate({
      createdBy: username,
      jobId,
    });

    if (!jobInvoice)
      throw new TruckupInternalServerErrorError('Failed to create job invoice');

    const data = await JobInvoice.getAllJobCharges(jobId);

    const templates = await useTemplates();
    const { content, layout } = invoiceDataGenerator({
      data: {
        ...data,
        invoiceId: jobInvoice.id,
      },
      templates,
    });

    const generated = await SentInvoice.create({
      createdBy: username,
      jobInvoiceId: jobInvoice.id,
      emailFrom,
      emailTo: recipients.join(', '),
      subject,
      body: message,
      sentByUser: userId,
      filename,
    });

    if (!generated?.id) throw new TruckupInternalServerErrorError();

    const pdfBuffer = await generatePDF({
      content,
      layout,
    });

    const invoiceUrl = await storage.createSignedUpload({
      bucket: Bucket.JobDocumentsBucket.bucketName,
      key: `${jobId}/${filename}`,
      body: pdfBuffer,
      contentType: 'application/pdf',
      expiresIn: S3_SIGNED_LINK_EXPIRATION,
    });

    const updateEvent = buildUpdatedPropertiesV2(event);

    const sending = await SentInvoice.update(
      {
        sentInvoiceId: generated!.id,
        status: SentInvoiceStatus.SENDING,
      },
      updateEvent
    );

    if (!sending?.id) throw new TruckupInternalServerErrorError();

    const { messageId, response } = await sendEmailViaSES({
      from,
      to: recipients,
      subject,
      message: {
        text: message,
      },
      attachments: [
        {
          content: pdfBuffer,
          filename: publicFilename,
        },
      ],
    });

    if (!messageId) throw new TruckupInternalServerErrorError();

    const sent = await SentInvoice.update(
      {
        sentInvoiceId: generated.id,
        status: SentInvoiceStatus.SENT,
        updateSentAt: true,
      },
      updateEvent
    );

    if (!sent?.id) throw new TruckupInternalServerErrorError();

    return {
      filename,
      invoice_url: invoiceUrl,
      message_id: messageId,
      response,
    } satisfies TCreateJobInvoiceResponsechema;
  },
  { method: 'POST' }
);
