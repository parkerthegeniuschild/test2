import { z } from 'zod';
import {
  OpenAPIRegistry,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import { OpenAPIObjectConfig } from '@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator';
import { ApiDocsTag } from '@utils/constants';

extendZodWithOpenApi(z);

export { z };

export const config = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'TruckUp API',
    description: 'This is the API',
  },
  tags: Object.values(ApiDocsTag),
  servers: [{ url: 'https://dev.api.truckup.tech' }],
} satisfies OpenAPIObjectConfig;

export const registry = new OpenAPIRegistry();

export const bearerAuth = registry.registerComponent(
  'securitySchemes',
  'bearerAuth',
  {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  }
);
