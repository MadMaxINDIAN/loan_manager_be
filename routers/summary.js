const router = require("express").Router();
const Loan = require("../models/Loan");
const Summary = require("../models/Summary");
const Transaction = require("../models/Transaction");

// URL: /summary
// Method: GET
// Description: Get total loan accounts of all borrowers
router.get("/", async (req, res) => {
  const today = new Date();
  var curMonth = today.getMonth();

  var fiscalYr = "";
  if (curMonth > 3) {
    //
    var nextYr1 = (today.getFullYear() + 1).toString();
    fiscalYr = today.getFullYear().toString() + "-" + nextYr1;
  } else {
    var nextYr2 = today.getFullYear().toString();
    fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2;
  }
  const summary = await Summary.findOne({
    fin_year: fiscalYr,
  });
  if (!summary) {
    const newSummary = new Summary({
      fin_year: fiscalYr,
      amount_taken: 0,
      amount_invested: 0,
    });
    await newSummary.save();
  }
  Summary.find({})
    .then((summary) => {
      if (!summary) {
        return res.status(404).json({ message: "Summary not found" });
      }
      return res.json({ message: "Summary found", summary });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message || "Some error occurred while retrieving summary.",
      });
    });
});

router.post("/daily", async (req, res) => {
  try {
    const { date } = req.body;
    const loans = await Loan.find({});
    let total_investment = 0;
    loans.map((loan) => {
      if (
        loan.opening_date.getDate() === new Date(date).getDate() &&
        loan.opening_date.getMonth() === new Date(date).getMonth() &&
        loan.opening_date.getFullYear() === new Date(date).getFullYear()
      ) {
        total_investment += +loan.loan_amount;
      }
    });
    const transactions = await Transaction.find({});
    let total_taken = 0;
    transactions.map((transaction) => {
      if (
        transaction.date.getDate() === new Date(date).getDate() &&
        transaction.date.getMonth() === new Date(date).getMonth() &&
        transaction.date.getFullYear() === new Date(date).getFullYear()
      ) {
        total_taken += +transaction.amount;
      }
    });
    return res.json({
      message: "Summary found",
      total_investment,
      total_taken,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Some error occurred while retrieving summary.",
    });
  }
});

module.exports = router;
