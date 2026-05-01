const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Please add a text value'],
  },
  content: {
    type: String,
    required: [true, 'Please add some code content'],
  },
  language: {
    type: String,
    default: 'javascript',
  },
  // --- NEW FIELDS GIVEN BELOW ---
  folder: {
    type: String,
    default: 'Uncategorized',
  },
  tags: {
    type: [String],
    default: [],
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Note', noteSchema);