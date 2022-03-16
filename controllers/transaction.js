const Loan = require("../models/Loan");
const Transaction = require("../models/Transaction");
const { validationResult } = require("express-validator");

exports.addTransaction = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.params.id;
  const { amount, day } = req.body;
  Loan.findById(id, (err, loan) => {
    if (err) {
      res.status(500).json({ message: "Loan account doesn't exist" });
    } else {
      loan.payments[day] = amount;
      loan.amount_to_be_paid -= amount;
      loan.save((err, loan) => {
        const transaction = new Transaction({
          amount: amount,
          loan_account_id: id,
        });
        transaction.save((err, transaction) => {
          if (err) {
            res
              .status(500)
              .json({ message: err.message || "Some error occured", err });
          } else {
            res.status(200).json({
              message: "Transaction done successfully",
              transaction,
            });
          }
        });
      });
    }
  });
};
