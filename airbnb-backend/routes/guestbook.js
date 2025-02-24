import express from 'express';
import GuestEntry from '../models/GuestEntry.js';

const router = express.Router();

// Get all entries
router.get('/', async (req, res) => {
  try {
    const entries = await GuestEntry.find().sort({ date: -1 }); // Most recent first
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new entry
router.post('/', async (req, res) => {
  const entry = new GuestEntry({
    name: req.body.name,
    message: req.body.message,
    rating: req.body.rating
  });

  try {
    const newEntry = await entry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router; 