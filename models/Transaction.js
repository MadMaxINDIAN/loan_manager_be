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
  type: {
    type: String,
    required: true,
    enum: ["Add", "Withdraw"],
    default: "Withdraw"
  }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
