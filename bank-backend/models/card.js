const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
  username: { type: String, required: true },
  cardName: { type: String, required: true },
  billingDate: { type: Number, required: true },
});

module.exports = mongoose.model('cardSchema', cardSchema);
