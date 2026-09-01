module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  clearMocks: true,
  collectCoverageFrom: ['controllers/**/*.js', 'utils/**/*.js', 'middlewares/**/*.js'],
  coverageDirectory: 'coverage',
};
