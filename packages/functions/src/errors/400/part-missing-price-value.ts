import { ERRORS } from '@utils/errors';
import { TruckupBadRequestError } from '../bad-request';

export class TruckuppartMissingPriceValueError extends TruckupBadRequestError {
  constructor() {
    super(ERRORS.BAD_REQUEST.PART_MISSING_PRICE_VALUE);
  }
}
