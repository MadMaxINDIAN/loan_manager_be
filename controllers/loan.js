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
      for (let i = 0; i < 365; i++) {
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
              amount_invested: req.body.loan_amount - daily / 1.2,
            });
            await newSummary.save();
          } else {
            summary[0].amount_taken += daily;
            summary[0].amount_invested += +req.body.loan_amount - daily / 1.2;
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

exports.updateLoan = async (req, res) => {
  if (req?.user?.type !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", data: errors.array() });
  }
  try {
    const daily_payment = (req.body.loan_amount * 1.2) / req.body.loan_period;
    const loan = await Loan.findOneAndUpdate(
      { sr_no: req.body.old_sr_no },
      {
        sr_no: req.body.sr_no,
        loan_period: req.body.loan_period,
        daily_payment: daily_payment,
      },
      { new: true }
    );
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    return res.json({ message: "Loan updated", loan });
  } catch (err) {
    return res.status(500).json({ message: "Changes cannot be made" });
  }
};

exports.getAllLoans = (req, res) => {
  Loan.find({})
    .populate("borrower_id")
    .sort("sr_no")
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
    })
      .populate("borrower_id")
      .sort("sr_no");
    res.status(200).json({ message: "Loans found", loans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLoanBySrNo = async (req, res) => {
  try {
    const loan = await Loan.findOne({ sr_no: req.params.sr_no }).populate(
      "borrower_id"
    );
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    return res.json({ message: "Loan found", loan_id: loan._id, loan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteLoan = async (req, res) => {
  if (req?.user?.type !== "admin") {
    return res.status(401).json({ message: "Only admin can delete loan account" });
  }
  
  const sr_no = req.params.sr_no;
  try {
    const loan = await Loan.findOne({ sr_no: sr_no });
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    const summary = await Summary.find();
    const sum = loan.payments.reduce((a, b) => a + b, 0);
    summary[0].amount_invested -= loan.loan_amount;
    summary[0].amount_invested += sum/1.2;
    await summary[0].save();
    await loan.remove();
    await Transaction.deleteMany({ loan_account_id: loan._id });
    return res.json({ message: "Loan deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Some error occurred" });
  }
}