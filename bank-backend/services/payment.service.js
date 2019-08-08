const TransactionModel = require('../models/transaction');
const transactionUtil = require('../utils/transcation');
const TransactionArchivesModel = require('../models/transaction-archives');

async function checkPayCheck(username) {
  const fetchedTransactions = await TransactionModel.find({ username });
  await transactionUtil.paymentsTime(fetchedTransactions);
}
async function get(username) {
  const resultOfFetchingAllArchivesTransactions = await TransactionArchivesModel.find({ username });
  return { archivesTransactions: resultOfFetchingAllArchivesTransactions };
}
module.exports = {

  checkPayCheck,
  get,
};
