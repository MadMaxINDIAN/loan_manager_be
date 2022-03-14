// importing libraries
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// creating an express app
const app = express();

// configuring app
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// listening to port
app.listen(process.env.PORT || 5000, () => {
    console.log('Server started on port 3000');
});