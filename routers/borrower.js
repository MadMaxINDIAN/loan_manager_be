const router = require("express").Router();
const Borrower = require("../models/Borrowers");

// URL: /borrower/add
// Method: POST
// Description: Add a borrower
router.post("/add", (req, res) => {
  const borrower = new Borrower({
    name: req.body.name,
    address: req.body.address,
    contact: req.body.contact,
    aadhar: req.body.aadhar,
    occupation: req.body.occupation,
  });
  borrower.save((err, borrower) => {
    if (err) {
      return res.status(500).json({
        message:
          err.message || "Some error occurred while creating the borrower.",
      });
    } else {
      return res.json({ message: "Borrower added", borrower });
    }
  });
});

module.exports = router;
