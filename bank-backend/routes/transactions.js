const express = require('express');
const router = express.Router();
const transactionService = require('../services/transcation.service');
const schedule = require('node-schedule');
 
schedule.scheduleJob('0 0 * * *', function(){
  transactionService.updatePurchaseDate();
});
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

async function deleteTranscation(req,res) {

    await transactionService.deleteX(req.params.transcationId);
    try {
        res.status(200).json({
            message: req.params.transcationIdDelete,
            success: true
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            success: false,
        })
    }
  
    
}

router.post('/transcation', registerNewTransaction);
router.get('', getAllTranscations);
router.delete('/:transcationId', deleteTranscation);
module.exports = router;