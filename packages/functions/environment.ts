import { NON_SANDBOX_STAGES, STAGE } from '@utils/constants';
import { Config } from 'sst/node/config';

export const IS_SANDBOX = !NON_SANDBOX_STAGES.includes(Config.STAGE);
export const IS_PROD = Config.STAGE === STAGE.PROD;
