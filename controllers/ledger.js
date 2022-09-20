const Loan = require("../models/Loan");
const Transaction = require("../models/Transaction");
const Withdraw = require("../models/Withdraw");

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

exports.createLedger = async (req, res) => {
    if (req.user.type !== 'admin') {
        return res.status(401).json({ message: 'Not authorized!' })
    }
    try {
        let lb = new Date('2022-01-01')
        let ub = lb.addDays(1)
        const ledger = []

        // Calculating initial investment
        let investmentsArr = await Withdraw.aggregate([
            {
                $match: {
                    $and: [
                        { type: 'Add' },
                        { date: { $gte: lb, $lt: ub } }
                    ]
                }
            },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ])
        let investment = investmentsArr[0]?.total || 0
        // Calculating initial withdrawal
        let withdrawalsArr = await Withdraw.aggregate([
            {
                $match: {
                    $and: [
                        { type: 'Withdraw' },
                        { date: { $gte: lb, $lt: ub } }
                    ]
                }
            },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ])
        let withdraw = withdrawalsArr[0]?.total || 0
        // Calculating initial loan amount
        let loanAmountArr = await Loan.aggregate([
            { $match: { opening_date: { $gte: lb, $lt: ub } } },
            { $group: { _id: null, total: { $sum: "$loan_amount" } } },
        ]);
        let loanAmount = loanAmountArr[0]?.total || 0
        // Calculating initial received amount
        let recievedAmountArr = await Transaction.aggregate([
            { $match: { date: { $gte: lb, $lt: ub } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        let recieved = recievedAmountArr[0]?.total || 0
        ledger.push({
            id: lb,
            date: lb,
            opening_balance: 0,
            investment,
            recieved,
            loanAmount,
            withdraw,
            closing_balance: investment + recieved - loanAmount - withdraw
        })

        // Starting the loop 
        let i = 1;
        const finalDate = new Date('2022-09-18')
        // if (process.env.NODE_ENV === "development") {
        //     // ONLY FOR LOCAL TESTING
        //     finalDate.setHours(5, 30, 0, 0);
        // } else {
        //     // ONLY FOR PRODUCTION
        //     finalDate.setHours(0, 0, 0, 0);
        // }
        while (lb < finalDate) {
            lb = lb.addDays(1)
            ub = lb.addDays(1)
            // Calculating investment
            investmentsArr = await Withdraw.aggregate([
                {
                    $match: {
                        $and: [
                            { type: 'Add' },
                            { date: { $gte: lb, $lt: ub } }
                        ]
                    }
                },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ])
            investment = investmentsArr[0]?.total || 0
            // Calculating withdrawal
            withdrawalsArr = await Withdraw.aggregate([
                {
                    $match: {
                        $and: [
                            { type: 'Withdraw' },
                            { date: { $gte: lb, $lt: ub } }
                        ]
                    }
                },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ])
            withdraw = withdrawalsArr[0]?.total || 0
            // Calculating loan amount
            loanAmountArr = await Loan.aggregate([
                { $match: { opening_date: { $gte: lb, $lt: ub } } },
                { $group: { _id: null, total: { $sum: "$loan_amount" } } },
            ]);
            loanAmount = loanAmountArr[0]?.total || 0
            // Calculating received amount
            recievedAmountArr = await Transaction.aggregate([
                { $match: { date: { $gte: lb, $lt: ub } } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]);
            recieved = recievedAmountArr[0]?.total || 0
            ledger.push({
                id: lb,
                date: lb,
                opening_balance: ledger[i - 1].closing_balance,
                investment,
                recieved,
                loanAmount,
                withdraw,
                closing_balance: ledger[i - 1].closing_balance + investment + recieved - loanAmount - withdraw
            })
            i += 1
        }
        res.status(200).json({ message: 'Ledger created', ledger })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message || 'Something went wrong' })
    }
}

exports.createLedger2 = async (req, res) => {
    if (req.user.type !== 'admin') {
        return res.status(401).json({ message: 'Not authorized!' })
    }
    try {
        let lb = new Date('2022-01-01')
        let ub = new Date()
        if (process.env.NODE_ENV === "development") {
            // ONLY FOR LOCAL TESTING
            ub.setHours(5, 30, 0, 0);
        } else {
            // ONLY FOR PRODUCTION
            ub.setHours(0, 0, 0, 0);
        }
        ub = ub.addDays(1)
        const ledger = []

        // Calculating initial investment
        let investmentsArr = await Withdraw.aggregate([
            {
                $match: {
                    $and: [
                        { type: 'Add' },
                        { date: { $gte: lb, $lt: ub } }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" },
                    }, total: { $sum: "$amount" }
                }
            },
            {
                $sort: { '_id': 1 }
            }
        ])
        // Calculating initial withdrawal
        let withdrawalsArr = await Withdraw.aggregate([
            {
                $match: {
                    $and: [
                        { type: 'Withdraw' },
                        { date: { $gte: lb, $lt: ub } }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" },
                    }, total: { $sum: "$amount" }
                }
            },
            {
                $sort: { '_id': 1 }
            }
        ])
        // // Calculating initial loan amount
        let loanAmountArr = await Loan.aggregate([
            { $match: { opening_date: { $gte: lb, $lt: ub } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$opening_date" },
                    }, total: { $sum: "$loan_amount" }
                }
            },
            {
                $sort: { '_id': 1 }
            }
        ]);
        // // Calculating initial received amount
        let recievedAmountArr = await Transaction.aggregate([
            { $match: { date: { $gte: lb, $lt: ub } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" },
                    }, total: { $sum: "$amount" }
                }
            },
            {
                $sort: { '_id': 1 }
            }
        ]);
        let date = new Date('2022-01-01')
        let finalDate = new Date()
        if (process.env.NODE_ENV === "development") {
            // ONLY FOR LOCAL TESTING
            finalDate.setHours(5, 30, 0, 0);
        } else {
            // ONLY FOR PRODUCTION
            finalDate.setHours(0, 0, 0, 0);
        }
        let i = 0, j = 0, k = 0, l = 0
        let opening_balance = 0
        while (date <= finalDate) {
            const data = {
                id: date,
                opening_balance: opening_balance,
                investment: 0,
                withdraw: 0,
                loanAmount: 0,
                recieved: 0,
                closing_balance: opening_balance
            }
            if (investmentsArr[i]?._id === date.toLocaleDateString('fr-CA')) {
                data.investment = investmentsArr[i]?.total
                i += 1
            }
            if (withdrawalsArr[j]?._id === date.toLocaleDateString('fr-CA')) {
                data.withdraw = withdrawalsArr[j]?.total
                j += 1
            }
            if (loanAmountArr[k]?._id === date.toLocaleDateString('fr-CA')) {
                data.loanAmount = loanAmountArr[k]?.total
                k += 1
            }
            if (recievedAmountArr[l]?._id === date.toLocaleDateString('fr-CA')) {
                data.recieved = recievedAmountArr[l]?.total
                l += 1
            }
            opening_balance += data.recieved + data.investment - data.withdraw - data.loanAmount
            data.closing_balance = opening_balance
            date = date.addDays(1)
            ledger.push(data)
        }
        res.status(200).json({ message: 'Ledger created', ledger })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message || 'Something went wrong' })
    }
}