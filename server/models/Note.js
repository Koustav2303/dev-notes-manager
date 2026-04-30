const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  // The user field links this specific note to a registered user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'javascript'
  }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);