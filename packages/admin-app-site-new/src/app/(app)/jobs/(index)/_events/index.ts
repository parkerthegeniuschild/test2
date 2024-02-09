import { createEvent } from 'react-event-hook';

export const { emitDispatcherEdit, useDispatcherEditListener } =
  createEvent('dispatcherEdit')();
