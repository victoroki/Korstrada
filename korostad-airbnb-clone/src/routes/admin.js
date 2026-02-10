const express = require('express');
const { body } = require('express-validator');
const {
  getStats,
  getUsers,
  getProperties,
  getBookings,
  updateUserRole
} = require('../controllers/adminController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/stats - Get admin statistics (Admin only)
router.get('/stats',
  authenticate,
  authorizeRole(['admin']),
  getStats
);

// GET /api/admin/users - Get all users with filters (Admin only)
router.get('/users',
  authenticate,
  authorizeRole(['admin']),
  getUsers
);

// GET /api/admin/properties - Get all properties (Admin only)
router.get('/properties',
  authenticate,
  authorizeRole(['admin']),
  getProperties
);

// GET /api/admin/bookings - Get all bookings (Admin only)
router.get('/bookings',
  authenticate,
  authorizeRole(['admin']),
  getBookings
);

// PUT /api/admin/users/:id/role - Update user role (Admin only)
router.put('/users/:id/role',
  authenticate,
  authorizeRole(['admin']),
  [
    body('role').isIn(['guest', 'host', 'admin']).withMessage('Role must be one of: guest, host, admin')
  ],
  updateUserRole
);

module.exports = router;