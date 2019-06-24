const express = require('express');

const router = express.Router();
const schedule = require('node-schedule');
const transactionService = require('../services/transcation.service');

schedule.scheduleJob('* * * * *', () => {
  transactionService.checkPayCheck();
});

async function registerNewTransaction(req, res) {
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
    const resultOfFetchedTranscations = await transactionService.get();
    console.log(resultOfFetchedTranscations);
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
    const resultOfFetchedChartData = await transactionService.getCharts();
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
  await transactionService.deleteX(req.params.transcationId);
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

router.post('/transcation', registerNewTransaction);
router.get('', getAllTransactions);
router.get('/charts', getAllCharts);
router.delete('/:transcationId', deleteTransaction);
router.put('', update);
module.exports = router;
