const router = require("express").Router();
const loanController = require("../controllers/loan");
const { body } = require("express-validator");

// URL: /loan/add
// Method: POST
// Description: Add a loan account
router.post(
  "/add",
  [
    body("sr_no").isNumeric().withMessage("Enter valid SR No"),
    body("loan_amount").isNumeric().withMessage("Enter valid loan amount"),
  ],
  loanController.addLoan
);

module.exports = router;
