import { TruckupError } from './truckup-error';

export class TruckupUnauthorizedError extends TruckupError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}
