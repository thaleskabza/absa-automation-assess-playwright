# features/webtables.feature
Feature: Web Tables User Management

  Background:
    Given User navigate to "http://www.way2automation.com/angularjs-protractor/webtables/"

  Scenario: Validate User List Table page
    Then User should see the user list table with headers:
      | First Name | Last Name | User Name | Customer   | Role     | E-mail | Cell Phone | Locked | | |

  Scenario: Add two users via inline DataTable and verify
    When User click "Add User"
    And User add a user with data:
      | firstName | lastName | userName  | password | customer    | role      | email             | cellPhone |
      | FName1    | LName1   | User1     | Pass1    | Company AAA | Admin     | admin@mail.com    | 082555    |
      
    Then User should see the user "User1" in the user list with details:
      | First Name | Last Name | User Name | Customer   | Role     | E-mail           | Cell Phone |
      | FName1     | LName1    | User1     | Company AAA| Admin    | admin@mail.com   | 082555     |

  Scenario: Add a user from CSV and verify in list
    Given User load user data from CSV file "users.csv" row 0
    When User add the latest user
    Then User should see the latest user in the user list
