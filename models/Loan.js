const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    sr_no: {
        type: Number,
        unique: true,
    },
    borrower_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Borrower',
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
    payments: [{
        type: Number,
        required: true,
    }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Loan', LoanSchema);