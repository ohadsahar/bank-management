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
async function deleteCard(req, res) {
  try {
    const idToDelete = req.params.id;
    await cardService.deleteCard(idToDelete);
    res.status(200).json({
      message: idToDelete,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
      success: false,
    });
  }
}
async function update(req, res) {
  try {
    const cardData = req.body;
    const resultOfUpdate = await cardService.updateCard(cardData);
    res.status(200).json({
      message: resultOfUpdate,
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
router.put('', update);
router.delete('/:id', deleteCard);
