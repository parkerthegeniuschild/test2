import { ERRORS } from '@utils/errors';
import { TruckupBadRequestError } from '../bad-request';

export class TruckuppartMissingMarkupValueError extends TruckupBadRequestError {
  constructor() {
    super(ERRORS.BAD_REQUEST.PART_MISSING_MARKUP_VALUE);
  }
}
