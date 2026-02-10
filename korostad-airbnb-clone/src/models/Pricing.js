const db = require('../config/db');

class Pricing {
  // Create or update pricing for a property
  static async createOrUpdate(pricingData) {
    const {
      propertyId,
      basePrice,
      weekendPrice,
      cleaningFee,
      currency
    } = pricingData;

    // Check if pricing already exists for this property
    const existingPricing = await this.getByPropertyId(propertyId);

    let query, values;
    if (existingPricing) {
      // Update existing pricing
      query = `
        UPDATE pricing 
        SET basePrice = $1, weekendPrice = $2, cleaningFee = $3, currency = $4, updatedAt = CURRENT_TIMESTAMP
        WHERE propertyId = $5
        RETURNING *
      `;
      values = [basePrice, weekendPrice, cleaningFee, currency || 'USD', propertyId];
    } else {
      // Create new pricing
      query = `
        INSERT INTO pricing (propertyId, basePrice, weekendPrice, cleaningFee, currency)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      values = [propertyId, basePrice, weekendPrice, cleaningFee, currency || 'USD'];
    }

    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Get pricing by property ID
  static async getByPropertyId(propertyId) {
    const query = 'SELECT * FROM pricing WHERE propertyId = $1';
    const result = await db.query(query, [propertyId]);
    return result.rows[0];
  }

  // Update pricing
  static async update(propertyId, pricingData) {
    const {
      basePrice,
      weekendPrice,
      cleaningFee
    } = pricingData;

    // Build dynamic query
    const fields = [];
    const values = [];

    if (basePrice !== undefined) {
      fields.push(`basePrice = $${fields.length + 1}`);
      values.push(basePrice);
    }

    if (weekendPrice !== undefined) {
      fields.push(`weekendPrice = $${fields.length + 1}`);
      values.push(weekendPrice);
    }

    if (cleaningFee !== undefined) {
      fields.push(`cleaningFee = $${fields.length + 1}`);
      values.push(cleaningFee);
    }

    fields.push(`updatedAt = $${fields.length + 1}`);
    values.push(new Date());

    if (fields.length === 1) { // Only updatedAt was added
      return this.getByPropertyId(propertyId);
    }

    const query = `UPDATE pricing SET ${fields.join(', ')} WHERE propertyId = $${fields.length} RETURNING *`;

    const result = await db.query(query, [...values, propertyId]);
    return result.rows[0];
  }

  // Delete pricing (should only be done when deleting a property)
  static async delete(propertyId) {
    const query = 'DELETE FROM pricing WHERE propertyId = $1 RETURNING *';
    const result = await db.query(query, [propertyId]);
    return result.rows[0];
  }

  // Calculate total price for a booking
  static async calculateTotalPrice(propertyId, checkInDate, checkOutDate, numberOfGuests) {
    const pricing = await this.getByPropertyId(propertyId);
    if (!pricing) {
      throw new Error('Pricing not found for this property');
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    // Calculate number of nights
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    // For simplicity, we'll use base price for all nights
    // In a real implementation, you would factor in weekend rates, seasonal rates, etc.
    let totalPrice = pricing.basePrice * nights;
    
    // Add cleaning fee if applicable
    if (pricing.cleaningFee) {
      totalPrice += pricing.cleaningFee;
    }

    return {
      basePrice: pricing.basePrice,
      cleaningFee: pricing.cleaningFee || 0,
      nights,
      totalPrice
    };
  }
}

module.exports = Pricing;