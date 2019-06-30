
const validatorUtil = require('../utils/validator');
const SalaryModel = require('../models/salary');

async function create(salaryData) {
  const afterValidateData = await validatorUtil.validateSalary(salaryData);
  const salaryDataSave = new SalaryModel({
    salary: afterValidateData.salary,
    monthOfSalary: afterValidateData.salaryMonth,
  });
  await salaryDataSave.save();
  return salaryDataSave;
}

async function get() {
  const allSalary = await SalaryModel.find();
  return allSalary;
}

module.exports = {

  create,
  get,
};
