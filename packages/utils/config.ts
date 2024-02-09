import assert from 'node:assert/strict';

export * as default from './config';
export * as config from './config';

// Parts markup
export const PARTS_DEFAULT_MARKUP = 40;
export const PARTS_MIN_MARKUP = 10;
assert.ok(
  PARTS_DEFAULT_MARKUP >= PARTS_MIN_MARKUP,
  `Bad parts markup settings!`
);
