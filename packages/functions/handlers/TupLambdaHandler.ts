import type { Handler } from 'aws-lambda';
import { Sentry } from 'clients/sentry';

// for Lambdas that are NOT used with API Gateway
export const TupLambdaHandler = (cb: Handler) =>
  Sentry.AWSLambda.wrapHandler(cb);

export default TupLambdaHandler;
