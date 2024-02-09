import { ZodTypeAny } from 'zod';
import lodash from 'lodash';

const { isNil, omitBy } = lodash;

export const getOpenApiMetadata = <T extends ZodTypeAny>(zodSchema: T) =>
  omitBy(zodSchema._def.openapi?.metadata ?? {}, isNil);
