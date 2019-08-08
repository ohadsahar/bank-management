const express = require('express');
const schedule = require('node-schedule');
const localStorage = require('store');
const paymentService = require('../services/payment.service');


schedule.scheduleJob('0 0 * * *', () => {
  const username = localStorage.get('username');
  paymentService.checkPayCheck(username);
});
const router = express.Router();

async function get(req, res) {
  try {
    const username = req.params.username;
    const resultOfAllArchivesTransaction = await paymentService.get(username);
    res.status(200).json({
      message: resultOfAllArchivesTransaction,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
      success: false,
    });
  }
}

router.get('/:username', get);
module.exports = router;
