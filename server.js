const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ENV_VARS = require('./config/ennvVars');
const app = express();

// Middleware
app.use(express.json()); 
app.use(cors());


//connect Database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));


app.get('/', (req, res) => {
    res.send('ECOMMERCE-BACKEND');    
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})