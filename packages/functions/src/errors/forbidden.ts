import { TruckupError } from './truckup-error';

export class TruckupForbiddenError extends TruckupError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}
