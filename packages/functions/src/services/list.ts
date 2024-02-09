import { services as servicesSchema } from 'db/schema/services';
import { ApiHandler } from 'sst/node/api';
import { useDb } from 'db/dbClient';
import { transformEvent } from '@utils/helpers';
import { response } from '@utils/response';
import { sql } from 'drizzle-orm';

const db = useDb();

export const handler = ApiHandler(async (_evt) => {
  const { page, size, orderBy, filters, paginate } = transformEvent(
    _evt,
    servicesSchema
  );

  const [services, [{ total }]] = await Promise.all([
    db
      .select()
      .from(servicesSchema)
      .where(filters)
      .offset(Number(size) * Number(page))
      .limit(Number(size))
      .orderBy(orderBy)
      .execute(),
    db
      .select({ total: sql<number>`COUNT(*)` })
      .from(servicesSchema)
      .execute(),
  ]);

  return response.success(paginate(services, total));
});
