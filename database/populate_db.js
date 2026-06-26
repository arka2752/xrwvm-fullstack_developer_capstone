/**
 * populate_db.js — Seeds the MongoDB database with dealerships and reviews.
 * Usage: node populate_db.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Dealership = require('./models/Dealership');
const Review = require('./models/Review');
const dealerships = require('./data/dealerships.json');
const reviews = require('./data/reviews.json');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/bestcarsdb';

async function seed() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Dealership.deleteMany({});
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert seed data
    await Dealership.insertMany(dealerships);
    console.log(`📦  Inserted ${dealerships.length} dealerships`);

    await Review.insertMany(reviews);
    console.log(`📦  Inserted ${reviews.length} reviews`);

    console.log('✅ Database seeded successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
