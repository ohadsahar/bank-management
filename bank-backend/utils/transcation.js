const lodash = require('lodash');

async function groupCategories(transcations) {
  const groupByCardName = lodash(transcations).groupBy('cardName')
    .map((items, cardName) => ({ cardName, price: lodash.sumBy(items, 'price') })).value();

  // eslint-disable-next-line no-unused-vars
  const groupByMonth = lodash(transcations).groupBy('monthPurchase')
    .map((items, purchaseDate) => ({ purchaseDate, price: lodash.sumBy(items, 'price') })).value();
  return { groupedByCardName: groupByCardName };
}

module.exports = {

  groupCategories,
};
