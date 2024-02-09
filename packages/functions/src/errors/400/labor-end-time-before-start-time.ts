import { ERRORS } from '@utils/errors';
import { TruckupBadRequestError } from '../bad-request';

export class TruckupLaborEndTimeBeforeStartTimeError extends TruckupBadRequestError {
  constructor() {
    super(ERRORS.BAD_REQUEST.LABOR_END_TIME_BEFORE_START_TIME);
  }
}
