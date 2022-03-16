const Loan = require("../models/Loan");
const Transaction = require("../models/Transaction");
const { validationResult } = require("express-validator");
const response = require("../constants/response");

exports.addTransaction = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.params.id;
  const { amount, day } = req.body;
  Loan.findById(id, (err, loan) => {
    if (err) {
      return res.status(response.errors.INTERNAL_SERVER_ERROR.status).json({
        message: response.errors.INTERNAL_SERVER_ERROR.message
      });
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
            res.status(response.errors.INTERNAL_SERVER_ERROR.status).json({
              message: response.errors.INTERNAL_SERVER_ERROR.message
            });
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
