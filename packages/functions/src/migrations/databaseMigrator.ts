import { IS_SANDBOX } from '@environment';
import { useDb } from 'db/dbClient';
import { migrate } from 'drizzle-orm/aws-data-api/pg/migrator';
import { handler as resetDb } from '../debug/resetDatabase';

const db = useDb();
export const handler = async () => {
  if (process.env.RESET_DB === 'true' && IS_SANDBOX) {
    await resetDb();
  }
  await migrate(db, { migrationsFolder: 'packages/functions/drizzle' });
};
