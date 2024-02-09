import { IS_SANDBOX } from '@environment';
import { type Responder, response, responseSchema } from '@utils/response';
import { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { ITupAuth, authConfigSchema, useAuth } from 'clients/auth';
import { Sentry } from 'clients/sentry';
import {
  TruckupBadRequestError,
  TruckupForbiddenError,
  TruckupInternalServerErrorError,
  TruckupNotFoundError,
  TruckupUnauthorizedError,
} from 'src/errors';
import {
  ApiHandler,
  useJsonBody,
  usePathParams,
  useQueryParams,
} from 'sst/node/api';
import { ZodError, ZodObject, z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export type TupApiHandlerCallback = (data: {
  auth: ITupAuth | undefined;
  event: APIGatewayProxyEventV2;
  context: Context;
  body: unknown | undefined;
  pathParams: unknown | undefined;
  queryParams: unknown | undefined;
}) => Promise<unknown>;

const tupHttpMethodSchema = z.enum(['GET', 'POST', 'PATCH', 'DELETE']);
export type TupHttpMethod = z.infer<typeof tupHttpMethodSchema>;

const tupApiHandlerConfigSchema = z.object({
  method: tupHttpMethodSchema.optional(),
  auth: authConfigSchema.or(z.boolean()).optional(),
  response: responseSchema.optional(),
  successStatus: z.number().int().optional(),
  validate: z
    .object({
      body: z.instanceof(ZodObject).optional(),
      pathParams: z.instanceof(ZodObject).optional(),
      queryParams: z.instanceof(ZodObject).optional(),
    })
    .optional(),
});
export type ITupApiHandlerConfig = z.infer<typeof tupApiHandlerConfigSchema>;

/* eslint-disable @typescript-eslint/naming-convention */
const successResponse: Record<TupHttpMethod, Responder> = {
  GET: response.success,
  POST: response.created,
  PATCH: response.success,
  DELETE: response.success,
};
/* eslint-enable @typescript-eslint/naming-convention */

const DEFAULT_CONFIG: Required<Pick<ITupApiHandlerConfig, 'method'>> = {
  method: 'GET',
};

/**
 * status code priority, the first found status code will be used during success:
 *   1. config.response.statusCode
 *   2. config.successStatus
 *   3. default status code for config.method
 *   4. 200
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const TupApiHandler = (
  cb: TupApiHandlerCallback,
  _config: ITupApiHandlerConfig = {}
) => {
  return Sentry.AWSLambda.wrapHandler(
    ApiHandler(async (event, context) => {
      const config = {
        ...DEFAULT_CONFIG,
        ...tupApiHandlerConfigSchema.parse(_config),
      };
      try {
        const auth = config?.auth
          ? useAuth(typeof config.auth === 'object' ? config.auth : undefined)
          : undefined;

        const inputs = validateInputs(config);

        const res = await cb({ event, context, auth, ...inputs });
        return successResponse[config.method](res, {
          statusCode: config.successStatus,
          ...config.response,
        });
      } catch (e) {
        Sentry.captureException(e);
        switch (true) {
          case e instanceof ZodError:
            return response.error({ message: fromZodError(e).message });
          case e instanceof TruckupBadRequestError:
            return response.error({ message: e.message });
          case e instanceof TruckupForbiddenError:
            return response.forbidden({ message: e.message });
          case e instanceof TruckupNotFoundError:
            return response.notFound({ message: e.message });
          case e instanceof TruckupUnauthorizedError:
            return response.unauthorized({ message: e.message });
          case e instanceof TruckupInternalServerErrorError:
            return response.failure({ message: e.message });
          default:
            return response.failure({
              message: logUnexpectedError(e),
            });
        }
      }
    })
  );
};

export default TupApiHandler;

const validateInputs = (config: ITupApiHandlerConfig) => {
  const { validate } = config;
  return {
    body:
      validate?.body &&
      (validate.body.parse(useJsonBody()) as z.infer<typeof validate.body>),
    pathParams:
      validate?.pathParams &&
      (validate.pathParams.parse(usePathParams()) as z.infer<
        typeof validate.pathParams
      >),
    queryParams:
      validate?.queryParams &&
      (validate.queryParams.parse(useQueryParams()) as z.infer<
        typeof validate.queryParams
      >),
  };
};

// we choose to console log here to make it easier to debug
// in our handler, we already log to sentry
const logUnexpectedError = (e: unknown) => {
  if (IS_SANDBOX) {
    try {
      /* eslint-disable no-console */
      console.error(`Unexpected exception!`);
      // @ts-expect-error attempt to log error message
      console.log(e?.message);
      console.log(e);
      // @ts-expect-error attempt to return error
      if (typeof e?.message === 'string') return e.message as string;
    } catch (err) {
      console.log(err);
      /* eslint-enable no-console */
    }
  }
  return 'An unknown error has occured';
};
