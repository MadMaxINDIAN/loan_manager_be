const mongoose = require('mongoose');

const BorrowerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    contact: {
        type: String,
    },
    aadhar: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
    },
});

module.exports = mongoose.model('Borrower', BorrowerSchema);