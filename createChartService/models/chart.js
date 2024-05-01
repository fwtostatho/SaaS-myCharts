const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chartSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    cost: {
        type: String,
        required: true
    },
    chartName: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    form: {
        type: Object,
        required: true
    }
}, {
    versionKey: false
});

const Chart = mongoose.model('Chart', chartSchema);
module.exports = Chart;
