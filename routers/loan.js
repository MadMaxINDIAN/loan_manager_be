const router = require("express").Router();
const loanController = require("../controllers/loan");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth");

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

// URL: /loan/get
// Method: GET
// Description: Get all loan accounts
router.get("/get", loanController.getAllLoans);

// URL: /loan/get/:id
// Method: GET
// Description: Get a loan account by id
router.get("/get/:id", loanController.getLoanById);

router.post("/get/dates", loanController.getLoansByDates);

module.exports = router;
