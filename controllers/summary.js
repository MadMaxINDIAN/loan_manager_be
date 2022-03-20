const Loan = require("../models/Loan");
const Summary = require("../models/Summary");
const Transaction = require("../models/Transaction");

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

Date.prototype.subtractDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() - days);
  return date;
};

exports.getSummary = async (req, res) => {
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
};

exports.getDailySummary = async (req, res) => {
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
};

exports.getSevenDaysSummary = async (req, res) => {
  try {
    let ub = new Date();
    ub.setHours(5, 30, 0, 0);
    ub = ub.addDays(1);
    const lb = ub.subtractDays(7);
    const loans = await Loan.aggregate([
      { $match: { opening_date: { $gte: lb, $lt: ub } } },
      { $group: { _id: "$opening_date", total: { $sum: "$loan_amount" } } },
    ]);
    console.log(loans);
    const transactions = await Transaction.aggregate([
      { $match: { date: { $gte: lb, $lt: ub } } },
      { $group: { _id: "$date", total: { $sum: "$amount" } } },
    ]);
    console.log(transactions);
    return res.json({
      message: "Summary found",
      loans,
      transactions,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Some error occurred while retrieving summary.",
    });
  }
};