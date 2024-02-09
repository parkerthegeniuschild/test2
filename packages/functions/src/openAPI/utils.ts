/* eslint @typescript-eslint/naming-convention: 0 */

import yaml from 'yaml';
import path from 'path';
import { fileURLToPath } from 'url';
import type { OpenAPIObject } from 'openapi3-ts/oas30';
import type {
  TBearerAuth,
  TErrorMessage,
  TIOBase,
  TMethod,
  TRequestSchema,
  TStatusCode,
} from '@openAPI/types';
import { ResponseConfig, RouteConfig } from '@asteasolutions/zod-to-openapi';
import { ErrorMessage, MethodCode, SuccessMessage } from '@utils/constants';

export const dirName = path.dirname(fileURLToPath(import.meta.url));

export const createYaml = (documentation: OpenAPIObject) =>
  yaml.stringify(documentation, { indent: 2 });

export const buildError = (message: TErrorMessage) =>
  ({
    description: message,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: message,
            },
          },
        },
      },
    },
  } satisfies ResponseConfig);

export const applyBearerAuth = (bearerAuth: TBearerAuth) => ({
  security: [
    {
      [bearerAuth.name]: [],
    },
  ],
});

export const applyRequest = ({
  body,
  params,
  query,
}: TRequestSchema): Pick<RouteConfig, 'request'> => {
  const getBody = ({ content, description = '' }: TIOBase) => ({
    body: content && {
      content: {
        'application/json': { schema: content },
      },
      description,
    },
  });

  return {
    request: {
      ...(body && getBody(body)),
      ...(params && { params }),
      ...(query && { query }),
    },
  };
};

export const applyResponses = (
  method: TMethod,
  response: TIOBase,
  statusCode?: TStatusCode
): { [statusCode: string]: ResponseConfig } => {
  const { content, description } = response;
  const code =
    statusCode ?? MethodCode[method.toLowerCase() as keyof typeof MethodCode];
  return {
    [code]: {
      description: description ?? SuccessMessage[code],
      content: content && {
        'application/json': {
          schema: content,
        },
      },
    },
    '400': buildError(ErrorMessage.BAD_REQUEST),
    '401': buildError(ErrorMessage.UNAUTHORIZED),
    '403': buildError(ErrorMessage.FORBIDDEN),
    '500': buildError(ErrorMessage.INTERNAL_SERVER_ERROR),
  };
};
