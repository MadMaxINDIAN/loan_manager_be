const router = require("express").Router();
const summaryController = require("../controllers/summary");
const authMiddleware = require("../middleware/auth");

// URL: /summary
// Method: GET
// Description: Get total loan accounts of all borrowers
router.get("/", authMiddleware, summaryController.getSummary);

router.post("/daily", authMiddleware, summaryController.getDailySummary);

router.get("/seven", authMiddleware, summaryController.getSevenDaysSummary);

module.exports = router;
