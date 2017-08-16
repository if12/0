/**
 * @author monkindey
 * @date 2017-8-16
 * Credit to create-react-app
 */

'use strict';
process.env.NODE_ENV = 'test';

process.on('unhandledRejection', err => {
  throw err;
});

const jest = require('jest');
const argv = process.argv.slice(2);
const jestConfig = {
  // setupFiles: [require.resolve('../config/jest/setup')],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.js?(x)',
    '<rootDir>/src/**/?(*.)(spec|test).js?(x)',
    '<rootDir>/test/**/?(*.)(spec|test).js?(x)'
  ],
  transform: {
    '^.+\\.(js|jsx)$': require.resolve('../config/jest/transformer')
  },
  moduleNameMapper: {
    '^react$': require.resolve('../config/jest/mock/react.js'),
    '^react-test-renderer$': require.resolve(
      '../config/jest/mock/react-test-renderer.js'
    )
  },
  testEnvironment: 'node',
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$']
};

argv.push('--config', JSON.stringify(jestConfig));
jest.run(argv);
