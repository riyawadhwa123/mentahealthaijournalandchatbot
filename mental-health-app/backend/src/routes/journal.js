const express = require('express');
const Journal = require('../models/Journal');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/journal/ - Create a new journal entry (JWT required)
router.post('/', auth, async (req, res) => {
  try {
    const { content, mood, tags } = req.body;
    if (!content || !mood) {
      return res.status(400).json({ error: 'Content and mood are required.' });
    }
    const journal = new Journal({
      userId: req.user.id,
      content,
      mood,
      tags: Array.isArray(tags) ? tags : [],
    });
    await journal.save();
    res.status(201).json(journal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create journal entry.' });
  }
});

// GET /api/journal/ - Retrieve all journal entries for the authenticated user, sorted by createdAt
router.get('/', auth, async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ entries: journals });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch journal entries.' });
  }
});

// PUT /api/journal/:id - Update a journal entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { content, mood, tags } = req.body;
    const journal = await Journal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { content, mood, tags },
      { new: true, runValidators: true }
    );
    if (!journal) {
      return res.status(404).json({ error: 'Journal entry not found.' });
    }
    res.json(journal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update journal entry.' });
  }
});

// DELETE /api/journal/:id - Delete a journal entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!journal) {
      return res.status(404).json({ error: 'Journal entry not found.' });
    }
    res.json({ message: 'Journal entry deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete journal entry.' });
  }
});

// DELETE /api/journal/ - Delete all journal entries for the user
router.delete('/', auth, async (req, res) => {
  try {
    const result = await Journal.deleteMany({ userId: req.user.id });
    res.json({ 
      message: `All journal entries (${result.deletedCount}) deleted successfully.`,
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete journal entries.' });
  }
});

module.exports = router; 