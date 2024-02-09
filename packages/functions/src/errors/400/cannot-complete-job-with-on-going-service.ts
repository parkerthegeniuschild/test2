import { ERRORS } from '@utils/errors';
import { TruckupBadRequestError } from '../bad-request';

export class TruckupCannotCompleteJobWithOnGoingServiceError extends TruckupBadRequestError {
  constructor() {
    super(ERRORS.BAD_REQUEST.CANNOT_COMPLETE_JOB_WITH_ON_GOING_SERVICE);
  }
}
