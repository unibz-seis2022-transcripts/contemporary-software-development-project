export default {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.m?[tj]s?$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.(m)?js$': '$1',
  },
  testMatch: ['**/__tests__/*.test.{j,t}s?(x)', '**/?(*.)(spec|test).js?(x)'],
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.mts',
    '!src/**/*.d.ts',
    '!src/**/*.d.mts',
  ],
  setupFiles: ['<rootDir>testConfig.ts'],
  globals: {
    "ts-jest": {
      compiler: "ttypescript"
    }
  }
};
