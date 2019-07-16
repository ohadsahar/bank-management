const express = require('express');

const router = express.Router();
const transactionService = require('../services/transaction.service');
const authValidate = require('../middleware/validate-auth');

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
async function get(req, res) {
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
async function getById(req, res) {
  try {
    const id = req.params.specificId;
    const resultOfSpecificTransaction = await transactionService.getTransactionById(id);
    res.status(200).json({
      message: resultOfSpecificTransaction.fetchedTransaction,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
      success: false,
    });
  }
}
async function getCharts(req, res) {
  try {
    const username = req.params.username;
    const resultOfFetchedChartData = await transactionService.getCharts(username);
    res.status(200).json({
      message: resultOfFetchedChartData,
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
router.post('/transaction', authValidate, create);
router.get('/:username', authValidate, get);
router.get('/charts/:username', authValidate, getCharts);
router.get('/byId/:specificId', authValidate, getById);
router.delete('/:transactionId', authValidate, deleteTransaction);
router.put('', authValidate, update);
module.exports = router;
