const { addNewWithdrawTransaction } = require("../controllers/withdraw");
const authMiddleware = require("../middleware/auth");
const router = require("express").Router();

// URL: /withdraw/transaction
// Method: POST
router.post("/transaction", authMiddleware, addNewWithdrawTransaction);

module.exports = router;
