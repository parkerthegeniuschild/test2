import { ERRORS } from '@utils/errors';
import { TruckupBadRequestError } from '../bad-request';

export class TruckupLaborOnFutureError extends TruckupBadRequestError {
  constructor() {
    super(ERRORS.BAD_REQUEST.LABOR_ON_FUTURE);
  }
}
