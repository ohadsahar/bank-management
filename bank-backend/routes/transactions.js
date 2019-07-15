const express = require('express');

const router = express.Router();
const transactionService = require('../services/transaction.service');

async function create(req, res) {
  try {
    const transactionData = req.body;
    const resultOfRegister = await transactionService.register(transactionData);
    res.status(200).json({
      message: resultOfRegister.transactionSaved,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
      success: false,
    });
  }
}
async function getAllTransactions(req, res) {
  try {
    const username = req.params.username;
    const resultOfFetchedTranscations = await transactionService.get(username);
    res.status(200).json({
      message: resultOfFetchedTranscations,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
      success: false,
    });
  }
}
async function getAllCharts(req, res) {
  try {
    const username = req.params.username;
    const resultOfFetchedChartData = await transactionService.getCharts(username);
    res.status(200).json({
      message: resultOfFetchedChartData.chartGroupByCardName,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
      success: false,
    });
  }
}
async function deleteTransaction(req, res) {
  await transactionService.deleteX(req.params.transactionId);
  try {
    res.status(200).json({
      message: req.params.transcationIdDelete,
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
    const transactionData = req.body;
    // eslint-disable-next-line max-len
    const resultOfUpdateDataTransaction = await transactionService.updatePurchaseDate(transactionData);
    res.status(200).json({
      message: resultOfUpdateDataTransaction,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
}

router.post('/transaction', create);
router.get('/:username', getAllTransactions);
router.get('/charts/:username', getAllCharts);
router.delete('/:transactionId', deleteTransaction);
router.put('', update);
module.exports = router;
