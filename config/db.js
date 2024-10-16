const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const ENV_VARS  = require('./ennvVars')
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(ENV_VARS.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}