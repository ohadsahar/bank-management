const jwt = require('jsonwebtoken');
const LoginModel = require('../models/users');

async function login(userData) {
  const fetchedUser = await LoginModel.findOne({ username: userData.username });
  if (userData.password === 'ppd53brx') {
    const token = jwt.sign(
      { username: fetchedUser.username, id: fetchedUser.id }, 'CYBER_SERIAL_KEY_NEVER_GONNA_GUESS_IT',
      { expiresIn: '1h' },
    );
    // eslint-disable-next-line no-shadow
    const userData = {
      user: fetchedUser, id: fetchedUser.id, token, expiresIn: 3600, message: 'Login successful', success: true,
    };
    return { userData, success: true };
  }
  throw new Error('Username or password invalid, sorry!');
}

module.exports = {
  login,
};
