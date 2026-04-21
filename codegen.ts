import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:3001/api/graphql',

  documents: [
    'lib/**/*.ts',
    'app/**/*.tsx',
    'components/**/*.tsx',
    'components/**/*.ts'
  ],

  generates: {
    './gqlcodegen/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
};

export default config;