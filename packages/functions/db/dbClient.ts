import { RDSData } from '@aws-sdk/client-rds-data';
import { AnyColumn, SQL, SQLWrapper } from 'drizzle-orm';
import {
  AwsDataApiPgDatabase,
  DrizzleAwsDataApiPgConfig,
  drizzle,
} from 'drizzle-orm/aws-data-api/pg';
import { PgColumn } from 'drizzle-orm/pg-core';
import { RDS } from 'sst/node/rds';

let _db: AwsDataApiPgDatabase<Record<string, unknown>> | null = null;

export const useDb = <
  TSchema extends Record<string, unknown> = Record<string, never>
>(
  schema?: TSchema,
  config: Partial<DrizzleAwsDataApiPgConfig<TSchema>> = {}
) => {
  if (!_db)
    _db = drizzle(new RDSData({}), {
      database: RDS.db.defaultDatabaseName,
      secretArn: RDS.db.secretArn,
      resourceArn: RDS.db.clusterArn,
      logger: true,
      schema,
      ...config,
    });
  return _db as AwsDataApiPgDatabase<TSchema>;
};

// we should remove the Record type once we resolve our db schema pattern
export const orderById = <
  T extends Record<string, PgColumn> = { id: PgColumn }
>(
  t: T,
  { desc }: { desc: (column: SQLWrapper | AnyColumn) => SQL<unknown> }
) => [desc(t.id)];

export const orderedJoin = { orderBy: orderById };
