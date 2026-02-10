const Review = require('../models/Review');
const Booking = require('../models/Booking');

// Create a new review
const createReview = async (req, res) => {
  try {
    const { propertyId, bookingId, rating, cleanliness, accuracy, communication, location, value, comment } = req.body;

    // Verify the booking exists and belongs to the user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.guestId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only review your own bookings.'
      });
    }

    // Check if booking is completed (reviews can only be left for completed bookings)
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be left for completed bookings'
      });
    }

    // Check if user has already reviewed this booking
    const existingReview = await Review.findByBookingId(bookingId);
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this booking'
      });
    }

    // Validate rating values
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Validate optional rating values if provided
    const optionalRatings = [cleanliness, accuracy, communication, location, value];
    for (const ratingValue of optionalRatings) {
      if (ratingValue !== undefined && (ratingValue < 1 || ratingValue > 5)) {
        return res.status(400).json({
          success: false,
          message: 'All ratings must be between 1 and 5'
        });
      }
    }

    const reviewData = {
      propertyId,
      guestId: req.user.id,
      bookingId,
      rating,
      cleanliness,
      accuracy,
      communication,
      location,
      value,
      comment
    };

    const review = await Review.create(reviewData);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get reviews for a property
const getPropertyReviews = async (req, res) => {
  try {
    const { id } = req.params; // property ID
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };

    const reviews = await Review.findByPropertyId(id, filters);
    const avgRatings = await Review.calculateAverageRatings(id);

    res.status(200).json({
      success: true,
      reviews,
      averageRating: parseFloat(avgRatings.overall) || 0,
      totalReviews: parseInt(avgRatings.totalReviews) || 0,
      ratingBreakdown: {
        cleanliness: parseFloat(avgRatings.cleanliness) || 0,
        accuracy: parseFloat(avgRatings.accuracy) || 0,
        communication: parseFloat(avgRatings.communication) || 0,
        location: parseFloat(avgRatings.location) || 0,
        value: parseFloat(avgRatings.value) || 0
      }
    });
  } catch (error) {
    console.error('Get property reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update a review (own review only)
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, cleanliness, accuracy, communication, location, value, comment } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review or is an admin
    if (review.guestId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own reviews.'
      });
    }

    // Validate rating values
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Validate optional rating values if provided
    const optionalRatings = [cleanliness, accuracy, communication, location, value];
    for (const ratingValue of optionalRatings) {
      if (ratingValue !== undefined && (ratingValue < 1 || ratingValue > 5)) {
        return res.status(400).json({
          success: false,
          message: 'All ratings must be between 1 and 5'
        });
      }
    }

    const updatedReview = await Review.update(id, {
      rating,
      cleanliness,
      accuracy,
      communication,
      location,
      value,
      comment
    });

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete a review (own review or admin)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review or is an admin
    if (review.guestId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own reviews.'
      });
    }

    await Review.delete(id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview
};