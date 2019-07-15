const express = require('express');

const router = express.Router();
const authUtil = require('../utils/auth');
const userManagementService = require('../services/user-management.service');

async function login(req, res) {
  const loginData = req.body;
  const resultOfAuthUtil = await authUtil.login(loginData);
  try {
    res.status(200).json({
      message: resultOfAuthUtil.userData,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
      success: false,
    });
  }
}

async function register(req, res) {
  try {
    const registerData = req.body;
    const registerResult = await userManagementService.register(registerData);
    res.status(201).json({
      message: registerResult.message,
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
router.post('/register', register);
