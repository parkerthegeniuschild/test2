import TupApiHandler from 'handlers/TupApiHandler';
import { PARTS_DEFAULT_MARKUP } from '@utils/config';
import { userIsAgent, userIsProvider } from 'clients/auth';
import { TruckupForbiddenError } from 'src/errors';
import { PARTS_MARKUP_DENOMINATOR } from '@utils/constants';

export const handler = TupApiHandler(async () => {
  if (!(userIsAgent() || userIsProvider())) throw new TruckupForbiddenError();
  return {
    markup: PARTS_DEFAULT_MARKUP,
    denominator: PARTS_MARKUP_DENOMINATOR,
  };
});
