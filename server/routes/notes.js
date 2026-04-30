const express = require('express');
const router = express.Router();
const { getNotes, createNote } = require('../controllers/noteController');

// Import the Security Guard middleware
const { protect } = require('../middleware/authMiddleware');

// Add the 'protect' middleware before the controller functions
// If 'protect' fails, the request never reaches getNotes or createNote
router.route('/')
  .get(protect, getNotes)
  .post(protect, createNote);

module.exports = router;