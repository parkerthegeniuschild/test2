import { ERRORS } from '@utils/errors';
import { TruckupBadRequestError } from '../bad-request';

export class TruckupLaborHasOverlapError extends TruckupBadRequestError {
  constructor() {
    super(ERRORS.BAD_REQUEST.LABOR_HAS_OVERLAP);
  }
}
