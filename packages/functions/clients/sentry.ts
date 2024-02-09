import * as S from '@sentry/serverless';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { Config } from 'sst/node/config';

S.AWSLambda.init({
  environment: Config.STAGE,
  dsn: Config.SENTRY_DSN,
  integrations: [new ProfilingIntegration()],
  // Performance Monitoring
  tracesSampleRate: 0.5,
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

export const Sentry = S;
