class User {
  constructor(name, email, password) {
    this.id = Date.now().toString();
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = new Date().toISOString();
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;
