const express = require('express');
const { body } = require('express-validator');
const {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/reviews - Create a new review (Guest only, after completed booking)
router.post('/', 
  authenticate,
  [
    body('propertyId').isUUID().withMessage('Valid property ID is required'),
    body('bookingId').isUUID().withMessage('Valid booking ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('cleanliness').optional().isInt({ min: 1, max: 5 }).withMessage('Cleanliness rating must be between 1 and 5'),
    body('accuracy').optional().isInt({ min: 1, max: 5 }).withMessage('Accuracy rating must be between 1 and 5'),
    body('communication').optional().isInt({ min: 1, max: 5 }).withMessage('Communication rating must be between 1 and 5'),
    body('location').optional().isInt({ min: 1, max: 5 }).withMessage('Location rating must be between 1 and 5'),
    body('value').optional().isInt({ min: 1, max: 5 }).withMessage('Value rating must be between 1 and 5'),
    body('comment').optional().isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters')
  ],
  createReview
);

// GET /api/properties/:id/reviews - Get reviews for a property
router.get('/properties/:id/reviews', 
  getPropertyReviews
);

// PUT /api/reviews/:id - Update a review (Own review only)
router.put('/:id', 
  authenticate,
  [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('cleanliness').optional().isInt({ min: 1, max: 5 }).withMessage('Cleanliness rating must be between 1 and 5'),
    body('accuracy').optional().isInt({ min: 1, max: 5 }).withMessage('Accuracy rating must be between 1 and 5'),
    body('communication').optional().isInt({ min: 1, max: 5 }).withMessage('Communication rating must be between 1 and 5'),
    body('location').optional().isInt({ min: 1, max: 5 }).withMessage('Location rating must be between 1 and 5'),
    body('value').optional().isInt({ min: 1, max: 5 }).withMessage('Value rating must be between 1 and 5'),
    body('comment').optional().isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters')
  ],
  updateReview
);

// DELETE /api/reviews/:id - Delete a review (Own review or Admin)
router.delete('/:id', 
  authenticate,
  deleteReview
);

module.exports = router;