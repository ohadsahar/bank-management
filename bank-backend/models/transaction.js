const mongoose = require('mongoose');

const transaction = mongoose.Schema({

    cardName: {type: String, required: true},
    name: {type: String, required: true},
    typeProduct: {type: String, required: true},
    price: {type: Number, required: true},
    numberofpayments:{type: String, required: true},
    eachMonth: {type: String, required: true},
    leftPayments: {type: String, required: true},

})

module.exports = mongoose.model("transaction",transaction);