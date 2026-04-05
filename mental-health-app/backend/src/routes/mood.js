const express = require('express');
const Mood = require('../models/Mood');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/mood/ - Log a mood entry (score 1-5, required mood label, optional description)
router.post('/', auth, async (req, res) => {
  try {
    const { mood, moodScore, description } = req.body;
    if (!mood || !moodScore || moodScore < 1 || moodScore > 5) {
      return res.status(400).json({ error: 'Mood (label) and moodScore (1-5) are required.' });
    }
    const moodEntry = new Mood({
      userId: req.user.id,
      mood,
      moodScore,
      description: description || '',
    });
    await moodEntry.save();
    res.status(201).json(moodEntry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to log mood.' });
  }
});

// GET /api/mood/ - Retrieve mood history for the authenticated user with date filtering
router.get('/', auth, async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = { userId: req.user.id };
    if (start || end) {
      query.createdAt = {};
      if (start) query.createdAt.$gte = new Date(start);
      if (end) query.createdAt.$lte = new Date(end);
    }
    const moods = await Mood.find(query).sort({ createdAt: -1 });
    res.json({ entries: moods });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mood history.' });
  }
});

// DELETE /api/mood/:id - Delete a mood entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!mood) {
      return res.status(404).json({ error: 'Mood entry not found.' });
    }
    res.json({ message: 'Mood entry deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete mood entry.' });
  }
});

// DELETE /api/mood/ - Delete all mood entries for the user
router.delete('/', auth, async (req, res) => {
  try {
    const result = await Mood.deleteMany({ userId: req.user.id });
    res.json({ 
      message: `All mood entries (${result.deletedCount}) deleted successfully.`,
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete mood entries.' });
  }
});

module.exports = router; 