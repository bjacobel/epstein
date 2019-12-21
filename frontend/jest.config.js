module.exports = {
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: ['polyfills.js'],
  moduleNameMapper: {
    '^.+\\.css$': '<rootDir>/__mocks__/stylesheets.js',
  },
  transformIgnorePatterns: [
    // Change MODULE_NAME_HERE to your module that isn't being compiled
    '/node_modules/(?!@apollo/client/utilities/observables/).+\\.js$',
  ],
  moduleDirectories: [__dirname, 'node_modules', 'src'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  testURL: 'http://localhost',
};
