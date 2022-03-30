const router = require("express").Router();
const { body } = require("express-validator");
const borrowerController = require("../controllers/borrower");

// URL: /borrower/add
// Method: POST
// Description: Add a borrower
router.post(
  "/add",
  [
    body("name").isLength({ min: 1 }).withMessage("Name is required"),
    body("contact")
      .escape()
      .exists({ checkFalsy: true })
      .isLength({ min: 10, max: 10 })
      .matches(/^[789]\d{9}$/)
      .withMessage("Contact number is invalid"),
    body("aadhar")
      .matches(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/)
      .withMessage("Aadhar number is invalid"),
    body("occupation")
      .isLength({ min: 1 })
      .withMessage("Occupation is required"),
  ],
  borrowerController.addBorrower
);

// URL: /borrower/get
// Method: GET
// Description: Get all borrowers
router.get("/get", borrowerController.getBorrowers);

// URL: /borrower/get/:id
// Method: GET
// Description: Get a borrower
router.get("/get/:id", borrowerController.getBorrower);

// URL: /borrower/total_loan_accounts
// Method: GET
// Description: Get total loan accounts of all borrowers
router.get("/total_loan_accounts", borrowerController.getTotalLoanAccounts);

module.exports = router;
