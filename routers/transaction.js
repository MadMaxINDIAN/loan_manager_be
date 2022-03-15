const router = require("express").Router();
const Loan = require("../models/Loan");
const Transaction = require("../models/Transaction");

// URL: /transaction/:id/add
// Method: POST
// Description: Add a transaction
router.post("/:id/add", (req, res) => {
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
            res
              .status(200)
              .json({ message: "Transaction done successfully", transaction });
          }
        });
      });
    }
  });
});

module.exports = router;
