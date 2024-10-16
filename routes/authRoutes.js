const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController.js');
const { protect } = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get current user
router.get('/me', protect, getMe);

module.exports = router;
