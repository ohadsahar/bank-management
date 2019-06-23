/* eslint-disable max-len */
const lodash = require('lodash');
const moment = require('moment');
const TransactionModel = require('../models/transaction');

async function groupCategories(transcations) {
  const groupByCardName = lodash(transcations).groupBy('cardName')
    .map((items, cardName) => ({
      cardName,
      price: lodash.sumBy(items, 'price'),
    })).value();

  // eslint-disable-next-line no-unused-vars
  const groupByMonth = lodash(transcations).groupBy('monthPurchase')
    .map((items, purchaseDate) => ({
      purchaseDate,
      price: lodash.sumBy(items, 'price'),
    })).value();
  return {
    groupedByCardName: groupByCardName,
  };
}
async function update(resultOfValidateTransactionData) {
  // eslint-disable-next-line no-underscore-dangle
  await TransactionModel.findByIdAndUpdate({ _id: resultOfValidateTransactionData._id }, resultOfValidateTransactionData);
}
async function paymentsTime(transactionData) {
  const dayOfMonth = moment().get('date');
  if (dayOfMonth === 23) {
    transactionData.forEach((transaction) => {
      if (transaction.numberofpayments > 0) {
        // eslint-disable-next-line no-param-reassign
        transaction.numberofpayments -= 1;
        update(transaction);
      }
    });
  }
}

module.exports = {

  groupCategories,
  paymentsTime,
  update,
};
