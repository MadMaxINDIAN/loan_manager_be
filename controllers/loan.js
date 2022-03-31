const Loan = require("../models/Loan");
const Borrower = require("../models/Borrowers");
const Summary = require("../models/Summary");
const Transaction = require("../models/Transaction");
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
      const daily = (req.body.loan_amount * 1.2) / req.body.loan_period;
      const amount_to_be_paid = req.body.loan_amount * 1.2 - daily;
      // array of length 60
      const payments = [];
      for (let i = 0; i < req.body.loan_period; i++) {
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
        loan_period: req.body.loan_period,
      });
      loan.save(async (err, loan) => {
        if (err) {
          return res.status(500).json({
            message:
              err.message || "Some error occurred while creating the loan.",
          });
        } else {
          const transaction = await Transaction.create({
            loan_account_id: loan._id,
            amount: daily,
            date: req.body.opening_date,
          });
          const summary = await Summary.find();
          if (!summary.length) {
            const newSummary = new Summary({
              amount_taken: daily,
              amount_invested: req.body.loan_amount,
            });
            await newSummary.save();
          } else {
            summary[0].amount_taken += daily;
            summary[0].amount_invested += +req.body.loan_amount;
            await summary[0].save();
          }
          return res.json({
            message: "Loan accout created",
            loan,
            transaction,
          });
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

exports.getLoansByDates = async (req, res) => {
  try {
    const { from_date, to_date } = req.body;
    const lb = new Date(from_date.substring(0, 10));
    const ub = new Date(to_date.substring(0, 10)).addDays(1);
    const loans = await Loan.find({
      opening_date: {
        $gte: lb,
        $lt: ub,
      },
    }).populate("borrower_id");
    res.status(200).json({ message: "Loans found", loans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getActiveLoans = async (req, res) => {
  try {
    const loans = await Loan.find({
      status: "active",
    }).populate("borrower_id");
    res.status(200).json({ message: "Loans found", loans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
