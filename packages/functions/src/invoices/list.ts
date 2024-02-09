/* eslint-disable @typescript-eslint/naming-convention */

import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupForbiddenError } from 'src/errors';
import { userIsAgent } from 'clients/auth';
import { SentInvoice } from '@core/sentInvoice';
import { snakeCaseKeys, transformEvent } from '@utils/helpers';
import { sentInvoices } from 'db/schema/sentInvoices';

export const handler = TupApiHandler(
  async ({ event }) => {
    if (!userIsAgent()) throw new TruckupForbiddenError();

    const { paginate, ...transformedEvent } = transformEvent(
      event,
      sentInvoices
    );

    const invoices = await SentInvoice.list({ transformedEvent });
    const transformed = await Promise.all(
      invoices.map(SentInvoice.linkAdder())
    );

    return paginate(transformed.map(snakeCaseKeys), transformed.length);
  },
  { method: 'GET' }
);
