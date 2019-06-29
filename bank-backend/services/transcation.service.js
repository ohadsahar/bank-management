const TransactionModel = require('../models/transaction');
const transactionUtil = require('../utils/transcation');
const validatorUtil = require('../utils/validator');

async function register(transactionData) {
  const transactionToCreate = new TransactionModel({
    cardName: transactionData.cardName,
    name: transactionData.name,
    typeProduct: transactionData.typeProduct,
    price: transactionData.price,
    numberofpayments: transactionData.numberofpayments,
    eachMonth: transactionData.eachMonth,
    leftPayments: transactionData.leftPayments,
    purchaseDate: transactionData.purchaseDate,
    monthPurchase: transactionData.monthPurchase,
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
  await TransactionModel.findOneAndDelete({
    _id: transactionId,
  });
}
async function getCharts() {
  console.log('one');
  const fetchedTransactions = await TransactionModel.find();
  const resultLodashTransactions = await transactionUtil.groupCategories(fetchedTransactions);
  return {
    chartGroupByCardName: resultLodashTransactions.groupedByCardName,
  };
}

async function get() {
  console.log('two');
  const fetchedTransactions = await TransactionModel.find();
  const resultLodashTransactions = await transactionUtil.groupCategories(fetchedTransactions);
  const resultOfAllBushinessNames = await transactionUtil.allBushinessNames(fetchedTransactions);
  return {
    foundTranscations: fetchedTransactions,
    bushinessNames: resultOfAllBushinessNames,
    chartGroupByCardName: resultLodashTransactions.groupedByCardName,
  };
}
async function checkPayCheck() {
  const fetchedTransactions = await TransactionModel.find();
  await transactionUtil.paymentsTime(fetchedTransactions);
}


module.exports = {

  register,
  get,
  deleteX,
  getCharts,
  updatePurchaseDate,
  checkPayCheck,
};
