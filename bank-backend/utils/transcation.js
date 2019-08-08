/* eslint-disable max-len */
const lodash = require('lodash');
const moment = require('moment');
const TransactionModel = require('../models/transaction');
const TransactionArchivesModel = require('../models/transaction-archives');
const SalaryModel = require('../models/salary');

async function getCurrentCategoryLargestExpense(username) {
  const currentMonth = moment().format('MMMM');
  const currentYear = new Date().getFullYear();
  const fetchedTransactions = await TransactionModel.find({
    username,
    monthPurchase: currentMonth,
    yearOfTransaction: currentYear,
  });
  const groupByDivisions = lodash(fetchedTransactions).groupBy('typeProduct')
    .map((items, typeProduct) => ({
      typeProduct,
      month: currentMonth,
      price: lodash.sumBy(items, 'eachMonth'),
    })).value();
  const maxCategory = lodash.maxBy(groupByDivisions, 'price');
  const minCategory = lodash.minBy(groupByDivisions, 'price');
  const totalExpense = lodash.sumBy(groupByDivisions, 'price');

  const allSalaryOfCurrentMonth = await SalaryModel.find({
    username,
    monthOfSalary: currentMonth,
  });
  const groupBySalary = lodash(allSalaryOfCurrentMonth).groupBy('monthOfSalary')
    .map((items, monthOfSalary) => ({
      monthOfSalary,
      salary: lodash.sumBy(items, 'salary'),
    })).value();
  const maxSalary = lodash.maxBy(groupBySalary, 'salary');
  return {
    largestExpense: maxCategory,
    salaryTotal: maxSalary,
    minimumExpense: minCategory,
    totalExpenseCash: totalExpense,
  };
}
async function groupCategories(transactions) {
  const groupByCardName = lodash(transactions).groupBy('cardName')
    .map((items, cardName) => ({
      cardName,
      price: lodash.sumBy(items, 'price'),
    })).value();
  // eslint-disable-next-line no-unused-vars
  const groupByMonth = lodash(transactions).groupBy('monthPurchase')
    .map((items, monthPurchase) => ({
      monthPurchase,
      eachMonth: lodash.sumBy(items, 'eachMonth'),
    })).value();

  const groupByDivisions = lodash(transactions).groupBy('typeProduct')
    .map((items, typeProduct) => ({
      typeProduct,
      price: lodash.sumBy(items, 'eachMonth'),
    })).value();
  const typeProductsOnly = lodash(transactions).groupBy('typeProduct')
    .map((items, typeProduct) => ({
      typeProduct,
    })).value();

  const businessNames = lodash(transactions).groupBy('name')
    .map((items, name) => ({
      name,
    })).value();
  return {
    groupedByCardName: groupByCardName,
    groupedByMonth: groupByMonth,
    groupedByCategoires: groupByDivisions,
    businessGroup: businessNames,
    productsGroup: typeProductsOnly,
  };
}
async function update(resultOfValidateTransactionData) {
  // eslint-disable-next-line no-underscore-dangle
  await TransactionModel.findByIdAndUpdate({
    // eslint-disable-next-line no-underscore-dangle
    _id: resultOfValidateTransactionData._id,
  }, resultOfValidateTransactionData);
}
async function deletePayment(transactionId) {
  await TransactionModel.findOneAndDelete({
    _id: transactionId,
  });
}
async function archivePayment(transaction) {
  const transactionSave = new TransactionArchivesModel({
    username: transaction.username,
    cardName: transaction.cardName,
    name: transaction.name,
    typeProduct: transaction.typeProduct,
    price: transaction.price,
    numberofpayments: transaction.numberofpayments,
    eachMonth: transaction.eachMonth,
    leftPayments: transaction.leftPayments,
    purchaseDate: transaction.purchaseDate,
    monthPurchase: transaction.monthPurchase,
  });
  await transactionSave.save();
}
async function paymentsTime(transactionData) {
  const dayOfMonth = moment().get('date');
  if (dayOfMonth === 10) {
    await transactionData.forEach((transaction) => {
      if (transaction.numberofpayments >= 0) {
        // eslint-disable-next-line no-param-reassign
        transaction.numberofpayments += 1;
        if (transaction.numberofpayments === transaction.leftPayments) {
          archivePayment(transaction);
          // eslint-disable-next-line no-underscore-dangle
          deletePayment(transaction._id);
        } else {
          update(transaction);
        }
      }
    });
  }
}
async function allBushinessNames(transcations) {
  let groupByBusinessName = lodash.uniqBy(transcations, 'name');
  groupByBusinessName = lodash(groupByBusinessName).groupBy('name')
    .map((items, name) => ({
      name,
    })).value();

  return {
    groupByBusinessName,
  };
}
module.exports = {
  groupCategories,
  paymentsTime,
  update,
  allBushinessNames,
  archivePayment,
  deletePayment,
  getCurrentCategoryLargestExpense,
};
