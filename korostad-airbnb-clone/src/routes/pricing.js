const express = require('express');
const { body } = require('express-validator');
const {
  createOrUpdatePricing,
  getPricing,
  updatePricing
} = require('../controllers/pricingController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/properties/:id/pricing - Create or update pricing for a property (Host/Admin only)
router.post('/:id/pricing', 
  authenticate,
  authorizeRole(['host', 'admin']),
  [
    body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
    body('weekendPrice').optional().isFloat({ min: 0 }).withMessage('Weekend price must be a positive number'),
    body('cleaningFee').optional().isFloat({ min: 0 }).withMessage('Cleaning fee must be a positive number'),
    body('currency').optional().isAlpha().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code (e.g., USD)')
  ],
  createOrUpdatePricing
);

// GET /api/properties/:id/pricing - Get pricing for a property
router.get('/:id/pricing', 
  getPricing
);

// PUT /api/properties/:id/pricing - Update pricing for a property (Host/Admin only)
router.put('/:id/pricing', 
  authenticate,
  authorizeRole(['host', 'admin']),
  [
    body('basePrice').optional().isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
    body('weekendPrice').optional().isFloat({ min: 0 }).withMessage('Weekend price must be a positive number'),
    body('cleaningFee').optional().isFloat({ min: 0 }).withMessage('Cleaning fee must be a positive number')
  ],
  updatePricing
);

module.exports = router;