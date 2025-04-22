const { expect } = require('@playwright/test');

class WebTablesPage {
  constructor(page) {
    this.page = page;
    this.url  = 'https://www.way2automation.com/angularjs-protractor/webtables/';
  }

  // --- Locators ---
  get addUserButton() {
    return this.page.getByRole('button', { name: 'Add User' });
  }
  get firstName()   { return this.page.locator('input[name="FirstName"]'); }
  get lastName()    { return this.page.locator('input[name="LastName"]'); }
  get userName()    { return this.page.locator('input[name="UserName"]'); }
  get password()    { return this.page.locator('input[name="Password"]'); }
  get email()       { return this.page.locator('input[name="Email"]'); }
  get mobilePhone() { return this.page.locator('input[name="Mobilephone"]'); }
  get saveBtn()     { return this.page.getByRole('button', { name: 'Save' }); }
  get headers()     { return this.page.locator('thead tr.smart-table-header-row th span.header-content'); }

  // --- Navigation ---
  async navigate() {
    await this.page.goto(this.url);
    await this.addUserButton.waitFor({ state: 'visible' });
  }

  // --- Open the Add‑User modal, waiting for any old backdrop to clear ---
  async clickAddUser() {
    await this.page.locator('.modal-backdrop')
      .waitFor({ state: 'detached', timeout: 3000 })
      .catch(() => {});            // ignore if none
    await this.addUserButton.click();
    await this.firstName.waitFor({ state: 'visible' });
  }

  // --- Fill and save the user form, then wait for modal to close ---
  async addUser(user) {
    await this.firstName.fill(user.firstName);
    await this.lastName .fill(user.lastName);
    await this.userName .fill(user.username);
    await this.password .fill(user.password);

    // check the proper radio by its label text
    await this.page.getByLabel(user.company).check();

    // select role from the dropdown
    await this.page
      .locator('select[name="RoleId"]')
      .selectOption({ label: user.role });

    await this.email      .fill(user.email);
    await this.mobilePhone.fill(user.mobilePhone);

    await this.saveBtn.click();

    // wait for modal (and backdrop) to fully go away
    await this.firstName.waitFor({ state: 'detached' });
    await this.addUserButton.waitFor({ state: 'visible' });
  }

  // --- Helpers ---
  async getHeaderList() {
    return this.headers.allTextContents();
  }

  async isUserPresent(username) {
    return (await this.page
      .locator(`table.smart-table td:has-text("${username}")`)
      .count()) > 0;
  }
}

module.exports = WebTablesPage;
