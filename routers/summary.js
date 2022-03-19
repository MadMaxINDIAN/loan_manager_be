const router = require("express").Router();
const Loan = require("../models/Loan");
const Summary = require("../models/Summary");
const Transaction = require("../models/Transaction");

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

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
    const lb = new Date(date.substring(0, 10));
    const ub = lb.addDays(1);
    const result = await Loan.aggregate([
      { $match: { opening_date: { $gte: lb, $lt: ub } } },
      { $group: { _id: null, total: { $sum: "$loan_amount" } } },
    ]);
    const total_investment = result[0]?.total || 0;
    const result2 = await Transaction.aggregate([
      { $match: { date: { $gte: lb, $lt: ub } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const total_received = result2[0]?.total || 0;
    return res.json({
      message: "Summary found",
      total_investment,
      total_received,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Some error occurred while retrieving summary.",
    });
  }
});

module.exports = router;
