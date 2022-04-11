const mongoose = require("mongoose");

const BorrowerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
  },
  aadhar: {
    type: String,
  },
  occupation: {
    type: String,
  },
});

module.exports = mongoose.model("Borrower", BorrowerSchema);
