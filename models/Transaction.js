const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  loan_account_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Loan",
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
