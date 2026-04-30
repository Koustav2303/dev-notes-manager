const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ==========================================
// --- MIDDLEWARE ---
// ==========================================
// Securely allow requests from your Vite React frontend
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Explicitly allows our edit and delete features!
  credentials: true
}));

// Allows Express to read JSON data from the request body
app.use(express.json());

// ==========================================
// --- ROUTES ---
// ==========================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// A simple health-check route to verify the server is awake
app.get('/', (req, res) => {
  res.send('DevNotes API is locked, loaded, and running securely...');
});

// ==========================================
// --- DATABASE CONNECTION & SERVER START ---
// ==========================================
const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    // Only start the server if the database connects successfully
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });