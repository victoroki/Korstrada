const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getBookingById,
  getUserBookings,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/bookings - Create a new booking (Guest only)
router.post('/', 
  authenticate,
  [
    body('propertyId').isUUID().withMessage('Valid property ID is required'),
    body('checkInDate').isISO8601().withMessage('Valid check-in date is required'),
    body('checkOutDate').isISO8601().withMessage('Valid check-out date is required'),
    body('numberOfGuests').isInt({ min: 1 }).withMessage('Number of guests must be at least 1'),
    body('specialRequests').optional().isLength({ max: 1000 })
  ],
  createBooking
);

// GET /api/bookings - Get bookings for authenticated user (All authenticated users)
router.get('/', 
  authenticate,
  getUserBookings
);

// GET /api/bookings/:id - Get booking by ID
router.get('/:id', 
  authenticate,
  getBookingById
);

// PUT /api/bookings/:id/status - Update booking status (Host/Admin only)
router.put('/:id/status', 
  authenticate,
  authorizeRole(['host', 'admin']),
  [
    body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed'])
      .withMessage('Status must be one of: pending, confirmed, cancelled, completed')
  ],
  updateBookingStatus
);

// DELETE /api/bookings/:id - Cancel booking (Guest can cancel own booking)
router.delete('/:id', 
  authenticate,
  cancelBooking
);

module.exports = router;