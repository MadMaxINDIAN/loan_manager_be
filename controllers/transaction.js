const Loan = require("../models/Loan");
const Transaction = require("../models/Transaction");
const { validationResult } = require("express-validator");
const Borrower = require("../models/Borrowers");
const Summary = require("../models/Summary");

exports.addTransaction = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const today = new Date(req.body.date);
    var curMonth = today.getMonth();

    var fiscalYr = "";
    if (curMonth > 2) {
        //
        var nextYr1 = (today.getFullYear() + 1).toString();
        fiscalYr = today.getFullYear().toString() + "-" + nextYr1;
    } else {
        var nextYr2 = today.getFullYear().toString();
        fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2;
    }
    const id = req.params.id;
    let { amount, date } = req.body;
    date = new Date(date);
    Loan.findById(id, async (err, loan) => {
        if (err) {
            res.status(500).json({ message: "Loan account doesn't exist" });
        } else {
            const opening_date = loan.opening_date;
            const time_diff = date.getTime() - opening_date.getTime();
            const day = Math.floor(time_diff / (1000 * 3600 * 24));
            loan.payments[day] = amount;
            if (loan.amount_to_be_paid - amount < 0) {
                return res.status(400).json({
                    message: `Amount remaining is ${loan.amount_to_be_paid} only`,
                });
            } else if (loan.amount_to_be_paid - amount === 0) {
                loan.status = "closed";
            }
            loan.amount_to_be_paid -= amount;
            loan.save((err, loan) => {
                const transaction = new Transaction({
                    amount: amount,
                    loan_account_id: id,
                    date,
                });
                transaction.save(async (err, transaction) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            message: err.message || "Some error occured",
                            err,
                        });
                    } else {
                        const summary = await Summary.findOne({
                            fin_year: fiscalYr,
                        });
                        if (!summary) {
                            const newSummary = new Summary({
                                fin_year: fiscalYr,
                                amount_taken: req.body.amount,
                                amount_invested: 0,
                            });
                            await newSummary.save();
                        } else {
                            summary.amount_taken += +req.body.amount;
                            await summary.save();
                        }
                        Borrower.findById(loan.borrower_id)
                            .then((borrower) => {
                                if (!borrower) {
                                    return res.status(404).json({
                                        message: "Borrower not found",
                                    });
                                }

                                return Loan.find({
                                    borrower_id: loan.borrower_id,
                                }).then((loans) => {
                                    if (!loans) {
                                        return res.status(404).json({
                                            message: "Loans not found",
                                        });
                                    }
                                    return res.json({
                                        message: "Entry done successfully",
                                        borrower,
                                        loans,
                                        transaction,
                                    });
                                });
                            })
                            .catch((err) => {
                                return res.status(500).json({
                                    message:
                                        err.message ||
                                        "Some error occurred while retrieving borrower.",
                                });
                            });
                    }
                });
            });
        }
    });
};
