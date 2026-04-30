const Note = require('../models/Note');

// @desc    Get all notes
// @route   GET /api/notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new note
// @route   POST /api/notes
const createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const newNote = await Note.create({ title, content, tags });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getNotes, createNote };