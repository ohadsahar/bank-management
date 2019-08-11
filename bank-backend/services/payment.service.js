const TransactionModel = require('../models/transaction');
const transactionUtil = require('../utils/transcation');
const TransactionArchivesModel = require('../models/transaction-archives');
const CardModel = require('../models/card');

async function checkPayCheck(username) {
  const fetchedTransactions = await TransactionModel.find({ username });
  const allCardsUsername = await CardModel.find({ username }).select('billingDate');
  await transactionUtil.paymentsTime(fetchedTransactions, allCardsUsername);
}
async function get(username) {
  const resultOfFetchingAllArchivesTransactions = await TransactionArchivesModel.find({ username });
  return { archivesTransactions: resultOfFetchingAllArchivesTransactions };
}
module.exports = {

  checkPayCheck,
  get,
};
