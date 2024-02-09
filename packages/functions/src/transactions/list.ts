import { TransactionLogs } from '@core/transactionLogs';
import { snakeCaseKeys, transformEvent } from '@utils/helpers';
import { useAuth, userIsAgent, userIsProvider } from 'clients/auth';
import { dbTransactionLogs } from 'db/schema/transactionLogs';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupInternalServerErrorError } from 'src/errors';

export const handler = TupApiHandler(async ({ event }) => {
  const transformed = transformEvent(event, dbTransactionLogs, {
    order: 'desc',
  });
  const { paginate } = transformed;

  const params = _generateListParams();

  const [transactions, total] = await TransactionLogs.list(params, transformed);

  return paginate(transactions.map(snakeCaseKeys), total);
});

const _generateListParams = (): TransactionLogs.TListParams => {
  const auth = useAuth();
  const { providerId } = auth;
  const isAgent = userIsAgent(auth);
  const isProvider = userIsProvider(auth);

  if (isAgent) return {};

  if (isProvider && providerId) return { providerId };

  throw new TruckupInternalServerErrorError();
};
