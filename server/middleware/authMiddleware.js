const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if the request has an authorization header that starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (Format is "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID inside the token, but DON'T return their password
      req.user = await User.findById(decoded.id).select('-password');

      // Move on to the next piece of middleware or the actual route
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };