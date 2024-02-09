import assert from 'node:assert';
import twilio, { type Twilio } from 'twilio';
import { Config } from 'sst/node/config';
import { z } from 'zod';
import { AUTH, NODE_ENV } from '@utils/constants';

const IS_TEST = process.env.NODE_ENV === NODE_ENV.TEST;
export const TEST_SID = 'AC79eca1456ee4b5425fbc027619892e8e';
export const TEST_SENDER = '+15005550006';
export const MAGIC_NUMBERS: string[] = [AUTH.MOCK_PHONE];
const SENDER = IS_TEST ? TEST_SENDER : Config.TWILIO_SENDER;

const createClient = () => {
  assert.ok(!IS_TEST, `Bad NODE_ENV for live client: ${process.env.NODE_ENV}`);
  const accountSid = Config.TWILIO_ACCOUNT_SID;
  const apiKey = Config.TWILIO_KEY_SID;
  const apiSecret = Config.TWILIO_KEY_SECRET;
  assert.ok(accountSid, `Missing Twilio SID`);
  assert.ok(apiKey, `Missing Twilio API SID`);
  assert.ok(apiSecret, `Missing Twilio API secret`);
  assert.ok(SENDER, `Missing Twilio sender phone number`);
  return twilio(apiKey, apiSecret, { accountSid });
};

// tests use the test credentials
const createTestClient = () => {
  assert.ok(IS_TEST, `Bad NODE_ENV for test client: ${process.env.NODE_ENV}`);
  const accountSid = TEST_SID;
  const accountSecret = Config.TWILIO_TEST_SECRET;
  assert.ok(accountSid, `Missing Twilio test SID`);
  assert.ok(accountSecret, `Missing Twilio account test secret`);
  return twilio(accountSid, accountSecret);
};

const transformNumber = (phone: string) =>
  phone.charAt(0) === '+' ? phone : `+${phone}`;

export const isMagicNumber = (phone: string) =>
  MAGIC_NUMBERS.includes(phone.replace('+', ''));

let _twilio: Twilio | null = null;

export const useTwilio = () => {
  if (!_twilio) {
    _twilio = IS_TEST ? createTestClient() : createClient();
  }
  return _twilio;
};

const sendParams = z.object({
  body: z.string(),
  to: z.string(),
  from: z.string().optional(),
});
export type SendParams = z.infer<typeof sendParams>;

export const send = async (params: SendParams) => {
  const { body, from = SENDER, to } = sendParams.parse(params);
  if (isMagicNumber(to)) return null;
  return await useTwilio().messages.create({
    body,
    from,
    to: transformNumber(to),
  });
};

export default {
  useTwilio,
  send,
  isMagicNumber,
  /* eslint-disable @typescript-eslint/naming-convention */
  MAGIC_NUMBERS,
  TEST_SID,
  TEST_SENDER,
};
