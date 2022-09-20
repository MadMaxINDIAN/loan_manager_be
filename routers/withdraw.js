const { addNewWithdrawTransaction, getDetailsWithdrawTransaction, fetchWithdrawAndAdd, fetchWithdrawAndAddByDate, deleteEntry } = require("../controllers/withdraw");
const authMiddleware = require("../middleware/auth");
const Withdraw = require("../models/Withdraw");
const router = require("express").Router();

// URL: /withdraw/transaction
// Method: POST
router.post("/transaction", authMiddleware, addNewWithdrawTransaction);

router.get("/transaction", authMiddleware, getDetailsWithdrawTransaction);

router.get('/total', authMiddleware, fetchWithdrawAndAdd)

router.post('/total/date', authMiddleware, fetchWithdrawAndAddByDate)

router.delete('/:id', authMiddleware, deleteEntry)

module.exports = router;
