const lodash = require('lodash');

async function groupCategoreis(transcations) {


    console.log(transcations);
    const groupByCardName = lodash(transcations).groupBy('cardName')
    .map((items, cardName) => ({cardName, price: lodash.sumBy(items, 'price')})).value();

    const groupByMonth = lodash(transcations).groupBy('monthPurchase')
    .map((items, purchaseDate) => ({purchaseDate, price: lodash.sumBy(items, 'price')})).value();
    console.log(groupByMonth);
    return {groupedByCardName: groupByCardName};
    
}




module.exports = {

    groupCategoreis
}