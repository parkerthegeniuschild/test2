/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    '@truckup/eslint-config',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'next/core-web-vitals',
    'plugin:storybook/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  plugins: ['react', '@tanstack/query'],
  rules: {
    curly: 'error',
    'no-promise-executor-return': 'off',
    '@next/next/no-html-link-for-pages': 'off',
    'import/prefer-default-export': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/no-unused-prop-types': 'error',
    'react/jsx-no-bind': 'off',
    'no-console': [
      'warn',
      {
        allow: ['error', 'info'],
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
        '': 'never',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/panda.config.ts',
          '**/src/styles/**/*.ts',
          '**/src/mocks/**/*.ts',
          '**/*.d.ts',
          '**/*.test.*',
          '**/*.stories.tsx',
        ],
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { varsIgnorePattern: '^_[^_]' },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow',
      },
    ],
    'no-underscore-dangle': 'off',
  },
  overrides: [
    {
      files: ['**/*.js', '**/*.ts', '**/*.tsx'],
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Side effect imports
              ['^\\u0000'],
              // `react` first, `next` second, then packages starting with a character
              ['^react', '^next', '^@[a-z]', '^[a-z]'],
              // Internal app packages
              ['^@/[a-z]'],
              ['^@/\\.\\./[a-z]'],
              // Imports starting with `../`
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Imports starting with `./`
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              // Style imports
              ['^.+\\.s?css$'],
            ],
          },
        ],
      },
    },
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:jest-dom/recommended', 'plugin:testing-library/react'],
      rules: {
        '@typescript-eslint/no-floating-promises': 'error',
      },
    },
  ],
};
