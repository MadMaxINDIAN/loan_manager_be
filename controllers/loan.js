const Loan = require("../models/Loan");
const Borrower = require("../models/Borrowers");
const { validationResult } = require("express-validator");

exports.addLoan = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", data: errors.array() });
  }
  Borrower.findById(req.body.borrower_id).then((borrower) => {
    if (!borrower) {
      return res.status(404).json({ message: "Borrower not found" });
    }
    Loan.findOne({ sr_no: req.body.sr_no }).then((lon) => {
      if (lon) {
        return res.status(400).json({
          message: "SR No already exists",
        });
      }
      const daily = (req.body.loan_amount * 1.2) / 60;
      const amount_to_be_paid = req.body.loan_amount * 1.2 - daily;
      // array of length 60
      const payments = [];
      for (let i = 0; i < 60; i++) {
        payments.push(0);
      }
      payments[0] = daily;
      const loan = new Loan({
        sr_no: req.body.sr_no,
        borrower_id: req.body.borrower_id,
        loan_amount: req.body.loan_amount,
        amount_to_be_paid: amount_to_be_paid,
        daily_payment: daily,
        payments: payments,
      });
      loan.save((err, loan) => {
        if (err) {
          return res.status(500).json({
            message:
              err.message || "Some error occurred while creating the loan.",
          });
        } else {
          return res.json({ message: "Loan accout created", loan });
        }
      });
    });
  });
};
