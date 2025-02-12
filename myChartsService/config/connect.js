const mongoose = require('mongoose');
const config = require('config');
const url = config.get('mongoURI');

const connectDB = async() => {
    try {
        await mongoose.connect(url,{

            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true

        });

        console.log('MongoDB MyCharts Connected..');

    }catch(err){
        console.error(err.message);
        // exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;