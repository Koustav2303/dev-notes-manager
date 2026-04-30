const Note = require('../models/Note');

// @desc    Get notes for the logged-in user ONLY
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    // Find notes where the 'user' field matches the ID from our JWT token
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  try {
    const { title, content, language } = req.body;

    const note = await Note.create({
      title,
      content,
      language,
      // Tag the newly created note with the logged-in user's ID
      user: req.user.id, 
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotes, createNote };