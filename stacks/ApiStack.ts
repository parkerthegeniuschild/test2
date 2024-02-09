import {
  Api,
  Config,
  Function,
  FunctionDefinition,
  StackContext,
  use,
} from 'sst/constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

import { DatabaseStack } from './DatabaseStack';
import { ConfigStack } from './ConfigStack';
import { checkIsSandbox } from './stageUtils';
import { DnsStack } from './DnsStack';
import { StorageStack } from './StorageStack';

export function ApiStack({ stack }: StackContext) {
  const isSandbox = checkIsSandbox(stack.stage);
  const {
    config: {
      AUTH_PUBLIC_KEY,
      TWILIO_ACCOUNT_SID,
      TWILIO_KEY_SID,
      TWILIO_SENDER,
      BILLING_EMAIL,
      BILLING_NAME,
    },
    secret: {
      AUTH_PRIVATE_KEY,
      CONTENTFUL_DELIVERY_KEY,
      SLACK_WEBHOOK,
      STRIPE_SK,
      TWILIO_KEY_SECRET,
    },
  } = use(ConfigStack);
  const rds = use(DatabaseStack);
  const dns = use(DnsStack);
  const { jobDocumentsBucket, uploadsBucket } = use(StorageStack);

  const authV0 = new Function(stack, 'AuthorizerV0', {
    handler: 'packages/functions/src/auth/authorizer.handlerV0',
    environment: {
      JWT_SECRET: process.env.JwtSecret || 'NOT SET',
    },
  });

  const JwtSecret = new Config.Secret(stack, 'JwtSecret');

  authV0.bind([JwtSecret]);

  const authV1 = new Function(stack, 'AuthorizerV1', {
    handler: 'packages/functions/src/auth/authorizer.handlerV1',
    environment: {
      JWT_SECRET: process.env.JwtSecret || 'NOT SET',
    },
    bind: [AUTH_PUBLIC_KEY],
  });

  const geoTzLayer = new lambda.LayerVersion(stack, 'geoTzLayer', {
    code: lambda.Code.fromAsset('layers/geo-tz'),
  });

  const puppeteerHandlerOptions = {
    memorySize: 4096,
    enableLiveDev: true,
    copyFiles: [
      {
        from: 'node_modules/@sparticuz/chromium/bin',
        to: 'packages/functions/src/bin',
      },
      {
        from: 'packages/functions/invoice-templates',
        to: 'packages/functions/src/invoice-templates',
      },
    ],
  } satisfies FunctionDefinition;

  const api = new Api(stack, 'api', {
    authorizers: {
      authV0: {
        type: 'lambda',
        responseTypes: ['simple'],
        function: authV0,
      },
      authV1: {
        type: 'lambda',
        responseTypes: ['simple'],
        function: authV1,
      },
    },
    cors: true,
    customDomain: dns.api.customDomain,
    defaults: {
      authorizer: 'authV1',
      function: {
        bind: [rds, uploadsBucket],
      },
    },
    routes: {
      'GET /auth/sms': {
        function: {
          handler: 'packages/functions/src/auth/smsRequest.handler',
          bind: [
            TWILIO_ACCOUNT_SID,
            TWILIO_SENDER,
            TWILIO_KEY_SID,
            TWILIO_KEY_SECRET,
          ],
        },
        authorizer: 'none',
      },
      'POST /auth/sms': {
        function: {
          handler: 'packages/functions/src/auth/smsVerify.handler',
          bind: [AUTH_PRIVATE_KEY],
        },
        authorizer: 'none',
      },
      'POST /auth/password': {
        function: {
          handler: 'packages/functions/src/auth/passwordVerify.handler',
          bind: [AUTH_PRIVATE_KEY],
        },
        authorizer: 'none',
      },
      'GET /legalDocuments': {
        function: {
          handler: 'packages/functions/src/legalDocuments/list.handler',
          bind: [CONTENTFUL_DELIVERY_KEY],
        },
      },
      'GET /companies': 'packages/functions/src/companies/list.handler',
      'POST /companies': 'packages/functions/src/companies/post.handler',
      'GET /default-markup': 'packages/functions/src/defaultMarkup/get.handler',
      'GET /dispatchers': 'packages/functions/src/dispatchers/list.handler',
      'POST /dispatchers': 'packages/functions/src/dispatchers/post.handler',
      'PATCH /dispatchers/{id}':
        'packages/functions/src/dispatchers/id/patch.handler',
      'GET /drivers': 'packages/functions/src/drivers/list.handler',
      'POST /drivers': 'packages/functions/src/drivers/post.handler',
      'GET /invoices': {
        function: {
          handler: 'packages/functions/src/invoices/list.handler',
          bind: [jobDocumentsBucket],
        },
      },
      'POST /invoices': {
        function: {
          handler: 'packages/functions/src/invoices/post.handler',
          bind: [jobDocumentsBucket, BILLING_EMAIL, BILLING_NAME],
          permissions: ['ses:*'],
          ...puppeteerHandlerOptions,
        },
      },
      'POST /invoices/preview': {
        function: {
          handler: 'packages/functions/src/invoices/preview.handler',
          ...puppeteerHandlerOptions,
        },
      },
      'GET /jobs/{id}/invoices': {
        function: {
          handler: 'packages/functions/src/invoices/listByJobId.handler',
          bind: [jobDocumentsBucket],
        },
      },
      'GET /providerLocations':
        'packages/functions/src/providerLocations/list.handler',
      'GET /providers': 'packages/functions/src/providers/list.handler',
      'GET /providers/{id}': 'packages/functions/src/providers/id/get.handler',
      'POST /providers': 'packages/functions/src/providers/post.handler',
      'PATCH /providers/{id}':
        'packages/functions/src/providers/id/patch.handler',
      'DELETE /providers/{id}':
        'packages/functions/src/providers/id/delete.handler',
      'GET /providers/{id}/recent-locations':
        'packages/functions/src/providers/id/recentLocations/list.handler',
      'POST /providers/{id}/location':
        'packages/functions/src/providers/id/locations/post.handler',
      'GET /providers/{id}/locations':
        'packages/functions/src/providers/id/locations/list.handler',
      'GET /providers/{id}/legalAgreements':
        'packages/functions/src/providers/id/legalAgreements/list.handler',
      'PUT /providers/{id}/legalAgreements/{documentId}': {
        function: {
          handler:
            'packages/functions/src/providers/id/legalAgreements/documentId/put.handler',
          bind: [CONTENTFUL_DELIVERY_KEY],
        },
      },
      'GET /providers/{id}/pendingLegalDocuments': {
        function: {
          handler:
            'packages/functions/src/providers/id/pendingLegalDocuments/list.handler',
          bind: [CONTENTFUL_DELIVERY_KEY],
        },
      },
      'GET /providers/{id}/jobRequests':
        'packages/functions/src/providers/id/jobRequests/list.handler',
      'PATCH /providers/{id}/jobRequests/{requestId}':
        'packages/functions/src/providers/id/jobRequests/requestId/patch.handler',
      'GET /services': 'packages/functions/src/services/list.handler',
      'GET /serviceAreas': 'packages/functions/src/service_areas/list.handler',
      'POST /signup/providers': {
        function: {
          handler: 'packages/functions/src/signup/providers.handler',
          bind: [SLACK_WEBHOOK],
        },
        authorizer: 'none',
      },
      'GET /transactions': 'packages/functions/src/transactions/list.handler',
      'PATCH /users/{userId}': 'packages/functions/src/users/patch.handler',
      'POST /users/{userId}/stripe/cashout': {
        function: {
          handler: 'packages/functions/src/stripe/cashout.handler',
          bind: [STRIPE_SK],
        },
      },
      'GET /users/{userId}/stripe/accounts': {
        function: {
          handler: 'packages/functions/src/stripe/accounts.handler',
          bind: [STRIPE_SK],
        },
      },
      'POST /users/{userId}/stripe/onboarding': {
        function: {
          handler: 'packages/functions/src/stripe/onboarding.handler',
          bind: [STRIPE_SK],
        },
      },
      'POST /users/{userId}/stripe/dashboard': {
        function: {
          handler: 'packages/functions/src/stripe/dashboard.handler',
          bind: [STRIPE_SK],
        },
      },
      'POST /vehicleDrivers':
        'packages/functions/src/vehicleDrivers/post.handler',
      'GET /vehicles': 'packages/functions/src/vehicles/list.handler',
      'POST /vehicles': 'packages/functions/src/vehicles/post.handler',
      'GET /vehicles/manufacturers':
        'packages/functions/src/vehicles/manufacturers/list.handler',
      'GET /vehicles/colors':
        'packages/functions/src/vehicles/colors/list.handler',
      'GET /vehicles/types':
        'packages/functions/src/vehicles/types/list.handler',
      'GET /tz': {
        function: {
          handler: 'packages/functions/src/tz/get.handler',
          layers: [geoTzLayer],
          nodejs: {
            esbuild: {
              external: ['geo-tz'],
            },
          },
        },
      },
    },
  });

  const webhooks = new Api(stack, 'webhooks', {
    cors: true,
    defaults: {
      function: {
        bind: [rds],
      },
    },
    routes: {
      'POST /webhooks/contentful':
        'packages/functions/src/webhooks/contentfulWebhook.handler',
    },
  });

  const apiUrl = api.customDomainUrl || api.url;

  stack.addOutputs({
    ApiEndpoint: apiUrl,
    WebhooksEndpoint: webhooks.url,
    RDS_ARN: rds.clusterArn,
    RDS_SECRET: rds.secretArn,
    RDS_DATABASE: rds.defaultDatabaseName,
  });

  return { api, apiUrl, webhooks };
}
