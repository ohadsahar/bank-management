const lodash = require('lodash');

async function groupCategoreis(transcations) {

    // const count = lodash(this.TopFiveBuyers)
    // .groupBy('userid')
    // .map((items, name) => ({ name, totalPrice: lodash.sumBy(items, 'ordertotal') }))
    // .value();

    
    let groupByCardName = lodash(transcations).groupBy('cardName')
    .map((items, cardName) => ({cardName, price: lodash.sumBy(items, 'price')})).value();
    return {groupedByCardName: groupByCardName};
    
}




module.exports = {

    groupCategoreis
}