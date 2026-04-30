const express = require('express');
const router = express.Router();

// Import the logic from our controller
const { getNotes, createNote } = require('../controllers/noteController');

// Map the specific routes to their controller functions
router.route('/').get(getNotes).post(createNote);
// We will add PUT /api/notes/:id and DELETE /api/notes/:id later

module.exports = router;