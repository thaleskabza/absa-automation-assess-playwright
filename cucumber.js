module.exports = {
  default: {
    // Specify the feature files to execute
    paths: ['UI_Tests/features/**/*.feature'],

    // Load step definitions (and any other support files) before executing
    require: [
      'UI_Tests/models/**/*.js',
      'UI_Tests/pages/**/*.js',
      'UI_Tests/step-definitions/**/*.js'
    ],

    // Define output formats for reports and console feedback
    format: [
      'html:test-results/ui-test-results/cucumber-report.html',
      'json:test-results/ui-test-results/test-ui-report.json',
      'progress-bar',
      '@cucumber/pretty-formatter'
    ],

    // Publish results to the Cucumber Reports service
    publish: true,
    CUCUMBER_PUBLISH_TOKEN: '5b46fc16-e885-4873-9720-6200c18fb246'
  }
};



