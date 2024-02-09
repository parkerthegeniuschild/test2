const truckupConfig = require('@truckup/prettier-config');

/** @type {import('prettier').Config} */
module.exports = {
  ...truckupConfig,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  endOfLine: 'lf',
  printWidth: 80,
};
