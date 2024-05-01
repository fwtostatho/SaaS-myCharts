const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    numOfCharts: {
        type: Number
    },
    lastLogin: {
        type: Date
    },
    currentLogin: {
        type: Date
    }
}, {
    versionKey: false
});

const User = mongoose.model('User', userSchema);
module.exports = User;
