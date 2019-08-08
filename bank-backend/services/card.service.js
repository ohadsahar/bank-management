const CardSchema = require('../models/card');
const cardValidator = require('../utils/validator');

async function createCard(cardData) {
  const resultOfValidation = cardValidator.validateCardData(cardData);
  const newCard = new CardSchema({
    username: resultOfValidation.username,
    cardName: resultOfValidation.cardName,
    billingDate: resultOfValidation.billingDate,
  });
  const resultOfCreate = await newCard.save();
  return resultOfCreate;
}
async function getCards(username) {
  const resultOfAllCards = await CardSchema.find({ username });
  return resultOfAllCards;
}
async function deleteCard(id) {
  const resultOfDeleteCard = await CardSchema.deleteOne({ _id: id });
  return resultOfDeleteCard;
}

async function updateCard(cardData) {
  // eslint-disable-next-line no-underscore-dangle
  await CardSchema.findByIdAndUpdate({ _id: cardData._id }, cardData);
  return cardData;
}
module.exports = {
  createCard,
  getCards,
  deleteCard,
  updateCard,
};
