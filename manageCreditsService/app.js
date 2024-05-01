const express = require('express');
const connectDB = require('./config/connect');
const path = require('path');
const cors = require('cors');
const app = express();
const Credits = require('./routes/credits');



app.use(cors());

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//run post and get responses

app.use('/credits',Credits);

app.get('/hello', (req, res) => {
    res.send('Hello');
});


app.listen(process.env.PORT || 4004);

module.exports = app;