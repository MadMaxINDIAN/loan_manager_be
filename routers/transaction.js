const router = require("express").Router();
const Loan = require("../models/Loan");

// URL: /transaction/:id/add
// Method: POST
// Description: Add a transaction
router.post("/:id/add", (req, res) => {
    const id = req.params.id;
    const { amount, day } = req.body;
    Loan.findById(id, (err, loan) => {
        if (err) {
            res.status(500).send(err);
        } else {
            loan.payments[day] = amount;
            loan.amount_to_be_paid -= amount;
            loan.save((err, loan) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send(loan);
                }
            });
        }
    });
})

module.exports = router;