const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// GET /fetchReviews/:id — all reviews for a given dealer id
router.get('/fetchReviews/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ dealership: Number(req.params.id) }).sort({ createdAt: -1 });
    res.json({ status: 200, reviews });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
});

// POST /insertReview — add a new review
router.post('/insertReview', async (req, res) => {
  try {
    const { id, name, dealership, review, purchase, purchase_date, car_make, car_model, car_year, sentiment } = req.body;

    // auto-generate id if not supplied
    const maxDoc = await Review.findOne({}).sort({ id: -1 });
    const newId = id || (maxDoc ? maxDoc.id + 1 : 1);

    const newReview = new Review({
      id: newId,
      name,
      dealership,
      review,
      purchase,
      purchase_date,
      car_make,
      car_model,
      car_year,
      sentiment: sentiment || 'neutral',
    });

    const saved = await newReview.save();
    res.status(201).json({ status: 201, review: saved });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
});

module.exports = router;
