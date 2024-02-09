import { TruckupError } from './truckup-error';

export class TruckupBadRequestError extends TruckupError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}
