// UI_Tests/step-definitions/steps.js
const { Given, When, Then, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const { expect }  = require('@playwright/test');                // for snapshot assertions
const parse         = require('csv-parse/sync').parse;
const fs            = require('fs');
const path          = require('path');
const WebTablesPage = require('../pages/WebTablesPage');
const UserData      = require('../models/UserData');

setDefaultTimeout(60000);

// Directories for artifacts
const SCREENSHOT_DIR = path.join('test-results', 'ui-test-results', 'screenShots');
const VIDEO_DIR      = path.join('test-results', 'ui-test-results', 'videos');
if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
if (!fs.existsSync(VIDEO_DIR))      fs.mkdirSync(VIDEO_DIR,      { recursive: true });

// --- Global Hooks ---
Before(async function () {
  const isHeadless = process.env.HEADLESS !== 'false';
  this.browser = await chromium.launch({ headless: isHeadless });
  this.context = await this.browser.newContext({
    recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 720 } }
  });

  this.page = await this.context.newPage();
  this.webTables = new WebTablesPage(this.page);
});

// --- Page-level Smoke Hook (isVisible + screenshot + ARIA snapshot) ---
// --- Page-level Smoke Hook for @webtables tag ---
Before({ tags: '@webtables' }, async function (scenario) {
  // 1) Navigate to WebTables
  await this.page.goto('https://www.way2automation.com/angularjs-protractor/webtables/');
  await saveScreenshot(this.page, 'navigate', this.attach);
  
  // 2) Ensure the app root container is visible
  await this.page.getByRole('columnheader', { name: 'First Name' }).waitFor({ state: 'visible', timeout: 5000 });


  // 3) Capture & compare against baseline snapshot
  const baselineDir = path.join('tests', 'smoke-snapshots');
  if (!fs.existsSync(baselineDir)) fs.mkdirSync(baselineDir, { recursive: true });
  const snapName = 'webtables-smoke.png';

  const screenshotBuffer = await this.page.screenshot({ fullPage: true });
  await expect(screenshotBuffer)
    .toMatchSnapshot(path.join(baselineDir, snapName), { maxDiffPixelRatio: 0.01 });


  // 2) Full-page screenshot vs baseline

  if (!fs.existsSync(baselineDir)) fs.mkdirSync(baselineDir, { recursive: true });

  const buffer   = await this.page.screenshot({ fullPage: true });
  await expect(buffer)
    .toMatchSnapshot(path.join(baselineDir, snapName), { maxDiffPixelRatio: 0.01 });

  // 3) ARIA snapshot vs template (inline YAML)
  await expect(this.page.locator('body')).toMatchAriaSnapshot(`
- document:
  - table:
    - rowgroup:
      - row:
        - cell:
          - textbox "Search"
      - row "Add User":
        - cell "Add User":
          - button "Add User"
      - row "First Name Last Name User Name Customer Role E-mail Cell Phone Locked":
        - cell "First Name"
        - cell "Last Name"
        - cell "User Name"
        - cell "Customer"
        - cell "Role"
        - cell "E-mail"
        - cell "Cell Phone"
        - cell "Locked"
        - cell
        - cell
    - rowgroup:
      - row "Tom Blue matt Company BBB Customer matt@comp.com 111222333 Edit":
        - cell "Tom"
        - cell "Blue"
        - cell "matt"
        - cell "Company BBB"
        - cell "Customer"
        - cell "matt@comp.com"
        - cell "111222333"
        - cell:
          - checkbox [checked] [disabled]
        - cell "Edit":
          - button "Edit"
        - cell:
          - button
      - row "sale sale sale Sales Team sales@comp.com 777111223 Edit":
        - cell "sale"
        - cell "sale"
        - cell "sale"
        - cell
        - cell "Sales Team"
        - cell "sales@comp.com"
        - cell "777111223"
        - cell:
          - checkbox [disabled]
        - cell "Edit":
          - button "Edit"
        - cell:
          - button
      - row "Mark Novak novak Company AAA Customer asa@asd.cz 777888444 Edit":
        - cell "Mark"
        - cell "Novak"
        - cell "novak"
        - cell "Company AAA"
        - cell "Customer"
        - cell "asa@asd.cz"
        - cell "777888444"
        - cell:
          - checkbox [disabled]
        - cell "Edit":
          - button "Edit"
        - cell:
          - button
      - row "testadmin testadmin testadmin Admin test@test.cz 777888999 Edit":
        - cell "testadmin"
        - cell "testadmin"
        - cell "testadmin"
        - cell
        - cell "Admin"
        - cell "test@test.cz"
        - cell "777888999"
        - cell:
          - checkbox [disabled]
        - cell "Edit":
          - button "Edit"
        - cell:
          - button
      - row "admin admin admin Admin admin@comp.com 777888999 Edit":
        - cell "admin"
        - cell "admin"
        - cell "admin"
        - cell
        - cell "Admin"
        - cell "admin@comp.com"
        - cell "777888999"
        - cell:
          - checkbox [disabled]
        - cell "Edit":
          - button "Edit"
        - cell:
          - button
      - row "test test test Company BBB Customer test@test.cz 789456123 Edit":
        - cell "test"
        - cell "test"
        - cell "test"
        - cell "Company BBB"
        - cell "Customer"
        - cell "test@test.cz"
        - cell "789456123"
        - cell:
          - checkbox [disabled]
        - cell "Edit":
          - button "Edit"
        - cell:
          - button
      - row "testsale testsale testsale Sales Team testsale@test.cz 789456123 Edit":
        - cell "testsale"
        - cell "testsale"
        - cell "testsale"
        - cell
        - cell "Sales Team"
        - cell "testsale@test.cz"
        - cell "789456123"
        - cell:
          - checkbox [disabled]
        - cell "Edit":
          - button "Edit"
        - cell:
          - button
    - rowgroup:
      - row "< 1 >":
        - cell "< 1 >":
          - list:
            - listitem: <
            - listitem: "1"
            - listitem: ">"
  - region "Notifications (F8)":
    - list
  - iframe
  - button "logo icon":
    - img "logo icon"
    - img
  - button
  `);
});

