import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupForbiddenError } from 'src/errors';
import { snakeCaseKeys, transformEvent } from '@utils/helpers';
import { sentInvoices } from 'db/schema/sentInvoices';
import { userIsAgent } from 'clients/auth';
import { SentInvoice } from '@core/sentInvoice';
import { ListSentInvoicesByJobIdPathParamsSchema } from './open-api';

export const handler = TupApiHandler(
  async ({ event }) => {
    if (!userIsAgent()) throw new TruckupForbiddenError();

    const { id: jobId } = ListSentInvoicesByJobIdPathParamsSchema.parse(
      event.pathParameters
    );

    const { paginate, ...transformedEvent } = transformEvent(
      event,
      sentInvoices
    );

    const invoices = await SentInvoice.list({
      transformedEvent,
      jobId,
    });

    const transformed = await Promise.all(
      invoices.map(SentInvoice.linkAdder())
    );

    return paginate(transformed.map(snakeCaseKeys), transformed.length);
  },
  { method: 'GET' }
);
