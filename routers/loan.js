const router = require("express").Router();
const loanController = require("../controllers/loan");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth");

// URL: /loan/add
// Method: POST
// Description: Add a loan account
router.post(
  "/add",
  authMiddleware,
  [
    body("sr_no").isNumeric().withMessage("Enter valid SR No"),
    body("loan_amount").isNumeric().withMessage("Enter valid loan amount"),
  ],
  loanController.addLoan
);

// URL: /loan/update
// Method: POST
// Description: Add a loan account
router.post(
  "/update",
  authMiddleware,
  [
    body("sr_no").isNumeric().withMessage("Enter valid SR No"),
    body("loan_amount").isNumeric().withMessage("Enter valid loan amount"),
  ],
  loanController.updateLoan
);

// URL: /loan/get
// Method: GET
// Description: Get all loan accounts
router.get("/get", authMiddleware, loanController.getAllLoans);

// URL: /loan/get/:id
// Method: GET
// Description: Get a loan account by id
router.get("/get/active", authMiddleware, loanController.getActiveLoans);

router.post("/get/dates", authMiddleware, loanController.getLoansByDates);
router.get("/get/sr_no/:sr_no", authMiddleware, loanController.getLoanBySrNo);
router.get("/get/:id", authMiddleware, loanController.getLoanById);
router.delete("/delete/:sr_no", authMiddleware, loanController.deleteLoan);

module.exports = router;
