const lodash = require('lodash');

async function allSalaryByMonth(salaryData) {
  const groupByMonthSalary = lodash(salaryData).groupBy('monthOfSalary')
    .map((items, monthOfSalary) => ({
      monthOfSalary,
      salary: lodash.sumBy(items, 'salary'),
    })).value();
  return groupByMonthSalary;
}

module.exports = {
  allSalaryByMonth,
};
