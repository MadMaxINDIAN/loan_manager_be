// importing libraries
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// creating an express app
const app = express();

// configuring app
app.use(cors());
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// connecting to the database
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });

// routers
const borrowerRouter = require('./routers/borrower');
const loanRouter = require('./routers/loan');
const transactionRouter = require('./routers/transaction');

// routes
app.use('/borrower', borrowerRouter);
app.use('/loan', loanRouter);
app.use('/transaction', transactionRouter);

// listening to port
app.listen(process.env.PORT || 5000, () => {
    console.log('Server started on port 3000');
});