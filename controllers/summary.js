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
  try {
    const amount_to_be_paid = await Loan.aggregate([
      {
        $match: {
          status: "active",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount_to_be_paid" },
          total1: { $sum: "$daily_payment" },
        },
      },
    ]);
    const summary = await Summary.find({});
    if (!summary.length) {
      const newSummary = new Summary({
        amount_taken: 0,
        amount_invested: 0,
      });
      await newSummary.save();
      return res.json({
        message: "Summary created",
        summary: newSummary,
        amount_to_be_paid: amount_to_be_paid[0]?.total || 0,
        amount_receivable: amount_to_be_paid[0]?.total1 || 0,
      });
    } else {
      return res.json({
        message: "Summary found",
        summary: summary[0],
        amount_to_be_paid: amount_to_be_paid[0]?.total || 0,
        amount_receivable: amount_to_be_paid[0]?.total1 || 0,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Some error occurred while retrieving summary.",
    });
  }
};

exports.getDailySummary = async (req, res) => {
  try {
    const { from_date, to_date } = req.body;
    const lb = new Date(from_date.substring(0, 10));
    const ub = new Date(to_date.substring(0, 10)).addDays(1);
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
    if (process.env.NODE_ENV === "development") {
      // ONLY FOR LOCAL TESTING
      ub.setHours(5, 30, 0, 0);
    } else {
      // ONLY FOR PRODUCTION
      ub.setHours(0, 0, 0, 0);
    }
    ub = ub.addDays(1);
    const lb = ub.subtractDays(7);
    const loans = await Loan.aggregate([
      { $match: { opening_date: { $gte: lb, $lt: ub } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$opening_date" },
          },
          total: { $sum: "$loan_amount" },
        },
      },
    ]);
    const transactions = await Transaction.aggregate([
      { $match: { date: { $gte: lb, $lt: ub } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
    ]);
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
