/* eslint-disable max-len */
const lodash = require('lodash');
const moment = require('moment');
const TransactionModel = require('../models/transaction');

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
      price: lodash.sumBy(items, 'price'),
    })).value();
  return {
    groupedByCardName: groupByCardName,
    groupedByMonth: groupByMonth,
  };
}
async function update(resultOfValidateTransactionData) {
  // eslint-disable-next-line no-underscore-dangle
  await TransactionModel.findByIdAndUpdate({
    // eslint-disable-next-line no-underscore-dangle
    _id: resultOfValidateTransactionData._id,
  }, resultOfValidateTransactionData);
}
async function paymentsTime(transactionData) {
  const dayOfMonth = moment().get('date');
  if (dayOfMonth === 10) {
    transactionData.forEach((transaction) => {
      if (transaction.numberofpayments > 0) {
        // eslint-disable-next-line no-param-reassign
        transaction.numberofpayments -= 1;
        update(transaction);
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
};
