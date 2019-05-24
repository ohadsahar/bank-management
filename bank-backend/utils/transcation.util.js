const lodash = require('lodash');

async function groupCategoreis(transcations) {

    let groupByCardName = lodash(transcations).groupBy('cardName')
    .map((items, cardName) => ({cardName, price: lodash.sumBy(items, 'price')})).value();
    return {groupedByCardName: groupByCardName};
    
}




module.exports = {

    groupCategoreis
}