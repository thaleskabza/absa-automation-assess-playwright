@webtables
Feature: Web Tables Page-level Smoke Tests

  Scenario: Smoke-check WebTables shell is visible and matches baseline
    Given User navigate to "http://www.way2automation.com/angularjs-protractor/webtables/"
    Then the page root "#app" should be visible
    And the page matches its smoke snapshot "webtables-smoke.png"