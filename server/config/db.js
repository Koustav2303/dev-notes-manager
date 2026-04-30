const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // This now looks for the MONGO_URI in your .env file!
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // We put the safety crash back in
  }
};

module.exports = connectDB;