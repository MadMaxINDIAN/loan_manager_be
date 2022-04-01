const Loan = require("../models/Loan");
const Transaction = require("../models/Transaction");
const { validationResult } = require("express-validator");
const Borrower = require("../models/Borrowers");
const Summary = require("../models/Summary");

exports.badDebt = async (req, res) => {
  const loan_id = req.params.loan_id;

  Loan.findById(loan_id, async (err, loan) => {
    if (err) {
      return res.status(500).json({
        message: err.message || "Some error occurred while retrieving loan.",
      });
    }
    if (!loan) {
      return res.status(404).json({
        message: "Loan not found",
      });
    }
    loan.status = "bad debt";
    loan.save(async (err, loan) => {
      if (err) {
        return res.status(500).json({
          message: err.message || "Some error occurred while retrieving loan.",
        });
      }
      const borrower = await Borrower.findById(loan.borrower_id);
      const loans = await Loan.find({
        borrower_id: borrower._id,
      });
      return res.json({
        message: "Loan updated successfully",
        loans,
        borrower,
      });
    });
  });
};

exports.addTransaction = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.params.id;
  let { amount, date } = req.body;
  date = new Date(date.substring(0, 10));
  Loan.findById(id, async (err, loan) => {
    if (err) {
      res.status(500).json({ message: "Loan account doesn't exist" });
    } else {
      const lb = date;
      const ub = date.addDays(1);
      const opening_date = loan.opening_date;
      opening_date.setHours(5, 30, 0, 0);
      const time_diff = date.getTime() - opening_date.getTime();
      const day = time_diff / (1000 * 3600 * 24);
      if (day <= 0) {
        return res.status(400).json({
          message: "Entry can not be updated on and before loan opening date",
        });
      }
      if (loan.payments[day] !== 0 && req?.user?.type !== "admin") {
        return res.status(400).json({
          message: "Payment already made for this day",
        });
      }
      if (loan.payments[day] !== 0 && req?.user?.type === "admin") {
        const transaction = await Transaction.findOneAndDelete({
          loan_account_id: id,
          date: {
            $gte: lb,
            $lt: ub,
          },
        });
        const summary = await Summary.find();
        loan.amount_to_be_paid += loan.payments[day];
        summary[0].amount_taken -= loan.payments[day];
        await summary[0].save();
      }

      loan.payments[day] = amount;
      if (loan.amount_to_be_paid - amount < 0) {
        return res.status(400).json({
          message: `Amount remaining is ${loan.amount_to_be_paid} only`,
        });
      } else if (loan.amount_to_be_paid - amount === 0) {
        loan.status = "closed";
        const finalPayments = [];
        for (let i = 0; i <= day; i++) {
          finalPayments.push(loan.payments[i]);
        }
        loan.payments = finalPayments;
      }
      loan.amount_to_be_paid -= amount;
      loan.save((err, loan) => {
        const transaction = new Transaction({
          amount: amount,
          loan_account_id: id,
          date,
        });
        transaction.save(async (err, transaction) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              message: err.message || "Some error occured",
              err,
            });
          } else {
            const summary = await Summary.find();
            if (!summary.length) {
              const newSummary = new Summary({
                amount_taken: req.body.amount,
                amount_invested: 0,
              });
              await newSummary.save();
            } else {
              summary[0].amount_taken += +req.body.amount;
              await summary[0].save();
            }
            Borrower.findById(loan.borrower_id)
              .then((borrower) => {
                if (!borrower) {
                  return res.status(404).json({
                    message: "Borrower not found",
                  });
                }

                return Loan.find({
                  borrower_id: loan.borrower_id,
                }).then((loans) => {
                  if (!loans) {
                    return res.status(404).json({
                      message: "Loans not found",
                    });
                  }
                  return res.json({
                    message: "Entry done successfully",
                    borrower,
                    loans,
                    transaction,
                  });
                });
              })
              .catch((err) => {
                return res.status(500).json({
                  message:
                    err.message ||
                    "Some error occurred while retrieving borrower.",
                });
              });
          }
        });
      });
    }
  });
};

exports.getTransactionByDates = async (req, res) => {
  try {
    const { from_date, to_date } = req.body;
    const lb = new Date(from_date.substring(0, 10));
    const ub = new Date(to_date.substring(0, 10)).addDays(1);
    let transactions = await Transaction.find({
      date: {
        $gte: lb,
        $lt: ub,
      },
    }).populate({
      path: "loan_account_id",
      populate: {
        path: "borrower_id",
        model: "Borrower",
      },
    });
    const result = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: lb,
            $lt: ub,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const total = result[0].total;
    res
      .status(200)
      .json({ message: "Transactions found", transactions, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
