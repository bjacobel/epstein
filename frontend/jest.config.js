module.exports = {
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: ['polyfills.js'],
  moduleNameMapper: {
    '^.+\\.css$': '<rootDir>/__mocks__/stylesheets.js',
    '^apollo-link$': '@apollo/client',
  },
  moduleDirectories: [__dirname, 'node_modules', 'src'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  testURL: 'http://localhost',
};
