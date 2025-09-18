const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

// Wallet operations
router.post('/create', walletController.createwallet);
router.get('/balance/:userId', walletController.walletBalance);
router.post('/fund', walletController.fundWallet);
router.post('/withdraw', walletController.withdraw);
// router.post('/transfer', walletController.transfer);

module.exports = router;
