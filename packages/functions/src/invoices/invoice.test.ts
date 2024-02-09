import 'vitest';
import {
  fetchV1Token,
  removeAuth,
  testRequester,
  validateSchema,
  validationStatusCode,
} from '@tests/helpers';
import { ROLE } from '@utils/constants';
import {
  calculatePartTotalPriceWithMarkup,
  calculatePartUnitPriceWithMarkup,
} from '@core/jobVehicleContactServiceParts';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  CreateJobInvoiceRequestSchema,
  PreviewJobInvoiceRequestSchema,
} from './open-api';

const transformRequestAgent: AxiosRequestConfig['transformRequest'] = () => {};

describe('POST /invoices/preview', () => {
  let agentRequest: AxiosInstance;

  beforeAll(async () => {
    agentRequest = testRequester({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { Authorization: `Bearer ${await fetchV1Token(ROLE.AGENT)}` },
    });
  });

  it("should return 401 code when doesn't have auth token", async () => {
    const { status } = await agentRequest.get(`/invoices/preview`, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  it('should calculate unit price (100) with markup (100) correctly', () => {
    const markup = 100;
    const price_cents = 100;
    const result = 200;

    expect(calculatePartUnitPriceWithMarkup({ markup, price_cents })).toBe(
      result
    );
  });

  it('should calculate unit price (100) with markup (0) correctly', () => {
    const markup = 0;
    const price_cents = 100;
    const result = 100;

    expect(calculatePartUnitPriceWithMarkup({ markup, price_cents })).toBe(
      result
    );
  });

  it('should calculate part total price (100) with markup (100) and quantity (2) correctly', () => {
    const markup = 50;
    const price_cents = 100;
    const quantity = 2;
    const result = 300;

    expect(
      calculatePartTotalPriceWithMarkup({ markup, price_cents, quantity })
    ).toBe(result);
  });

  it('should return jobId and base64 pdf when invoice is previewed', async () => {
    const { status, data } = await agentRequest.post(
      `/invoices/preview`,
      { job_id: 4588 },
      { transformRequest: transformRequestAgent }
    );

    validateSchema(data, PreviewJobInvoiceRequestSchema, true);
    validationStatusCode(status, 201);

    expect(data.job_id).toBe(4588);
    expect(data.invoice_base_64).toBeDefined();
  });

  it('should return filename, invoice_url, message_id and response when invoice is dispatched', async () => {
    const { status, data } = await agentRequest.post(
      `/invoices`,
      {
        job_id: 4588,
        subject: 'Invoice for Job #4588',
        recipients: ['mitchell@truckup.com'],
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing eli.',
      },
      { transformRequest: transformRequestAgent }
    );

    validateSchema(data, CreateJobInvoiceRequestSchema, true);
    validationStatusCode(status, 201);

    expect(data.job_id).toBe(4588);
    expect(data.filename).toContain('invoice-');
    expect(data.invoice_url).toBeDefined();
    expect(data.message_id).toBeDefined();
    expect(data.response).toBeDefined();
  });
});
