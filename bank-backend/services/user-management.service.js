const validatorUtil = require('../utils/validator');
const userManagementUtil = require('../utils/user-management');

async function register(registerData) {
  validatorUtil.validateRegisterData(registerData);
  const resultOfCreationNewUser = await userManagementUtil.register(registerData);
  return { registerData, resultOfCreationNewUser };
}

module.exports = {
  register,
};
