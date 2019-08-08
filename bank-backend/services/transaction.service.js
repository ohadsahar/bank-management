const moment = require('moment');
const TransactionModel = require('../models/transaction');
const transactionUtil = require('../utils/transcation');
const validatorUtil = require('../utils/validator');

async function register(transactionData) {
  transactionData.purchaseDate = moment(transactionData.purchaseDate).format('L');
  const transactionToCreate = new TransactionModel({
    cardName: transactionData.cardName,
    username: transactionData.username,
    name: transactionData.name,
    typeProduct: transactionData.typeProduct,
    price: transactionData.price,
    numberofpayments: transactionData.numberofpayments,
    eachMonth: transactionData.eachMonth,
    leftPayments: transactionData.leftPayments,
    purchaseDate: transactionData.purchaseDate,
    monthPurchase: transactionData.monthPurchase,
    yearOfTransaction: transactionData.yearOfTransaction,
  });
  await transactionToCreate.save();
  return {
    transactionSaved: transactionToCreate,
  };
}
async function updatePurchaseDate(transactionData) {
  const resultOfValidateTransactionData = await validatorUtil.validateUpdateData(transactionData);
  await transactionUtil.update(resultOfValidateTransactionData);
  return {
    bankData: resultOfValidateTransactionData,
  };
}
async function deleteX(transactionId) {
  await TransactionModel.findOneAndDelete({ _id: transactionId });
}
async function getCharts(username) {
  const currentYear = new Date().getFullYear();
  const fetchedTransactions = await TransactionModel.find({ username, yearOfTransaction: currentYear });
  const resultLodashTransactions = await transactionUtil.groupCategories(fetchedTransactions);
  return {
    chartGroupByCardName: resultLodashTransactions.groupedByCardName,
    chartGroupByMonth: resultLodashTransactions.groupedByMonth,
    chartGroupByDivision: resultLodashTransactions.groupedByCategoires,
  };
}
async function get(username) {
  const currentYear = new Date().getFullYear();
  const fetchedTransactions = await TransactionModel.find({ username, yearOfTransaction: currentYear });
  const resultLodashTransactions = await transactionUtil.groupCategories(fetchedTransactions);
  const resultOfAllBushinessNames = await transactionUtil.allBushinessNames(fetchedTransactions);
  return {
    foundTranscations: fetchedTransactions,
    bushinessNames: resultOfAllBushinessNames,
    chartGroupByCardName: resultLodashTransactions.groupedByCardName,
    chartGroupByMonth: resultLodashTransactions.groupedByMonth,
    groupOfCategories: resultLodashTransactions.productsGroup,
    groupOfbusiness: resultLodashTransactions.businessGroup,
  };
}
async function getTransactionById(id) {
  const resultOfFetchTransaction = await TransactionModel.findById({ _id: id });
  if (resultOfFetchTransaction) {
    return { fetchedTransaction: resultOfFetchTransaction };
  }
  throw new Error('There is a problem with fetching specific transaction!');
}
async function getCurrentCategoryExpense(username) {
  const resultOfCurrentCategoryExpense = await transactionUtil.getCurrentCategoryLargestExpense(username);
  return { resultOfCurrentCategoryExpense };
}
module.exports = {
  register,
  get,
  deleteX,
  getCharts,
  updatePurchaseDate,
  getTransactionById,
  getCurrentCategoryExpense,
};
