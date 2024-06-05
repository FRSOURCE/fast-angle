import { typescript } from '@frsource/eslint-config';
import globals from 'globals';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...typescript,
  { ignores: ['**/dist', '**/coverage', '**/node_modules', '**/.*-temp'] },
  {
    files: ['src/**', 'test/**.ts'],
    languageOptions: {
      globals: {
        ...globals.es2021,
        ...globals.browser,
      },
    },
  },
];
