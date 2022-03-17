const Borrower = require("../models/Borrowers");
const { validationResult } = require("express-validator");

exports.addBorrower = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", data: errors.array() });
  }
  Borrower.findOne({ aadhar: req.body.aadhar }).then((borr) => {
    if (borr) {
      return res.status(200).json({
        message: "Borrowe found",
        borrower: borr,
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
    .then((borrowers) => {
      if (!borrowers) {
        return res.status(404).json({ message: "Borrowers not found" });
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
