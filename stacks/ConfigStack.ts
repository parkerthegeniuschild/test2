import { Config, Stack, StackContext } from 'sst/constructs';
import { AUTH, STAGE, ZONE } from '../packages/utils/constants';
import { checkIsSandbox } from './stageUtils';

/**
 * As of SSTv2, empty strings are no longer valid values at build time. They do, however, satisfy Typescript
 * We can use them to set a default value that will throw an error for a missing mandatory env var
 */

export function ConfigStack({ stack, app }: StackContext) {
  // ifSandbox allows us to set a default that will not be used in production or staging, making the env var required in those stages
  const ifSandbox = (value: string): string =>
    checkIsSandbox(app.stage) ? value : '';

  /**
   * PARAMETERS
   */
  const AUTH_PUBLIC_KEY = new Config.Parameter(stack, 'AUTH_PUBLIC_KEY', {
    value: process.env.JWT_PUBLIC_KEY || ifSandbox(AUTH.JWT_PUBLIC_KEY),
  });

  const BILLING_EMAIL = new Config.Parameter(stack, 'BILLING_EMAIL', {
    value: process.env.BILLING_EMAIL || ifSandbox('billing@truckup.tech'),
  });

  const BILLING_NAME = new Config.Parameter(stack, 'BILLING_NAME', {
    value: process.env.BILLING_NAME || 'TRUCKUP Billing',
  });

  const DB_RESET_CLIENT = new Config.Parameter(stack, 'DB_RESET_CLIENT', {
    value: process.env.DB_RESET_CLIENT || STAGE.DEV,
  });
  const DNS_ZONE = new Config.Parameter(stack, 'DNS_ZONE', {
    value: process.env.DNS_ZONE || fetchZone(stack),
  });
  const REGION = new Config.Parameter(stack, 'REGION', { value: stack.region });
  const SENTRY_DSN = new Config.Parameter(stack, 'SENTRY_DSN', {
    value:
      process.env.SENTRY_DSN ||
      'https://3ad9e8db97faeabb62b51252a4586ab9@o533220.ingest.sentry.io/4506315752538112',
  });
  const STRIPE_PK = new Config.Parameter(stack, 'STRIPE_PK', {
    value:
      process.env.STRIPE_PK ||
      'pk_test_51HEfFjF2Zl2S36kOMXclRY0iVHeslAIgt8Es9tRvWSF8FozEiLIsMfybmdjgOa2buSFmuKRCAsMFAaTt0OaN1IGw00YBw8cZHP',
  });
  const TWILIO_ACCOUNT_SID = new Config.Parameter(stack, 'TWILIO_ACCOUNT_SID', {
    value:
      process.env.TWILIO_ACCOUNT_SID || 'ACce907015f2dcc1e89bb6b56fc2ab8cee',
  });
  const TWILIO_KEY_SID = new Config.Parameter(stack, 'TWILIO_KEY_SID', {
    value:
      process.env.TWILIO_KEY_SID ||
      ifSandbox('SK3895a201a4a05b2454ac69912c9cca02'),
  });
  const TWILIO_SENDER = new Config.Parameter(stack, 'TWILIO_SENDER', {
    value: process.env.TWILIO_SENDER || '+18169443155',
  });

  /**
   * SECRETS
   */
  const AUTH_PRIVATE_KEY = new Config.Secret(stack, 'AUTH_PRIVATE_KEY');
  const CONTENTFUL_DELIVERY_KEY = new Config.Secret(
    stack,
    'CONTENTFUL_DELIVERY_KEY'
  );
  const FIREBASE_ADMIN_KEY = new Config.Secret(stack, 'FIREBASE_ADMIN_KEY');
  const SLACK_WEBHOOK = new Config.Secret(stack, 'SLACK_WEBHOOK');
  const STRIPE_SK = new Config.Secret(stack, 'STRIPE_SK');
  const TWILIO_KEY_SECRET = new Config.Secret(stack, 'TWILIO_KEY_SECRET');
  const TWILIO_TEST_SECRET = new Config.Secret(stack, 'TWILIO_TEST_SECRET');

  /**
   * TEST SECRETS
   * These are used for tests, so we don't export them since no functions should need them
   */
  const TEST_AGENT_PASSWORD = new Config.Secret(stack, 'TEST_AGENT_PASSWORD');

  return {
    config: {
      AUTH_PUBLIC_KEY,
      BILLING_EMAIL,
      BILLING_NAME,
      DB_RESET_CLIENT,
      DNS_ZONE,
      REGION,
      SENTRY_DSN,
      STRIPE_PK,
      TWILIO_ACCOUNT_SID,
      TWILIO_KEY_SID,
      TWILIO_SENDER,
    },
    secret: {
      AUTH_PRIVATE_KEY,
      CONTENTFUL_DELIVERY_KEY,
      FIREBASE_ADMIN_KEY,
      SLACK_WEBHOOK,
      STRIPE_SK,
      TWILIO_KEY_SECRET,
      TWILIO_TEST_SECRET,
    },
    // these will be automatically bound to every lambda
    defaults: [REGION, SENTRY_DSN],
  };
}

const fetchZone = (stack: Stack) => {
  const override = process.env.DNS_ZONE;
  if (override) return override;
  const zone: string | undefined = ZONE[stack.stage as keyof typeof ZONE];
  return zone || ZONE[STAGE.DEV];
};
