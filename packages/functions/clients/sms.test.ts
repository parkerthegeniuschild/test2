import assert from 'node:assert/strict';
import { beforeAll, describe, expect, it } from 'vitest';
import { Twilio } from 'twilio';
import { MessageStatus } from 'twilio/lib/rest/api/v2010/account/message';
import sms from './sms';

const BODY = 'This is just a test! :D';
const PHONE = '+12062661000'; // AWS office
const QUEUED: MessageStatus = 'queued';

describe(`SMS client`, () => {
  describe(`useTwilio`, () => {
    let client: Twilio;
    beforeAll(() => {
      client = sms.useTwilio();
    });

    it(`should return a valid Twilio client`, () => {
      expect(client).toBeInstanceOf(Twilio);
    });

    it(`should use the test SID`, () => {
      expect(client.accountSid).toEqual(sms.TEST_SID);
    });

    it(`should reuse the same instance of the client`, () => {
      const client2 = sms.useTwilio();
      expect(client2).toBe(client);
    });
  });

  describe(`send`, () => {
    it(`should send an SMS from valid sender by default`, async () => {
      const res = await sms.send({ body: BODY, to: PHONE });
      expect(!!res).toBeTruthy();
      assert.ok(!!res, `Missing res!`);
      expect(res.status).toEqual(QUEUED);
      expect(res.body).toEqual(BODY);
      expect(res.from).toEqual(sms.TEST_SENDER);
      expect(res.to).toEqual(PHONE);
    });

    it(`should fail to send an SMS from an invalid sender`, async () => {
      await expect(() =>
        sms.send({ body: BODY, to: PHONE, from: PHONE })
      ).rejects.toThrowError(
        'is not a valid, SMS-capable inbound phone number'
      );
    });

    it(`should skip sending the SMS to a magic number`, async () => {
      const res = await Promise.all(
        sms.MAGIC_NUMBERS.map((e) => sms.send({ body: BODY, to: e }))
      );
      res.forEach((e) => expect(e).toBeNull());
    });
  });
});
