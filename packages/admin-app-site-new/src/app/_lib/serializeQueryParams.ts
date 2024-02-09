import {
  decodeDelimitedArray,
  decodeObject,
  encodeDelimitedArray,
  encodeObject,
} from 'serialize-query-params';

const KEY_VALUE_SEPARATOR = '-';
const ENTRY_SEPARATOR = '__';

const CustomObjectParam = {
  encode: (
    obj:
      | { [key: string]: string | null | number | undefined }
      | null
      | undefined
  ) => encodeObject(obj, KEY_VALUE_SEPARATOR, ENTRY_SEPARATOR),

  decode: (input: string | (string | null)[] | null | undefined) =>
    decodeObject(input, KEY_VALUE_SEPARATOR, ENTRY_SEPARATOR),
};

const CustomDelimitedArrayParam = {
  encode: (array: (string | null)[] | null | undefined) =>
    encodeDelimitedArray(array, ENTRY_SEPARATOR),

  decode: (input: string | (string | null)[] | null | undefined) =>
    decodeDelimitedArray(input, ENTRY_SEPARATOR),
};

export * from 'serialize-query-params';
export {
  CustomDelimitedArrayParam as DelimitedArrayParam,
  CustomObjectParam as ObjectParam,
};
