const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const creditsSchema = new Schema({
    userEmail: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    sub: {
        type: Number,
        required: true
    },
    added: {
        type: Number,
        required: true
    }
}, {
    versionKey: false
});

const Credits = mongoose.model('Credits', creditsSchema);
module.exports = Credits;
