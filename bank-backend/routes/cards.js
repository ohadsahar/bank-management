const express = require('express');
const cardService = require('../services/card.service');

const router = express.Router();

async function create(req, res) {
  try {
    const cardData = req.body;
    const resultOfCreate = await cardService.createCard(cardData);
    res.status(201).json({
      message: resultOfCreate,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
      success: false,
    });
  }
}
async function get(req, res) {
  try {
    const currentUsername = req.params.username;
    const resultOfAllCards = await cardService.getCards(currentUsername);
    res.status(200).json({
      message: resultOfAllCards,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
      success: false,
    });
  }
}
module.exports = router;
router.post('', create);
router.get('/:username', get);
