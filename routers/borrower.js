const router = require("express").Router();
const { body } = require("express-validator");
const borrowerController = require("../controllers/borrower");
const authMiddleware = require("../middleware/auth");

// URL: /borrower/add
// Method: POST
// Description: Add a borrower
// /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/
router.post(
  "/add",
  authMiddleware,
  [
    body("name").isLength({ min: 1 }).withMessage("Name is required"),
    body("contact").custom((value, { req }) => {
      if (value.length === 0) {
        return true;
      }
      var regex = /^[789]\d{9}$/;
      if (regex.test(value)) {
        return true;
      }
      throw new Error("Contact number is invalid");
    }),
    body("aadhar").custom((value, { req }) => {
      if (value.length === 0) {
        return true;
      }
      var regex = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
      if (regex.test(value)) {
        return true;
      }
      throw new Error("Aadhar number is invalid");
    }),
    body("occupation")
      .isLength({ min: 1 })
      .withMessage("Occupation is required"),
  ],
  borrowerController.addBorrower
);

// URL: /borrower/update
// Method: POST
// Description: Update a borrower
router.post(
  "/update",
  authMiddleware,
  [
    body("name").isLength({ min: 1 }).withMessage("Name is required"),
    body("contact").custom((value, { req }) => {
      if (value.length === 0) {
        return true;
      }
      var regex = /^[789]\d{9}$/;
      if (regex.test(value)) {
        return true;
      }
      throw new Error("Contact number is invalid");
    }),
    body("aadhar").custom((value, { req }) => {
      if (value.length === 0) {
        return true;
      }
      var regex = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
      if (regex.test(value)) {
        return true;
      }
      throw new Error("Aadhar number is invalid");
    }),
    body("occupation")
      .isLength({ min: 1 })
      .withMessage("Occupation is required"),
  ],
  borrowerController.updateBorrower
);

// URL: /borrower/get
// Method: GET
// Description: Get all borrowers
router.get("/get", authMiddleware, borrowerController.getBorrowers);

// URL: /borrower/get/:id
// Method: GET
// Description: Get a borrower
router.get("/get/:id", authMiddleware, borrowerController.getBorrower);

// URL: /borrower/total_loan_accounts
// Method: GET
// Description: Get total loan accounts of all borrowers
router.get(
  "/total_loan_accounts",
  authMiddleware,
  borrowerController.getTotalLoanAccounts
);

// router.post('/addLoans', borrowerController.addLoansToBorrowers)

module.exports = router;
