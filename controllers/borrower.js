const Borrower = require("../models/Borrowers");
const { validationResult } = require("express-validator");
const response = require("../constants/response");

exports.addBorrower = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(response.errors.VALIDATION_ERROR.status)
      .json({ message: response.errors.VALIDATION_ERROR.message, data: errors.array() });
  }
  Borrower.findOne({ aadhar: req.body.aadhar }).then((borr) => {
    if (borr) {
      return res.status(response.errors.VALIDATION_ERROR.status).json({
        message: response.errors.VALIDATION_ERROR.message,
        errors: {message: "Aadhar number already exists"},
      });
    }
    const borrower = new Borrower({
      name: req.body.name,
      address: req.body.address,
      contact: req.body.contact,
      aadhar: req.body.aadhar,
      occupation: req.body.occupation,
    });
    borrower.save((err, borrower) => {
      if (err) {
        return res
        .status(response.errors.INTERNAL_SERVER_ERROR.status)
        .json({ message: response.errors.INTERNAL_SERVER_ERROR.message });
      } else {
        return res.json({ message: "Borrower added", borrower });
      }
    });
  });
};
