import { describe, expect, expectTypeOf } from 'vitest';
import { snakeCaseKeys } from './helpers';

describe(`@utils/helpers`, () => {
  describe(`#snakeCaseKeys`, () => {
    it(`returns an object with correctly transformed keys`, async () => {
      expect(snakeCaseKeys(DATA)).toEqual(EXPECTED);
    });

    it(`returns a type with correctly transformed keys`, () => {});
    expectTypeOf(snakeCaseKeys(DATA)).toEqualTypeOf(EXPECTED);
  });
});

const TEST_DATE = new Date();

const DATA = {
  keyone: 'valueone',
  keyTwo: 'valuetwo',
  keyThreeParts: 'valueThree',
  keyFour: 123,
  keyFive: true,
  keySIX: false,
  keySeven: null,
  keyEight: {
    childKey: 'foo',
    childKeyTwo: 234,
  },
  keyNine: TEST_DATE,
};

const EXPECTED = {
  keyone: 'valueone',
  key_two: 'valuetwo',
  key_three_parts: 'valueThree',
  key_four: 123,
  key_five: true,
  key_six: false,
  key_seven: null,
  key_eight: {
    child_key: 'foo',
    child_key_two: 234,
  },
  key_nine: TEST_DATE,
};
