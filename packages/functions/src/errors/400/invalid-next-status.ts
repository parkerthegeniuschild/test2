import { ERRORS } from '@utils/errors';
import { TruckupBadRequestError } from '../bad-request';

export class TruckupInvalidNextStatusError extends TruckupBadRequestError {
  constructor() {
    super(ERRORS.BAD_REQUEST.INVALID_NEXT_STATUS);
  }
}
