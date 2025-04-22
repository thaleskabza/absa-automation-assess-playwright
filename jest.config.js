module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        outputPath: './test-results/api-test-results/test-api-report.html',
        pageTitle: 'Jest Test Report',
        includeFailureMsg: true,
        includeConsoleLog: true
      },
    ],
  ],
};
