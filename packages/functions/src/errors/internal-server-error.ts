import { TruckupError } from './truckup-error';

export class TruckupInternalServerErrorError extends TruckupError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}
