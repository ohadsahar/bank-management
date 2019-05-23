const transactionModel = require('../models/transaction');
const transcationUtil = require('../utils/transcation.util');
const moment = require('moment');
async function register(transcationData) {
    
    const transcationToCreate = new transactionModel({

        cardName: transcationData.cardName,
        name: transcationData.name,
        typeProduct: transcationData.typeProduct,
        price: transcationData.price,
        numberofpayments: transcationData.numberofpayments,
        eachMonth: transcationData.eachMonth,
        leftPayments: transcationData.leftPayments,
        purchaseDate: transcationData.purchaseDate
    })
    await transcationToCreate.save();
    return {transactionSaved: transcationToCreate}

}
async function get() {

    const fetchedTranscations = await transactionModel.find();
    const resultLodashTranscations = await transcationUtil.groupCategoreis(fetchedTranscations);
    return {foundTranscations: fetchedTranscations, chartGroupByCardName: resultLodashTranscations.groupedByCardName};
}
async function updatePurchaseDate() {

    console.log('im here');

}
async function deleteX(transcationId) {

    await transactionModel.findOneAndDelete({_id: transcationId});
}




module.exports = {

    register,
    get,
    deleteX,
    updatePurchaseDate
}