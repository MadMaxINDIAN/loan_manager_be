const mongoose = require("mongoose");

// fiscal year format 2021-2022
const SummarySchema = new mongoose.Schema({
  amount_taken: {
    type: Number,
    required: true,
    default: 0,
  },
  amount_invested: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Summary", SummarySchema);
