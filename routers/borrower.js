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
    body("address").isLength({ min: 1 }).withMessage("Address is required"),
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

module.exports = router;
