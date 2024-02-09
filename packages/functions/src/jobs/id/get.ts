import { getJobById, jobAccessValidation } from '@core/jobs';
import { ApiHandler } from 'sst/node/api';
import { response } from '@utils/response';
import { TruckupForbiddenError, TruckupNotFoundError } from 'src/errors';
import { SelectJobSchemaForProviderValidation } from 'db/schema/jobs';

export const handler = ApiHandler(async (_evt) => {
  try {
    const id = _evt.pathParameters?.id ?? null;
    const job = await getJobById(Number(id));

    if (!job) {
      return response.notFound();
    }

    jobAccessValidation(job as SelectJobSchemaForProviderValidation);

    return response.success(job);
  } catch (error) {
    switch (true) {
      case error instanceof TruckupForbiddenError:
        return response.forbidden();
      case error instanceof TruckupNotFoundError:
        return response.notFound();
      default:
        return response.failure(error);
    }
  }
});
