const router = require("express").Router();
const transactionController = require("../controllers/transaction");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth");

// URL: /transaction/:id/add
// Method: POST
// Description: Add a transaction
router.post(
  "/:id/add",
  authMiddleware,
  [body("amount").isNumeric().withMessage("Amount must be a number")],
  transactionController.addTransaction
);

// URL: /transaction/badDebt/:loan_id
// Method: POST
// Description: Mark a loan account as bad debt
router.post("/badDebt/:loan_id", authMiddleware, transactionController.badDebt);

module.exports = router;
