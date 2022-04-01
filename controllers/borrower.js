const Borrower = require("../models/Borrowers");
const { validationResult } = require("express-validator");
const Loan = require("../models/Loan");

exports.getTotalLoanAccounts = (req, res) => {
  Loan.find({})
    .then((loans) => {
      res.json({
        success: true,
        loans: loans.length,
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        message: err.message,
      });
    });
};

exports.addBorrower = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", data: errors.array() });
  }
  Borrower.findOne({ $or: [{ aadhar: req.body.aadhar }, {name: req.body.name}]}).then((borr) => {
    if (borr) {
      return res.status(200).json({
        message: "Borrower found",
        borrower: borr,
      });
    }
    const borrower = new Borrower({
      name: req.body.name,
      contact: req.body.contact,
      aadhar: req.body.aadhar,
      occupation: req.body.occupation,
    });
    borrower.save((err, borrower) => {
      if (err) {
        return res.status(500).json({
          message:
            err.message || "Some error occurred while creating the borrower.",
        });
      } else {
        return res.json({ message: "Borrower added", borrower });
      }
    });
  });
};

exports.getBorrowers = (req, res) => {
  const name = req.query.search;
  Borrower.find({ name: { $regex: name, $options: "i" } })
    .limit(10)
    .then((borrowers) => {
      if (!borrowers) {
        return res.json({ message: "Borrowers not found", borrowers: [] });
      }
      return res.json({ message: "Borrowers found", borrowers });
    })
    .catch((err) => {
      return res.status(500).json({
        message:
          err.message || "Some error occurred while retrieving borrowers.",
      });
    });
};

exports.getBorrower = (req, res) => {
  const id = req.params.id;
  Borrower.findById(id)
    .then((borrower) => {
      if (!borrower) {
        return res.status(404).json({ message: "Borrower not found" });
      }
      return Loan.find({ borrower_id: id }).then((loans) => {
        if (!loans) {
          return res.status(404).json({ message: "Loans not found" });
        }
        return res.json({ message: "Borrower found", borrower, loans });
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message:
          err.message || "Some error occurred while retrieving borrower.",
      });
    });
};
