import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { z } from 'zod';

export * as response from './response';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

const encodeBody = (body: unknown) => {
  switch (typeof body) {
    case 'string':
    case 'undefined':
      return body;
    default:
      return JSON.stringify(body);
  }
};

const buildResponse = (
  statusCode: number,
  body: unknown,
  { headers = {}, ...response }: Partial<APIGatewayProxyStructuredResultV2> = {}
): APIGatewayProxyStructuredResultV2 => ({
  statusCode,
  body: encodeBody(body),
  headers: {
    ...CORS,
    'Content-Type': 'application/json',
    ...headers,
  },
  ...response,
});

export const responseSchema = z.object({
  statusCode: z.number().int().optional(),
  headers: z.record(z.union([z.boolean(), z.number(), z.string()])).optional(),
  body: z.string().optional(),
  isBase64Encoded: z.boolean().optional(),
  cookies: z.array(z.string()).optional(),
});

export type Responder = (
  body?: unknown,
  response?: Partial<APIGatewayProxyStructuredResultV2>
) => APIGatewayProxyStructuredResultV2;

const makeResponder =
  (statusCode: number): Responder =>
  (body, response = {}) => {
    const parsed = responseSchema.parse(response);
    return buildResponse(statusCode, body, {
      ...parsed,
      statusCode: parsed.statusCode ?? statusCode,
    });
  };

export const success = makeResponder(200);
export const created = makeResponder(201);

export const error = makeResponder(400);
export const unauthorized = makeResponder(401);
export const forbidden = makeResponder(403);
export const notFound = makeResponder(404);
export const rateLimit = makeResponder(429);

export const failure = makeResponder(500);
