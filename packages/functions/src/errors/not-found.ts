import { TruckupError } from './truckup-error';

export class TruckupNotFoundError extends TruckupError {
  constructor(message = 'NotFound') {
    super(message, 404);
  }
}
