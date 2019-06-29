const express = require('express');
const schedule = require('node-schedule');
const paymentService = require('../services/payment.service');

schedule.scheduleJob('* * * * *', () => {
  paymentService.checkPayCheck();
});
const router = express.Router();


module.exports = router;
