/* eslint-disable @typescript-eslint/naming-convention */

import { SES, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { Config } from 'sst/node/config';

// eslint-disable-next-line import/no-self-import
export * as ses from './ses';

let _ses: SES | null = null;
export const useSES = () => {
  if (!_ses) _ses = new SES({ region: Config.REGION });
  return _ses;
};

export const useSESMailTransport = () => ({
  SES: {
    ses: useSES(),
    aws: { SendRawEmailCommand },
  },
});
