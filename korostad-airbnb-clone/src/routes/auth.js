const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Register route
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty().trim().escape(),
  body('lastName').notEmpty().trim().escape(),
  body('phoneNumber').notEmpty().isMobilePhone()
], register);

// Login route
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists().notEmpty()
], login);

// Get user profile (protected)
router.get('/profile', authenticate, getProfile);

// Update user profile (protected)
router.put('/profile', authenticate, [
  body('firstName').optional().trim().escape(),
  body('lastName').optional().trim().escape(),
  body('phoneNumber').optional().isMobilePhone(),
  body('profileImage').optional().isURL()
], updateProfile);

module.exports = router;