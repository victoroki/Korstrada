const express = require('express');
const { body } = require('express-validator');
const {
  createAvailability,
  getPropertyAvailability,
  updateAvailability,
  deleteAvailability
} = require('../controllers/availabilityController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/properties/:id/availability - Create availability for a property (Host/Admin only)
router.post('/:id/availability', 
  authenticate,
  authorizeRole(['host', 'admin']),
  [
    body('startDate').isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
    body('endDate').isISO8601().withMessage('End date must be a valid ISO 8601 date'),
    body('isAvailable').optional().isBoolean().withMessage('isAvailable must be a boolean')
  ],
  createAvailability
);

// GET /api/properties/:id/availability - Get availability for a property
router.get('/:id/availability', 
  getPropertyAvailability
);

// PUT /api/properties/:id/availability/:availabilityId - Update availability (Host/Admin only)
router.put('/:id/availability/:availabilityId', 
  authenticate,
  authorizeRole(['host', 'admin']),
  [
    body('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
    body('endDate').optional().isISO8601().withMessage('End date must be a valid ISO 8601 date'),
    body('isAvailable').optional().isBoolean().withMessage('isAvailable must be a boolean')
  ],
  updateAvailability
);

// DELETE /api/properties/:id/availability/:availabilityId - Delete availability (Host/Admin only)
router.delete('/:id/availability/:availabilityId', 
  authenticate,
  authorizeRole(['host', 'admin']),
  deleteAvailability
);

module.exports = router;