const express = require('express');
const router = express.Router();
const transactionService = require('../services/transcation.service');

async function registerNewTransaction(req, res) {
   
    try {
        const transcationData = req.body;
        const resultOfRegister = await transactionService.register(transcationData);
        res.status(200).json({
            message: resultOfRegister.transactionSaved,
            success: true
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            success: false
        })
    }
}
async function getAllTranscations(req,res) {

    try {
        const resultOfFetchedTranscations = await transactionService.get();
        res.status(200).json({
            message: resultOfFetchedTranscations.foundTranscations,
            success: true
        })  
    } catch (error) {
        res.status(400).json({
            message: error,
            success: false
        })
    }
}


router.post('/transcation', registerNewTransaction);
router.get('', getAllTranscations);
module.exports = router;