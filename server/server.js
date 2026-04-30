const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Points to your database connection file

// Load environment variables (like your secret MongoDB connection string)
dotenv.config();

// Initialize the database connection
connectDB();

// Initialize the Express application
const app = express();

// --- Middleware ---
// CORS allows your React app (running on a different port) to talk to this backend
app.use(cors()); 
// This allows your server to accept and read JSON data sent in requests
app.use(express.json()); 

// --- API Routes ---
// Any request that starts with '/api/notes' is sent to your notes routing file
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// A simple health check route so you can test if the server is awake in your browser
app.get('/', (req, res) => {
  res.send('DevNotes API is up and running smoothly...');
});

// --- Server Startup ---
// Use the port from your .env file, or default to 5000
const PORT = process.env.PORT || 5001; // Changed to 5001

app.listen(PORT, () => {
  console.log(`Server is running in development mode on port ${PORT}`);
});