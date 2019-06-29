const TransactionModel = require('../models/transaction');
const transactionUtil = require('../utils/transcation');
const TransactionArchivesModel = require('../models/transaction-archives');

async function checkPayCheck() {
  const fetchedTransactions = await TransactionModel.find();
  await transactionUtil.paymentsTime(fetchedTransactions);
}

async function get() {
  const resultOfFetchingAllArchivesTransactions = await TransactionArchivesModel.find();
  return { archivesTransactions: resultOfFetchingAllArchivesTransactions };
}


module.exports = {

  checkPayCheck,
  get,
};
