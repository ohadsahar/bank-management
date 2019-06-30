
const validatorUtil = require('../utils/validator');
const SalaryModel = require('../models/salary');
const salaryUtil = require('../utils/salary');

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
  const allSalaryByMonth = await salaryUtil.allSalaryByMonth(allSalary);
  return { salary: allSalary, salaryByMonth: allSalaryByMonth };
}

module.exports = {

  create,
  get,
};
