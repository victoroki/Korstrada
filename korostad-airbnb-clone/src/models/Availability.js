const db = require('../config/db');

class Availability {
  // Create availability record
  static async create(availabilityData) {
    const {
      propertyId,
      startDate,
      endDate,
      isAvailable
    } = availabilityData;

    const query = `
      INSERT INTO availability (propertyId, startDate, endDate, isAvailable)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [propertyId, startDate, endDate, isAvailable !== false]; // Default to true if not specified

    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Find availability by property ID and date range
  static async findByPropertyAndDateRange(propertyId, startDate, endDate) {
    const query = `
      SELECT * FROM availability
      WHERE propertyId = $1
      AND startDate <= $3
      AND endDate >= $2
      ORDER BY startDate
    `;
    const result = await db.query(query, [propertyId, startDate, endDate]);
    return result.rows;
  }

  // Find all availability for a property
  static async findByPropertyId(propertyId, filters = {}) {
    const { startDate, endDate } = filters;

    let query = 'SELECT * FROM availability WHERE propertyId = $1';
    const values = [propertyId];
    let paramCount = 1;

    if (startDate) {
      paramCount++;
      query += ` AND endDate >= $${paramCount}`;
      values.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND startDate <= $${paramCount}`;
      values.push(endDate);
    }

    query += ' ORDER BY startDate';

    const result = await db.query(query, values);
    return result.rows;
  }

  // Check if property is available for a date range
  static async isAvailable(propertyId, checkInDate, checkOutDate) {
    // First, check if there are any explicit unavailability records
    const query = `
      SELECT * FROM availability
      WHERE propertyId = $1
      AND startDate < $2
      AND endDate > $3
      AND isAvailable = false
    `;
    
    const result = await db.query(query, [propertyId, checkOutDate, checkInDate]);
    
    // If there's an unavailability record overlapping the requested dates, return false
    if (result.rows.length > 0) {
      return false;
    }

    // If no unavailability records overlap, assume it's available
    // In a real implementation, you might want to check against a default availability
    return true;
  }

  // Update availability
  static async update(availabilityId, availabilityData) {
    const {
      startDate,
      endDate,
      isAvailable
    } = availabilityData;

    // Build dynamic query
    const fields = [];
    const values = [];

    if (startDate !== undefined) {
      fields.push(`startDate = $${fields.length + 1}`);
      values.push(startDate);
    }

    if (endDate !== undefined) {
      fields.push(`endDate = $${fields.length + 1}`);
      values.push(endDate);
    }

    if (isAvailable !== undefined) {
      fields.push(`isAvailable = $${fields.length + 1}`);
      values.push(isAvailable);
    }

    fields.push(`createdAt = $${fields.length + 1}`); // Using createdAt as updatedAt equivalent for this table
    values.push(new Date());

    if (fields.length === 1) { // Only createdAt was added
      return this.findById(availabilityId);
    }

    const query = `UPDATE availability SET ${fields.join(', ')} WHERE id = $${fields.length} RETURNING *`;

    const result = await db.query(query, [...values, availabilityId]);
    return result.rows[0];
  }

  // Delete availability
  static async delete(availabilityId) {
    const query = 'DELETE FROM availability WHERE id = $1 RETURNING *';
    const result = await db.query(query, [availabilityId]);
    return result.rows[0];
  }

  // Find availability by ID
  static async findById(id) {
    const query = 'SELECT * FROM availability WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Availability;