const mongoose = require('mongoose');

const dealershipSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  st: { type: String, required: true },       // 2-letter state code
  address: { type: String, required: true },
  zip: { type: String, required: true },
  lat: { type: Number },
  long: { type: Number },
  short_name: { type: String },
  full_name: { type: String, required: true },
});

module.exports = mongoose.model('Dealership', dealershipSchema);