// --- After hook to finalize artifacts ---
After(async function (scenario) {
  // fetch and attach video
  await this.page.close();
  await this.context.close();
  const videoPath = await this.page.video().path();
  if (this.attach) {
    const videoFile = fs.readFileSync(videoPath);
    this.attach(videoFile, 'video/webm');
  }
  await this.browser.close();
});

// --- Helper to save screenshots during functional steps ---
async function saveScreenshot(page, name, attach) {
  const ts   = Date.now();
  const file = path.join(SCREENSHOT_DIR, `${name}-${ts}.png`);
  await page.screenshot({ path: file, fullPage: true });
  if (attach) attach(fs.readFileSync(file), 'image/png');
}

// --- Navigation & headers ---
Given('User navigate to {string}', async function (url) {
  await this.webTables.navigate();
  await saveScreenshot(this.page, 'navigate', this.attach);
});

Then('User should see the user list table with headers:', async function (dataTable) {
  const expected = dataTable.raw().flat();
  const actual   = await this.webTables.getHeaderList();
  if (expected.length !== actual.length || expected.some((h,i) => h !== actual[i])) {
    throw new Error(`Headers mismatch\nExpected: ${expected}\nActual: ${actual}`);
  }
  await saveScreenshot(this.page, 'headers', this.attach);
});



// --- Generic click step ---
When('User click {string}', async function (buttonText) {
  await this.webTables.clickAddUser();
  const safeText = buttonText.replace(/\W+/g, '_');
  await saveScreenshot(this.page, `click_${safeText}`, this.attach);
});

// --- Inline DataTable users ---
When('User add a user with data:', async function (dataTable) {
  for (const row of dataTable.hashes()) {
    const uniqueName = `${row.userName}_${Date.now()}`;
    const user = new UserData({
      firstName:   row.firstName,
      lastName:    row.lastName,
      username:    uniqueName,
      password:    row.password,
      company:     row.customer,
      role:        row.role,
      email:       row.email,
      mobilePhone: row.cellPhone
    });
    this.latestUser = user;
    await this.webTables.addUser(user);
    await saveScreenshot(this.page, `addUser_${uniqueName}`, this.attach);
  }
});

Then('User should see the user {string} in the user list with details:', async function (username, dataTable) {
  if (!await this.webTables.isUserPresent(username)) {
    throw new Error(`User not found: ${username}`);
  }
  await saveScreenshot(this.page, `verify_${username}`, this.attach);
});


// --- CSV-driven user ---
Given('User load user data from CSV file {string} row {int}', async function (fileName, rowIndex) {
  const csv     = fs.readFileSync(`./UI_Tests/testdata/${fileName}`, 'utf-8');
  const records = parse(csv, { columns: true });
  const row     = records[rowIndex];
  this.latestUser = new UserData({
    firstName:   row.FirstName,
    lastName:    row.LastName,
    username:    `${row.Username}_${Date.now()}`,
    password:    row.Password,
    company:     row.Company,
    role:        row.Role,
    email:       row.Email,
    mobilePhone: row.CellPhone
  });
  await saveScreenshot(this.page, `loadCSV_${rowIndex}`, this.attach);
});

When('User add the latest user', async function () {
  await this.webTables.clickAddUser();
  await this.webTables.addUser(this.latestUser);
  await saveScreenshot(this.page, `addLatest_${this.latestUser.username}`, this.attach);
});

Then('User should see the latest user in the user list', async function () {
  if (!await this.webTables.isUserPresent(this.latestUser.username)) {
    throw new Error(`Latest user not found: ${this.latestUser.username}`);
  }
  await saveScreenshot(this.page, `verifyLatest_${this.latestUser.username}`, this.attach);
});
