const UserModel = require('../models/users');

function createRegisterObject(registerData) {
  const userData = new UserModel({
    username: registerData.username,
    password: registerData.password,
  });
  return userData;
}
async function register(registerData) {
  const resultCreationObject = createRegisterObject(registerData);
  await resultCreationObject.save();
  return { message: 'נרשמת בהצלחה, מיד תחובר!' };
}


module.exports = {

  createRegisterObject,
  register,
};
