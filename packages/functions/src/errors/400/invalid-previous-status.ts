import { ERRORS } from '@utils/errors';
import { TruckupBadRequestError } from '../bad-request';

export class TruckupInvalidPreviousStatusError extends TruckupBadRequestError {
  constructor() {
    super(ERRORS.BAD_REQUEST.INVALID_PREVIOUS_STATUS);
  }
}
