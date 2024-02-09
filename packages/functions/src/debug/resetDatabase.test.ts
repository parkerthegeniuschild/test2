import { describe, expect } from 'vitest';
import { Function } from 'sst/node/function';
import logger from 'src/logger';
import { STAGE } from '@utils/constants';
import { invoker } from 'clients/lambda';
import {
  BANNED_DBS,
  BANNED_STAGES,
  RESET_TEST_DB,
  SOURCE_MASTER_DB,
  type IResetDatabaseParams,
} from './resetDatabase';

describe(`[Debug] DatabaseReset`, () => {
  describe(`has banned stages that`, () => {
    it(`should throw an error when invoked`, async () => {
      await Promise.all(BANNED_STAGES.map(throwsBadStage));
    });
    logger.debug(`Tested ${BANNED_STAGES.length} banned stages.`);

    isBannedStage(STAGE.PROD);
    isBannedStage(STAGE.STAGING);
    isBannedStage(STAGE.DEV);
  });

  describe(`has banned database targets that`, () => {
    it(`should throw an error when a reset is attempted`, async () => {
      await Promise.all(BANNED_DBS.map(throwsBadDb));
    });

    isBannedDb(SOURCE_MASTER_DB);
    isBannedDb(STAGE.PROD);
    isBannedDb(STAGE.STAGING);
    isBannedDb(STAGE.DEV);

    isBannedDb('prod');
    isBannedDb('staging');
    isBannedDb('dev');
    isBannedDb('source');
    isBannedDb('truckup');
    isBannedDb('truckup_test');
    isBannedDb('rdsadmin');
    isBannedDb('postgres');
  });

  it(`should succeed on the reset test db`, async () => {
    const reset = createReseter({ target: RESET_TEST_DB });
    await reset(); // this throws if it fails
    expect(true).toBeTruthy();
  });
});

const throwsBadStage = async (stage: string) => {
  await expect(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    createReseter({ __testStage: stage })
  ).rejects.toThrow('Bad stage');
};

const throwsBadDb = async (db: string) => {
  await expect(createReseter({ target: db })).rejects.toThrow('Bad target db');
};

const isBannedStage = (stage: string) => {
  it(`should include ${stage}`, () => {
    expect(BANNED_STAGES).toContain(stage);
  });
};

const isBannedDb = (db: string) => {
  it(`should include ${db}`, () => {
    expect(BANNED_DBS).toContain(db);
  });
};

const createReseter = invoker<IResetDatabaseParams>(
  Function.DatabaseReset.functionName
);
