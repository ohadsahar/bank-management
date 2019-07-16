/* eslint-disable max-len */
const lodash = require('lodash');
const moment = require('moment');
const TransactionModel = require('../models/transaction');
const TransactionArchivesModel = require('../models/transaction-archives');

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
      price: lodash(transactions).sumBy('eachMonth'),
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
async function deletePayment(transactionId) {
  await TransactionModel.findOneAndDelete({ _id: transactionId });
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
        transaction.numberofpayments -= 1;
        if (transaction.numberofpayments <= 0) {
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
};
