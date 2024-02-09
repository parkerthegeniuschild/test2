import { ERRORS } from '@utils/errors';
import { TruckupBadRequestError } from '../bad-request';

export class TruckuppartMissingQuantityValueError extends TruckupBadRequestError {
  constructor() {
    super(ERRORS.BAD_REQUEST.PART_MISSING_QUANTITY_VALUE);
  }
}
