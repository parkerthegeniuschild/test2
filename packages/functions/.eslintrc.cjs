/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@truckup/eslint-config'],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ['**/db/schema/*'],
      rules: {
        'import/no-cycle': 'off',
        '@typescript-eslint/naming-convention': 'off',
      },
    },
  ],
};
