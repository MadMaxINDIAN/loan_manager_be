const router = require("express").Router();
const Loan = require("../models/Loan");

// URL: /loan/add
// Method: POST
// Description: Add a loan account
router.post("/add", (req, res) => {
    const daily = req.body.loan_amount*1.2/60;
    const amount_to_be_paid = req.body.loan_amount*1.2 - daily;
    // array of length 60
    const payments = [];
    for (let i = 0; i < 60; i++) {
        payments.push(0);
    }
    payments[0] = daily;
    const loan = new Loan({
        sr_no: req.body.sr_no,
        borrower_id: req.body.borrower_id,
        loan_amount: req.body.loan_amount,
        amount_to_be_paid: amount_to_be_paid,
        daily_payment: daily,
        payments: payments,
    });
    loan.save((err, loan) => {
        if (err) {
        return res.status(500).send({
            message: err.message || "Some error occurred while creating the loan.",
        });
        } else {
        return res.send(loan);
        }
    });
});

module.exports = router;
