const Booking = require('../models/Booking');
const Property = require('../models/Property');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { propertyId, checkInDate, checkOutDate, numberOfGuests, specialRequests } = req.body;

    // Verify the property exists and is available
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if the property can accommodate the number of guests
    if (numberOfGuests > property.maxGuests) {
      return res.status(400).json({
        success: false,
        message: `Property can only accommodate up to ${property.maxGuests} guests`
      });
    }

    // Check for conflicting bookings (this is a simplified check)
    const conflictingBookings = await Booking.findConflictingBookings(
      propertyId, 
      checkInDate, 
      checkOutDate
    );

    if (conflictingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for the selected dates'
      });
    }

    // Calculate total price (in a real app, this would involve more complex calculations)
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    // For now, we'll use a fixed rate of $100 per night
    const totalPrice = nights * 100;

    const bookingData = {
      propertyId,
      guestId: req.user.id,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
      specialRequests
    };

    const booking = await Booking.create(bookingData);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if the user is the guest, host, or admin
    if (booking.guestId !== req.user.id && req.user.role !== 'admin') {
      // Check if user is the host of the property
      const property = await Property.findById(booking.propertyId);
      if (property.hostId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get bookings for the authenticated user (guest)
const getUserBookings = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };

    const bookings = await Booking.findByUserId(req.user.id, filters);

    res.status(200).json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update booking status (host/admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the host of the property or an admin
    const property = await Property.findById(booking.propertyId);
    if (property.hostId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only property host or admin can update booking status.'
      });
    }

    const updatedBooking = await Booking.updateStatus(id, status);

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Cancel a booking (guest can cancel their own booking)
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the guest who made the booking or an admin
    if (booking.guestId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the booking owner or admin can cancel this booking.'
      });
    }

    // Cannot cancel if booking is already completed
    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking'
      });
    }

    const cancelledBooking = await Booking.cancel(id);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: cancelledBooking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getUserBookings,
  updateBookingStatus,
  cancelBooking
};