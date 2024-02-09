import { ERRORS } from '@utils/errors';
import { TruckupBadRequestError } from '../bad-request';

export class TruckupLaborAlreadyInProgressError extends TruckupBadRequestError {
  constructor() {
    super(ERRORS.BAD_REQUEST.LABOR_ALREADY_IN_PROGRESS);
  }
}
