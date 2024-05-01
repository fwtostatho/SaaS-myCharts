const express = require('express');
const connectDB = require('./config/connect');
const path = require('path');
const cors = require('cors');
const app = express();
const User = require('./routes/user');
const Chart = require('./routes/chart');


app.use(cors());

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//run post and get responses
app.use('/user',User);
app.use('/chart',Chart)
app.get('/hello', (req, res) => {
    res.send('Hello');
});


app.listen(process.env.PORT || 4005);

module.exports = app;