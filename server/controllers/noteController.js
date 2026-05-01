const Note = require('../models/Note');

// @desc    Get notes for the logged-in user ONLY
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
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
    // 1. Extract the new fields from the request body
    const { title, content, language, folder, tags } = req.body;

    // 2. Save them to the database
    const note = await Note.create({
      title,
      content,
      language,
      folder: folder || 'Uncategorized',
      tags: tags || [],
      user: req.user.id, 
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    // 1. Check if note exists
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // 2. Check if the logged-in user actually owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this note' });
    }

    // 3. Update the note
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Returns the newly updated document
    });

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    // 1. Check if note exists
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // 2. Verify the logged-in user actually owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this note' });
    }

    // 3. THE FIX: Use findByIdAndDelete directly on the Model
    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };