const Loan = require("../models/Loan");
const Borrower = require("../models/Borrowers");
const Summary = require("../models/Summary");
const { validationResult } = require("express-validator");

exports.addLoan = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", data: errors.array() });
  }
  const today = new Date(req.body.opening_date);
  var curMonth = today.getMonth();

  var fiscalYr = "";
  if (curMonth > 2) {
    //
    var nextYr1 = (today.getFullYear() + 1).toString();
    fiscalYr = today.getFullYear().toString() + "-" + nextYr1;
  } else {
    var nextYr2 = today.getFullYear().toString();
    fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2;
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
        opening_date: req.body.opening_date,
      });
      loan.save(async (err, loan) => {
        if (err) {
          return res.status(500).json({
            message:
              err.message || "Some error occurred while creating the loan.",
          });
        } else {
          const summary = await Summary.findOne({
            fin_year: fiscalYr,
          });
          if (!summary) {
            const newSummary = new Summary({
              fin_year: fiscalYr,
              amount_taken: 0,
              amount_invested: req.body.loan_amount,
            });
            await newSummary.save();
          } else {
            summary.amount_invested += +req.body.loan_amount;
            await summary.save();
          }
          return res.json({ message: "Loan accout created", loan });
        }
      });
    });
  });
};

exports.getAllLoans = (req, res) => {
  Loan.find({})
    .populate("borrower_id")
    .then((loans) => {
      if (!loans) {
        return res.status(404).json({ message: "Loans not found" });
      }
      return res.json({ message: "Loans found", loans });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message || "Some error occurred while retrieving loans.",
      });
    });
};

exports.getLoanById = (req, res) => {
  Loan.findById(req.params.id)
    .populate("borrower_id")
    .then((loan) => {
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }
      return res.json({ message: "Loan found", loan });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message || "Some error occurred while retrieving loan.",
      });
    });
};
