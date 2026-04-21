const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/ui/(.*)$': '<rootDir>/__mocks__/uiMock.ts',
    '^@/(.*)$': '<rootDir>/app/cvs/$1',
  },
}

module.exports = createJestConfig(customJestConfig)