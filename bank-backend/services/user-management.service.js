const validatorUtil = require('../utils/validator');
const userManagementUtil = require('../utils/user-management');

async function register(registerData) {
  validatorUtil.validateRegisterData(registerData);
  const resultOfCreationNewUser = await userManagementUtil.register(registerData);
  return { message: resultOfCreationNewUser.message };
}

module.exports = {
  register,
};
