const express = require('express');

const router = express.Router();


async function login(req, res) {
  try {
    res.status(200).json({
      message: req.body,
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

router.post('', login);
