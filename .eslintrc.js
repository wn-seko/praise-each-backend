// eslint-disable-next-line no-process-env
const isStrict = process.env.LINT_ENV === 'strict'

const defaultConfig = {
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js',
      },
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:jsdoc/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['jsdoc', 'import'],
  env: { node: true, es2020: true },
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaVersion: 11,
  },
  rules: {
    'no-process-env': 'error',
    'no-unsupported-features/es-syntax': 'off', // TSでsyntaxエラーになるから不要
    'no-unpublished-import': 'off', // TSでimport検出できるから不要
    'no-missing-import': 'off', // TSでimport検出できるから不要
    'no-extraneous-import': 'off', // TSでimport検出できるから不要
    'no-console': isStrict
      ? ['error', { allow: ['info', 'warn', 'error'] }]
      : ['warn', { allow: ['info', 'warn', 'error'] }],
    'no-debugger': isStrict ? 'error' : 'warn',
    'jsdoc/valid-types': 'off',
    'sort-imports': 'off',
    'import/order': ['error', { alphabetize: { order: 'asc' } }],
  },
}

const tsConfig = {
  ...defaultConfig,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  plugins: ['@typescript-eslint', 'jsdoc', 'import'],
  rules: {
    ...defaultConfig.rules,
    '@typescript-eslint/explicit-module-boundary-types': ['error'],
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          '{}': false,
        },
      },
    ],
  },
}

module.exports = {
  ...defaultConfig,
  root: true,
  overrides: [
    {
      // TSに限定し、 *.test.js は運用しないという方向でよしなにしていきたい。
      ...tsConfig,
      files: ['**/*.test.ts', '**/*.test.tsx'],
      env: {
        ...tsConfig.env,
        jest: true,
      },
    },
    {
      ...tsConfig,
      files: ['**/*.ts'],
    },
    {
      ...tsConfig,
      files: ['**/*.tsx'],
      rules: tsConfig.rules,
    },
  ],
}
