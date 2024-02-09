import { NON_SANDBOX_STAGES, STAGE } from '../packages/utils/constants';

export const checkIsSandbox = (stage: string) =>
  !NON_SANDBOX_STAGES.includes(stage);

export const checkIsDev = (stage: string) => stage === STAGE.DEV;

export const checkIsStaging = (stage: string) => stage === STAGE.STAGING;

export const checkIsProd = (stage: string) => stage === STAGE.PROD;
