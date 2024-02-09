import { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import express from 'express';
import serverless from 'serverless-http';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ApiHandler } from 'sst/node/api';

const doc = yaml.load(
  readFileSync(path.resolve(__dirname, 'out/api-docs.yaml'), 'utf-8')
) as Record<string, unknown>;

const app = express();

app.use('/', express.static('static'));

app.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(doc, {
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
    },
  })
);

let _handler: serverless.Handler | undefined;

export const handler = ApiHandler(async (event, context) => {
  if (!_handler) {
    _handler = serverless(app, {
      provider: 'aws',
      request: (request: {
        serverless: { event: APIGatewayProxyEventV2; context: Context };
      }) => {
        request.serverless = { event, context };
      },
    });
  }

  return await _handler(event, context);
});
