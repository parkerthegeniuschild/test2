import { PgDatabase, PgTransaction } from 'drizzle-orm/pg-core';
import { AwsDataApiPgQueryResultHKT } from 'drizzle-orm/aws-data-api/pg';

export type TTransaction = PgTransaction<
  AwsDataApiPgQueryResultHKT,
  Record<string, unknown>,
  Record<string, any>
>;

export type TDatabase = PgDatabase<
  AwsDataApiPgQueryResultHKT,
  Record<string, unknown>,
  Record<string, any>
>;

export type TDatabaseOrTransaction = TDatabase | TTransaction;
