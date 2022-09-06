const mongoose = require("mongoose");

const WithdrawSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Withdraw", WithdrawSchema);
