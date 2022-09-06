const { addNewWithdrawTransaction } = require("../controllers/withdraw");
const authMiddleware = require("../middleware/auth");
const Withdraw = require("../models/Withdraw");
const router = require("express").Router();

// URL: /withdraw/transaction
// Method: POST
router.post("/transaction", authMiddleware, addNewWithdrawTransaction);

router.get("/total", authMiddleware, async (req, res) => {
    const amount = await Withdraw.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      return res.json({
        total: amount[0].total
      })
})

module.exports = router;
