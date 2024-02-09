import { eq } from 'drizzle-orm';
import { services as servicesSchema } from 'db/schema/services';
import { useDb } from 'db/dbClient';
import { TDatabaseOrTransaction } from '@utils/dbTransaction';

interface IGetServiceByIdInput {
  id: number;
  dbInstance?: TDatabaseOrTransaction;
}

export const getServiceById = async ({
  id,
  dbInstance = useDb(),
}: IGetServiceByIdInput) => {
  const service = await dbInstance
    .select()
    .from(servicesSchema)
    .where(eq(servicesSchema.id, id));
  return service.length ? service[0] : undefined;
};
