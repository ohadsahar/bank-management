const validator = require('validator');
const moment = require('moment');

async function validateUpdateData(transactionData) {
  if (validator.isLength(transactionData.cardName, { min: 3 })
        && validator.isLength(transactionData.name, { min: 4 })
        && validator.isLength(transactionData.typeProduct, { min: 4 })) {
    return transactionData;
  }
  throw new Error('One of the transaction data is invalid, transactionData did not passed the validator test');
}

async function validateSalary(salaryData) {
  const currentMonth = moment().month() + 1;
  if (salaryData) {
    const salaryObject = {
      salary: salaryData.salary,
      salaryMonth: currentMonth,
    };
    return salaryObject;
  }
  throw new Error('Salary data is not numeric!!');
}

function validateRegisterData(registerData) {
  if (validator.isEmail(registerData.username) && validator.isLength(registerData.password, { min: 8, max: 8 })) {
    return true;
  }
  throw new Error('Validation of register new user has problem with data!');
}

module.exports = {

  validateUpdateData,
  validateSalary,
  validateRegisterData,
};
