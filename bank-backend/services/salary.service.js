
const validatorUtil = require('../utils/validator');
const SalaryModel = require('../models/salary');
const salaryUtil = require('../utils/salary');

async function create(salaryData) {
  const afterValidateData = await validatorUtil.validateSalary(salaryData);
  const salaryDataSave = new SalaryModel({
    username: afterValidateData.username,
    salary: afterValidateData.salary,
    monthOfSalary: afterValidateData.salaryMonth,
  });
  await salaryDataSave.save();
  return salaryDataSave;
}
async function get(username) {
  const allSalary = await SalaryModel.find({ username });
  const allSalaryByMonth = await salaryUtil.allSalaryByMonth(allSalary);
  return { salary: allSalary, salaryByMonth: allSalaryByMonth };
}
async function deleteSalary(salaryId) {
  const resultOfValidationOfSalaryId = validatorUtil.validateBeforeDelete(salaryId);
  await SalaryModel.findOneAndDelete({ _id: resultOfValidationOfSalaryId });
  return { salaryId };
}
async function updateSalary(salaryData) {
  /* eslint-disable no-underscore-dangle */
  await SalaryModel.findByIdAndUpdate({ _id: salaryData._id }, salaryData);
  return salaryData;
}
module.exports = {
  create,
  get,
  deleteSalary,
  updateSalary,
};
