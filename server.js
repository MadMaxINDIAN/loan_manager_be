// importing libraries
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");

// creating an express app
const app = express();

// configuring app
app.use(morgan("dev"));
app.use(cors());
dotenv.config();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// connecting to the database
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// routers
const borrowerRouter = require("./routers/borrower");
const loanRouter = require("./routers/loan");
const transactionRouter = require("./routers/transaction");
const summaryRouter = require("./routers/summary");
const authRouter = require("./routers/auth");
const withdrawRouter = require("./routers/withdraw");
const ledgerRouter = require('./routers/ledger')

// routes
app.use("/borrower", borrowerRouter);
app.use("/loan", loanRouter);
app.use("/transaction", transactionRouter);
app.use("/summary", summaryRouter);
app.use("/auth", authRouter);
app.use("/withdraw", withdrawRouter);
app.use('/ledger', ledgerRouter)

app.get("/", (req, res) => {
  console.log("Server is up...");
  res.send("Hello Madhuresh");
})

// listening to port
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server started on port ${process.env.PORT || 5000}`);
});

// merge
