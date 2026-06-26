const express = require('express');
const router = express.Router();
const Dealership = require('../models/Dealership');

// GET /fetchDealers — all dealers
router.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealership.find({});
    res.json({ status: 200, dealers });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
});

// GET /fetchDealers/:state — dealers filtered by state (2-letter code)
router.get('/fetchDealers/:state', async (req, res) => {
  try {
    const { state } = req.params;
    const dealers = await Dealership.find({ st: state.toUpperCase() });
    res.json({ status: 200, dealers });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
});

// GET /fetchDealer/:id — single dealer by numeric id
router.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealer = await Dealership.findOne({ id: Number(req.params.id) });
    if (!dealer) return res.status(404).json({ status: 404, message: 'Dealer not found' });
    res.json({ status: 200, dealer });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
});

module.exports = router;
