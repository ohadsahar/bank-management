const validator = require('validator');

async function validateUpdateData(transactionData) {
  if (validator.isLength(transactionData.cardName, { min: 3 })
        && validator.isLength(transactionData.name, { min: 4 })
        && validator.isLength(transactionData.typeProduct, { min: 4 })) {
    return transactionData;
  }
  console.log('here');
  throw new Error('One of the transaction data is invalid, transactionData did not passed the validator test');
}

module.exports = {

  validateUpdateData,
};
