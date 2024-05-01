const express = require('express');
const connectDB = require('./config/connect');
const path = require('path');
const cors = require('cors');
const app = express();
const User = require('./routes/user');
const Credits = require('./routes/credits');

const port = 4000; // Specify the port number your app will listen on
const address = '0.0.0.0'; // Specify the address to listen on


app.use(cors());

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//run post and get responses
app.use('/user',User);
app.use('/credits',Credits);
app.get('/hello', (req, res) => {
    res.send('Hello');
});


//app.listen(process.env.PORT || 4000);

//app.listen(process.env.PORT || 4002);
app.listen(port, address, () => {
    console.log(`App listening at ${address}:${port}`);
});

module.exports = app;