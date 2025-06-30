export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js', // Exclude server startup file
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup-simple.js'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(supertest)/)'
  ],
  testTimeout: 15000, // 15 second timeout for all tests
  detectOpenHandles: true, // Help detect connection leaks
  forceExit: true // Force exit after tests complete
};