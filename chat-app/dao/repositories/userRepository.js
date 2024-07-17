const User = require('../models/User');

class UserRepository {
  async getByUsername(username) {
    return await User.findOne({ username });
  }

  async create(userData) {
    return await User.create(userData);
  }
}

module.exports = new UserRepository();
