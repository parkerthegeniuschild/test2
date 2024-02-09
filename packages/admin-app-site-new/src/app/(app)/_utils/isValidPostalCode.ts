const US_ZIP_CODE_REGEX = /^\d{5}$/;
const CA_POSTAL_CODE_REGEX = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

export const isValidPostalCode = (value: string) =>
  US_ZIP_CODE_REGEX.test(value) || CA_POSTAL_CODE_REGEX.test(value);
