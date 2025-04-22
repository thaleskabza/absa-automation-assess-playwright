class UserData {
    constructor({ firstName, lastName, username, password, company, role, email, mobilePhone }) {
      this.firstName   = firstName;
      this.lastName    = lastName;
      this.username    = username;
      this.password    = password;
      this.company     = company;
      this.role        = role;
      this.email       = email;
      this.mobilePhone = mobilePhone;
    }
  }
  module.exports = UserData;
  