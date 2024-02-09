import TupApiHandler from 'handlers/TupApiHandler';
import { useJsonBody } from 'sst/node/api';
import axios from 'axios';
import { Config } from 'sst/node/config';
import { camelCaseKeys } from '@utils/helpers';
import type { CamelCasedProperties } from 'type-fest';
import parsePhoneNumber from 'libphonenumber-js';
import {
  ProviderSignupRequestSchema,
  TProviderSignupRequestSchema,
  TProviderSignupResponseSchema,
} from './open-api';

export const handler = TupApiHandler(
  async (): Promise<TProviderSignupResponseSchema> => {
    const request = camelCaseKeys(
      ProviderSignupRequestSchema.parse(useJsonBody())
    );
    const message = createProviderSignupMessage(request);
    await postToSlack(message);
    return { accepted: true };
  }
);

type TRequest = CamelCasedProperties<TProviderSignupRequestSchema>;
const createProviderSignupMessage = (request: TRequest) => {
  const { firstname, lastname, email, phone: _phone } = request;
  const parsed = parsePhoneNumber(_phone, 'US');
  const phone = parsed?.formatNational() || _phone;
  const text = `Provider Signup Request
  🧑‍🔧 ${firstname} ${lastname}
  📨 ${email}
  📱 ${phone}`;
  return text;
};

interface ISlackPayload {
  text: string;
}
const postToSlack = async (text: string) => {
  const payload: ISlackPayload = { text };
  return await axios.post(Config.SLACK_WEBHOOK, payload);
};
