const Borrower = require("../models/Borrowers");
const { validationResult } = require("express-validator");
const Loan = require("../models/Loan");

exports.getTotalLoanAccounts = (req, res) => {
  Loan.find({})
    .then((loans) => {
      res.json({
        success: true,
        loans: loans.length,
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        message: err.message,
      });
    });
};

exports.addBorrower = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", data: errors.array() });
  }
  Borrower.findOne({
    $or: [{ aadhar: req.body.aadhar }, { name: req.body.name }],
  }).then((borr) => {
    if (borr) {
      return res.status(200).json({
        message: "Borrower found",
        borrower: borr,
      });
    }
    const borrower = new Borrower({
      name: req.body.name,
      contact: req.body.contact,
      aadhar: req.body.aadhar.length ? req.body.aadhar : null,
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
};

exports.updateBorrower = async (req, res) => {
  if (req?.user?.type !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", data: errors.array() });
  }
  const updatedBorrower = await Borrower.findOneAndUpdate(
    { $or: [{ aadhar: req.body.old_aadhar }, { name: req.body.old_name }] },
    {
      name: req.body.name,
      contact: req.body.contact,
      aadhar: req.body.aadhar.length ? req.body.aadhar : null,
      occupation: req.body.occupation,
    },
    { new: true }
  );
  return res.json({ message: "Borrower updated", borrower: updatedBorrower });
};

exports.getBorrowers = async (req, res) => {
  const name = req.query.search;
  if (!isNaN(name)) {
    const loan = await Loan.find({ sr_no: name })
    if (loan.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Loan not found"
      })
    }
    Borrower.findById(loan[0].borrower_id)
      .populate({
        path: 'loans', match: {
          $and: [
            { status: { $eq: 'active' } },
          ]
        }
      })
      .then(borrower => {
        const borrowers = [borrower]
        return res.status(200).json({ message: 'Borrowers fetched successfully', borrowers: borrowers })
      }).catch((err) => {
        return res.status(500).json({
          message:
            err.message || "Some error occurred while retrieving borrowers.",
        });
      })
  } else {
    Borrower.find({ name: { $regex: name, $options: 'i' } })
      .populate({ path: 'loans', match: { status: { $eq: 'active' } } })
      .then(borrowers => borrowers.filter(b => b.loans !== null && b.loans.length !== 0))
      .then(borrowers => {
        return res.status(200).json({ message: 'Borrowers fetched successfully', borrowers: borrowers.slice(0, 10) })
      }).catch((err) => {
        return res.status(500).json({
          message:
            err.message || "Some error occurred while retrieving borrowers.",
        });
      })
  }
};

exports.getBorrower = (req, res) => {
  const id = req.params.id;
  Borrower.findById(id)
    .then((borrower) => {
      if (!borrower) {
        return res.status(404).json({ message: "Borrower not found" });
      }
      return Loan.find({ borrower_id: id }).then((loans) => {
        if (!loans) {
          return res.status(404).json({ message: "Loans not found" });
        }
        return res.json({ message: "Borrower found", borrower, loans });
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message:
          err.message || "Some error occurred while retrieving borrower.",
      });
    });
};

// exports.addLoansToBorrowers = async (req, res) => {
//   try {
//     const loans = await Loan.find()
//     loans.forEach(async (loan) => {
//       const borrower = await Borrower.findById(loan.borrower_id)
//       if (borrower.loans) {
//         const idx = borrower.loans.findIndex(l => l._id.toString() === loan._id.toString())
//         if (idx === -1) {
//           borrower.loans.push(loan._id)
//           await borrower.save()
//         }
//       } else {
//         borrower.loans = []
//         borrower.loans.push(loan._id)
//         await borrower.save()
//       }
//     })
//     const borrower = await Borrower.find({ $or: [{ loans: null, loans: [] }] })
//     res.status(200).json({ message: 'Update successful ', borrower })
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ message: 'Something went wrong' })
//   }
// }

// exports.removeDuplicateArrays = async (req, res) => {
//   try {
//     const borrowers = await Borrower.find()
//     borrowers.forEach(async (borrower) => {
//       let newArr = new Set()
//       newArr = borrower.loans.filter(loan => {
//         const k = loan.toString()
//         return newArr.has(k) ? false : newArr.add(k)
//       })
//       newArr = Array.from(newArr)
//       borrower.loans = newArr
//       await borrower.save()
//     })
//     res.status(200).json({ message: 'Success' })
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ message: 'Something went wrong' })
//   }
// }
