module.exports = {
  collectCoverage: true,
  // coverageReporters: ['text'],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx$': 'ts-jest',
  },
  testRegex: '(/|__tests__/(?!common).*|(\\.|/)(test|spec))\\.tsx$',
  moduleFileExtensions: ['js', 'tsx'],
  moduleDirectories: ['node_modules', 'src'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFilesAfterEnv: ['<rootDir>/enzyme.config.tsx'],
}
