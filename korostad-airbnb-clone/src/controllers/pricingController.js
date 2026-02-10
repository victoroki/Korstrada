const Pricing = require('../models/Pricing');
const Property = require('../models/Property');

// Create or update pricing for a property
const createOrUpdatePricing = async (req, res) => {
  try {
    const { id } = req.params; // property ID
    const { basePrice, weekendPrice, cleaningFee, currency } = req.body;

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
        message: 'Access denied. You can only manage pricing for your own properties.'
      });
    }

    const pricingData = {
      propertyId: id,
      basePrice: parseFloat(basePrice),
      weekendPrice: weekendPrice ? parseFloat(weekendPrice) : null,
      cleaningFee: cleaningFee ? parseFloat(cleaningFee) : null,
      currency: currency || 'USD'
    };

    const pricing = await Pricing.createOrUpdate(pricingData);

    res.status(200).json({
      success: true,
      message: 'Pricing updated successfully',
      pricing
    });
  } catch (error) {
    console.error('Create/update pricing error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get pricing for a property
const getPricing = async (req, res) => {
  try {
    const { id } = req.params; // property ID

    const pricing = await Pricing.getByPropertyId(id);

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing not found for this property'
      });
    }

    res.status(200).json({
      success: true,
      pricing
    });
  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update pricing for a property
const updatePricing = async (req, res) => {
  try {
    const { id } = req.params; // property ID
    const { basePrice, weekendPrice, cleaningFee } = req.body;

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
        message: 'Access denied. You can only manage pricing for your own properties.'
      });
    }

    const pricingData = {
      propertyId: id,
      basePrice: basePrice !== undefined ? parseFloat(basePrice) : undefined,
      weekendPrice: weekendPrice !== undefined ? parseFloat(weekendPrice) : undefined,
      cleaningFee: cleaningFee !== undefined ? parseFloat(cleaningFee) : undefined
    };

    const updatedPricing = await Pricing.update(id, pricingData);

    res.status(200).json({
      success: true,
      message: 'Pricing updated successfully',
      pricing: updatedPricing
    });
  } catch (error) {
    console.error('Update pricing error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createOrUpdatePricing,
  getPricing,
  updatePricing
};