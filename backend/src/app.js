const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const { connectDB } = require('./config/db');

const app = express();

// Middleware
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api', routes());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});