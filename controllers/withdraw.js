const Withdraw = require("../models/Withdraw");

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

exports.getDetailsWithdrawTransaction = async (req, res) => {
    return res.json({ success: true, withdraw: (await Withdraw.find()).map(doc => ({ id: doc._id, createdAt: doc.createdAt, name: doc.name, amount: doc.amount, type: doc.type || "Withdraw" })) });
}

exports.addNewWithdrawTransaction = async (req, res) => {
    if (req.user.type !== "admin") {
        return res.status(401).json({
            message: "Not authorised"
        })
    }

    if (!req?.body?.name) {
        return res.status(400).json({
            message: "Name is required"
        })
    }

    if (!req?.body?.amount) {
        return res.status(400).json({
            message: "Amount is required"
        })
    }

    const withdraw = await Withdraw.create(req.body);

    return res.json({
        success: true,
        message: "Transaction added",
        withdraw
    })
};

exports.fetchWithdrawAndAdd = async (req, res) => {
    if (req.user.type !== 'admin') {
        res.status(401).json({ message: 'Not authorized' })
    }
    try {
        const withdrawals = await Withdraw.aggregate([
            {
                $match: { type: 'Withdraw' }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                },
            },
        ])
        const investments = await Withdraw.aggregate([
            {
                $match: { type: 'Add' }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                },
            },
        ])
        res.status(200).json({ message: 'Success', withdrawal: withdrawals[0].total || 0, investment: investments[0].total || 0 })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err?.message || 'Something went wrong' })
    }
}