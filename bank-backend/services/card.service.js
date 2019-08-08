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

module.exports = {
  createCard,
  getCards,
};
