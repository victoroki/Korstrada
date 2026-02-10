const Availability = require('../models/Availability');
const Property = require('../models/Property');

// Create availability for a property
const createAvailability = async (req, res) => {
  try {
    const { id } = req.params; // property ID
    const { startDate, endDate, isAvailable } = req.body;

    // Verify the property exists and belongs to the user
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user is the host of the property or an admin
    if (property.hostId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only manage availability for your own properties.'
      });
    }

    const availabilityData = {
      propertyId: id,
      startDate,
      endDate,
      isAvailable: isAvailable !== undefined ? isAvailable : true
    };

    const availability = await Availability.create(availabilityData);

    res.status(201).json({
      success: true,
      message: 'Availability created successfully',
      availability
    });
  } catch (error) {
    console.error('Create availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get availability for a property
const getPropertyAvailability = async (req, res) => {
  try {
    const { id } = req.params; // property ID
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    const availability = await Availability.findByPropertyId(id, filters);

    res.status(200).json({
      success: true,
      availability
    });
  } catch (error) {
    console.error('Get property availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update availability
const updateAvailability = async (req, res) => {
  try {
    const { id, availabilityId } = req.params;
    const { startDate, endDate, isAvailable } = req.body;

    // Verify the property exists and belongs to the user
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user is the host of the property or an admin
    if (property.hostId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only manage availability for your own properties.'
      });
    }

    // Verify that the availability record belongs to this property
    const existingAvailability = await Availability.findById(availabilityId);
    if (!existingAvailability || existingAvailability.propertyId !== id) {
      return res.status(404).json({
        success: false,
        message: 'Availability record not found'
      });
    }

    const availabilityData = {
      startDate,
      endDate,
      isAvailable
    };

    const updatedAvailability = await Availability.update(availabilityId, availabilityData);

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      availability: updatedAvailability
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete availability
const deleteAvailability = async (req, res) => {
  try {
    const { id, availabilityId } = req.params;

    // Verify the property exists and belongs to the user
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user is the host of the property or an admin
    if (property.hostId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only manage availability for your own properties.'
      });
    }

    // Verify that the availability record belongs to this property
    const existingAvailability = await Availability.findById(availabilityId);
    if (!existingAvailability || existingAvailability.propertyId !== id) {
      return res.status(404).json({
        success: false,
        message: 'Availability record not found'
      });
    }

    await Availability.delete(availabilityId);

    res.status(200).json({
      success: true,
      message: 'Availability deleted successfully'
    });
  } catch (error) {
    console.error('Delete availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createAvailability,
  getPropertyAvailability,
  updateAvailability,
  deleteAvailability
};