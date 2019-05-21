const transactionModel = require('../models/transaction');

async function register(transcationData) {
    
    const transactionData = new transactionModel({

        cardName: transcationData.cardName,
        name: transcationData.name,
        typeProduct: transcationData.typeProduct,
        price: transcationData.price,
        numberofpayments: transcationData.numberofpayments,
        eachMonth: transcationData.eachMonth,
        leftPayments: transcationData.leftPayments
    })
    await transactionData.save();
    return {transactionSaved: transactionData}

}

async function get() {

    const fetchedTranscations = await transactionModel.find();
    return {foundTranscations: fetchedTranscations};
}





module.exports = {

    register,
    get
}