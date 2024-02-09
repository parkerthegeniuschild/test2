import assert from 'node:assert/strict';
import { RDSData } from '@aws-sdk/client-rds-data';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/aws-data-api/pg';
import logger from 'src/logger';
import { RDS } from 'sst/node/rds';
import { handler as migrationHandler } from 'src/migrations/databaseMigrator';
import { z } from 'zod';
import { Config } from 'sst/node/config';
import { defaults } from 'lodash';
import { STAGE } from '@utils/constants';
import TupLambdaHandler from 'handlers/TupLambdaHandler';

const TARGET_DB = RDS.db.defaultDatabaseName;
const SOURCE_DB = `__source_${TARGET_DB}`;
export const SOURCE_MASTER_DB = 'source';
export const RESET_TEST_DB = 'reset_database_test_db';
export const BANNED_DBS = [
  'prod',
  'staging',
  'dev',
  'source',
  'truckup',
  'truckup_test',
  'rdsadmin',
  'postgres',
];
export const BANNED_STAGES: string[] = [STAGE.PROD, STAGE.STAGING, STAGE.DEV];
const IS_CREATE = process.env.IS_CREATE === 'true';

const db = drizzle(new RDSData(), {
  database: Config.DB_RESET_CLIENT,
  secretArn: RDS.db.secretArn,
  resourceArn: RDS.db.clusterArn,
  logger: true,
});

export type IResetDatabaseParams = Partial<IResetParams>;
export const handler = TupLambdaHandler(
  async (_params: IResetDatabaseParams = {}) => {
    const params: IResetParams = defaults(_params, {
      source: SOURCE_DB,
      target: TARGET_DB,
    });

    const { shouldReset } = validateParams(params);

    if (shouldReset) {
      await initializeSource(params);

      await stopDb(params);

      await dropDb(params);

      await cloneDb(params);
    }

    await triggerMigrations(params);

    finish(params);
  }
);

const resetParamsSchema = z.object({
  source: z.string(),
  target: z.string(),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __testStage: z.string().optional(),
});
export type IResetParams = z.infer<typeof resetParamsSchema>;

const validateParams = (_params: IResetParams) => {
  const params = resetParamsSchema.parse(_params);
  const { target } = params;
  const isValid = checkStage(Config.STAGE, true);
  logger.info(`🤖 Trying to reset database '${target}'`);
  if (!IS_CREATE) checkStage(Config.STAGE);
  if (params.__testStage) checkStage(params.__testStage);
  if (!IS_CREATE) checkDb(target);
  return {
    shouldReset: isValid,
  };
};

const checkStage = (stage: string, safe = false) => {
  const isValid = !BANNED_STAGES.includes(stage);
  if (!safe) assert.ok(isValid, `Bad stage: ${stage}!`);
  return isValid;
};

const checkDb = (dbName: string) => {
  assert.ok(!BANNED_DBS.includes(dbName), `Bad target db: ${dbName}!`);
};

const initializeSource = async ({ source }: IResetParams) => {
  // @ts-expect-error drizzle type is wrong
  const [dbExists] = await db.execute(
    sql`SELECT 1 FROM pg_database WHERE datname = ${source}`
  );
  if (!dbExists) {
    logger.info(
      `🗺️ Initializing source db '${source}' from template ${SOURCE_MASTER_DB}...`
    );
    await db.execute(
      sql.raw(`CREATE DATABASE ${source} TEMPLATE ${SOURCE_MASTER_DB}`)
    );
    logger.info(`✅ Initialized!`);
  }
};

const stopDb = async ({ target, source }: IResetParams) => {
  logger.info(`🛑 Stopping any connections to '${target}' and '${source}`);
  await db.execute(
    sql`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = ${target} OR datname = ${source}`
  );
  logger.info(`✅ Stopped!`);
};

const dropDb = async ({ target }: IResetParams) => {
  logger.info(`🗑️ Dropping '${target}'...`);
  await db.execute(sql.raw(`DROP DATABASE IF EXISTS ${target}`));
  logger.info(`✅ Dropped!`);
};

const cloneDb = async ({ source, target }: IResetParams) => {
  logger.info(`📝 Cloning database '${target} from template ${source}...`);
  await db.execute(sql.raw(`CREATE DATABASE ${target} TEMPLATE ${source}`));
  logger.info(`✅ Cloned!`);
};

const triggerMigrations = async ({ target }: IResetParams) => {
  logger.info(`🏃‍♂️ Running migrations on '${target}'...`);
  await migrationHandler();
  logger.info(`✅ Migrated!`);
};

const finish = ({ target }: IResetParams) => {
  logger.info(`🥳 All done, database '${target}' should be reset!`);
};
