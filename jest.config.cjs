/** @type {import('jest').Config} */
const config = {
    preset: 'react-native',
    setupFilesAfterEnv: ['<rootDir>/tests/jest/setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    transformIgnorePatterns: ['node_modules/(?!((jest-)?react-native|@react-native(-community)?|ky)/)'],
    testMatch: ['<rootDir>/tests/**/*.test.ts?(x)']
};

module.exports = config;
