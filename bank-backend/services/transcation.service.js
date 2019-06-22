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
  return { transactionSaved: transactionToCreate };
}
async function get() {
  const fetchedTransactions = await TransactionModel.find();
  const resultLodashTransactions = await transactionUtil.groupCategories(fetchedTransactions);
  return {
    foundTranscations: fetchedTransactions,
    chartGroupByCardName: resultLodashTransactions.groupedByCardName,
  };
}
async function updatePurchaseDate(transactionData) {
  const resultOfValidateTransactionData = await validatorUtil.validateUpdateData(transactionData);
  // eslint-disable-next-line no-underscore-dangle
  await TransactionModel.findByIdAndUpdate({ _id: resultOfValidateTransactionData._id },
    resultOfValidateTransactionData);
  return { bankData: resultOfValidateTransactionData };
}
async function deleteX(transactionId) {
  await TransactionModel.findOneAndDelete({ _id: transactionId });
}
async function getCharts() {
  const fetchedTransactions = await TransactionModel.find();
  const resultLodashTransactions = await transactionUtil.groupCategories(fetchedTransactions);
  return { chartGroupByCardName: resultLodashTransactions.groupedByCardName };
}


module.exports = {

  register,
  get,
  deleteX,
  getCharts,
  updatePurchaseDate,
};
