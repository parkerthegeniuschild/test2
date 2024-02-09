/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ['.eslintrc.*'],
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: ['sst-env.d.ts'],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    // we should try to move to this rule set
    // 'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'prettier', 'simple-import-sort'],
  rules: {
    'import/prefer-default-export': 'off',
    'import/newline-after-import': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.ts', '**/tests/*', '**/vitest.config.ts'],
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'default', format: ['camelCase', 'snake_case'] },
      {
        selector: 'variable',
        format: ['camelCase', 'snake_case', 'PascalCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'variable',
        modifiers: ['const', 'global'],
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'objectLiteralProperty',
        format: ['camelCase', 'UPPER_CASE', 'snake_case'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-redeclare': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, variables: false },
    ],
    'no-return-await': 'off',
    '@typescript-eslint/return-await': ['error', 'always'],
    '@typescript-eslint/no-unsafe-assignment': 'off',
    'no-void': ['error', { allowAsStatement: true }],
    // we can disable the following when we enable recommended-type-checked
    '@typescript-eslint/no-floating-promises': 'error',
  },
};
