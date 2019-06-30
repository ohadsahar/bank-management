const express = require('express');
const salaryService = require('../services/salary.service');

const router = express.Router();


async function create(req, res) {
  try {
    const salaryData = req.body;
    const resultOfCreateNewSalary = await salaryService.create(salaryData);
    res.status(201).json({
      message: resultOfCreateNewSalary,
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
    const getAllSalary = await salaryService.get();
    res.status(200).json({
      message: getAllSalary,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
      success: false,
    });
  }
}

router.post('', create);
router.get('', get);
module.exports = router;
