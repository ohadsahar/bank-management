const TransactionModel = require('../models/transaction');
const transactionUtil = require('../utils/transcation');

async function checkPayCheck() {
  const fetchedTransactions = await TransactionModel.find();
  await transactionUtil.paymentsTime(fetchedTransactions);
}


module.exports = {

  checkPayCheck,
};
