require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const dealershipRoutes = require('./routes/dealerships');
const reviewRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 3030;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/bestcarsdb';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', dealershipRoutes);
app.use('/', reviewRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'database-service' }));

// Connect to MongoDB then start server
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(`✅ Connected to MongoDB at ${MONGO_URL}`);
    app.listen(PORT, () => console.log(`🚀 Database service running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
