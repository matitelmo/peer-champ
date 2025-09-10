import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Global ignores for generated/build artifacts
  {
    ignores: [
      'node_modules/**',
      '**/.next/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  ...compat.plugins('prettier'),
  // Default rules for source files
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      // Relax a few strict rules to reduce noise while keeping guidance
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/no-unescaped-entities': 'warn',
    },
  },
  // Allow require() in configuration and tooling JS files
  {
    files: [
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
      'cypress.config.js',
      'jest.config.js',
      'tailwind.config.js',
      'scripts/**/*.js',
    ],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  // Completely disable linting rules for generated Next.js types
  {
    files: ['.next/**', '**/.next/**', 'next-env.d.ts'],
    rules: {
      'prettier/prettier': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
];

export default eslintConfig;
