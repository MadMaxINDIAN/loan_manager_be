const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
  sr_no: {
    type: Number,
    unique: true,
  },
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active",
  },
  borrower_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Borrower",
  },
  loan_amount: {
    type: Number,
    required: true,
  },
  amount_to_be_paid: {
    type: Number,
    required: true,
  },
  daily_payment: {
    type: Number,
    required: true,
  },
  payments: [
    {
      type: Number,
      required: true,
    },
  ],
  opening_date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Loan", LoanSchema);
