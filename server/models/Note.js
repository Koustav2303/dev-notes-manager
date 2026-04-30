const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // }, // We will uncomment this when we build the JWT Authentication system!
  
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isPinned: {
    type: Boolean,
    default: false,
  }
}, {
  // Automatically adds 'createdAt' and 'updatedAt' timestamps to every note
  timestamps: true 
});

module.exports = mongoose.model('Note', noteSchema);