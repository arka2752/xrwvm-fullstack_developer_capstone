const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  dealership: { type: Number, required: true },   // references Dealership.id
  review: { type: String, required: true },
  purchase: { type: Boolean, default: false },
  purchase_date: { type: String },
  car_make: { type: String },
  car_model: { type: String },
  car_year: { type: Number },
  sentiment: { type: String, enum: ['positive', 'negative', 'neutral'], default: 'neutral' },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
