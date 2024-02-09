import { AppUser } from '@core/appUser';
import { ProviderType, ROLE } from '@utils/constants';
import TupApiHandler from 'handlers/TupApiHandler';
import { useBody } from 'sst/node/api';
import { TruckupBadRequestError, TruckupForbiddenError } from 'src/errors';
import { useAuth, userIsAgent } from 'clients/auth';
import { Provider } from '@core/provider';
import { useDb } from 'db/dbClient';
import { CreateProviderRequestSchema } from './open-api';

export const handler = TupApiHandler(
  async () => {
    const isAgent = userIsAgent();
    if (!isAgent) throw new TruckupForbiddenError();

    const _body = useBody();
    if (!_body) throw new TruckupBadRequestError('Missing body');
    const body = CreateProviderRequestSchema.parse(JSON.parse(_body));

    const { username } = useAuth();

    const provider = await useDb().transaction(async (tx) => {
      const user = await AppUser.create(
        {
          ...body,
          created_by: username,
          app_role: ROLE.PROVIDER,
        },
        tx,
        true
      );

      const _provider = await Provider.create(
        {
          ...body,
          created_by: username,
          address: body.address1,
          address_two: body.address2,
          app_user_id: user.id,
          provider_type: ProviderType.PRO,
          rating: '0.0',
        },
        tx,
        true
      );

      await Provider.createAllProviderRates({
        dbInstance: tx,
        body: {
          created_by: username,
          provider_id: _provider.id,
          rate_id: 0,
        },
      });

      return _provider;
    });

    if (!provider.id) throw new TruckupBadRequestError();

    return provider;
  },
  { method: 'POST' }
);
