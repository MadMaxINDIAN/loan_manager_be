const mongoose = require("mongoose");

const WithdrawSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        required: true,
        enum: ["Add", "Withdraw"],
        defaultValue: "Withdraw"
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Withdraw", WithdrawSchema);
