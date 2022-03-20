const router = require("express").Router();
const summaryController = require("../controllers/summary");

// URL: /summary
// Method: GET
// Description: Get total loan accounts of all borrowers
router.get("/", summaryController.getSummary);

router.post("/daily", summaryController.getDailySummary);

router.get("/seven", summaryController.getSevenDaysSummary);

module.exports = router;
