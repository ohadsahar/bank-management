const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, 'CYBER_SERIAL_KEY_NEVER_GONNA_GUESS_IT');
    next();
  } catch (error) {
    res.status(401).json({
      message: error,
    });
  }
};
