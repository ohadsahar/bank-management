const mongoose = require('mongoose');

const transaction = mongoose.Schema({
  username: { type: String, required: true },
  cardName: { type: String, required: true },
  name: { type: String, required: true },
  typeProduct: { type: String, required: true },
  price: { type: Number, required: true },
  numberofpayments: { type: Number, required: true },
  eachMonth: { type: Number, required: true },
  leftPayments: { type: Number, required: true },
  purchaseDate: { type: String, required: true },
  monthPurchase: { type: String, required: true },
  yearOfTransaction: { type: Number, required: true },
  billingDate: { type: Number, required: true },
});
module.exports = mongoose.model('transaction', transaction);
