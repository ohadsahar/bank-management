const express = require('express');
const router = express.Router();
const transactionService = require('../services/transaction.service');
const authValidate = require('../middleware/validate-auth');

async function getExpensesCurrentMonth(req, res) {
    try {
        const username = req.params.username;
        const resultOfExpenseCurrentMonth = await transactionService.getCurrentCategoryExpense(username);
        console.log(resultOfExpenseCurrentMonth);
        res.status(200).json({
            message: resultOfExpenseCurrentMonth,
            success: true
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            success: false
        })
    }
}



router.get('/:username', getExpensesCurrentMonth, authValidate);
module.exports = router;