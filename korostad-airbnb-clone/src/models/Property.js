const db = require('../config/db');

class Property {
  // Create a new property
  static async create(propertyData) {
    const {
      hostId,
      title,
      description,
      propertyType,
      address,
      city,
      country,
      latitude,
      longitude,
      maxGuests,
      bedrooms,
      bathrooms,
      amenities,
      images,
      basePrice
    } = propertyData;

    const query = `
      INSERT INTO properties (
        hostId, title, description, propertyType, address, city, country,
        latitude, longitude, maxGuests, bedrooms, bathrooms, amenities, images, basePrice
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const values = [
      hostId, title, description, propertyType, address, city, country,
      latitude, longitude, maxGuests, bedrooms, bathrooms,
      amenities ? JSON.stringify(amenities) : null,
      images ? JSON.stringify(images) : null,
      basePrice
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Find property by ID
  static async findById(id) {
    const query = `
      SELECT p.*, u.firstName as hostFirstName, u.lastName as hostLastName
      FROM properties p
      JOIN users u ON p.hostId = u.id
      WHERE p.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Find properties with filters
  static async findAll(filters = {}) {
    const {
      city,
      maxGuests,
      checkIn,
      checkOut,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10
    } = filters;

    let query = `
      SELECT p.*, u.firstName as hostFirstName, u.lastName as hostLastName
      FROM properties p
      JOIN users u ON p.hostId = u.id
      WHERE p.status = 'active'
    `;

    const values = [];
    let paramCount = 0;

    if (city) {
      paramCount++;
      query += ` AND p.city ILIKE $${paramCount}`;
      values.push(`%${city}%`);
    }

    if (maxGuests) {
      paramCount++;
      query += ` AND p.maxGuests >= $${paramCount}`;
      values.push(maxGuests);
    }

    // Check availability if dates are provided
    if (checkIn && checkOut) {
      // This is a simplified check - in a real app, you'd check against the availability table
      paramCount++;
      query += ` AND p.id NOT IN (
        SELECT DISTINCT b.propertyId 
        FROM bookings b 
        WHERE b.checkInDate < $${paramCount} AND b.checkOutDate > $${paramCount + 1}
      )`;
      values.push(checkOut, checkIn);
      paramCount += 2;
    }

    query += ` ORDER BY p.createdAt DESC`;

    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    values.push(limit, offset);

    const result = await db.query(query, values);
    return result.rows;
  }

  // Find properties for admin (no status filter)
  static async findAllAdmin(filters = {}) {
    const { page = 1, limit = 10 } = filters;
    const query = `
      SELECT p.*, u.firstName as hostFirstName, u.lastName as hostLastName
      FROM properties p
      JOIN users u ON p.hostId = u.id
      ORDER BY p.createdAt DESC
      LIMIT $1 OFFSET $2
    `;
    const offset = (page - 1) * limit;
    const result = await db.query(query, [limit, offset]);
    return result.rows;
  }

  // Find properties by host ID
  static async findByHostId(hostId) {
    const query = `
      SELECT * FROM properties
      WHERE hostId = $1
      ORDER BY createdAt DESC
    `;
    const result = await db.query(query, [hostId]);
    return result.rows;
  }

  // Update a property
  static async update(id, propertyData) {
    const {
      title,
      description,
      propertyType,
      address,
      city,
      country,
      latitude,
      longitude,
      maxGuests,
      bedrooms,
      bathrooms,
      amenities,
      images,
      status
    } = propertyData;

    // Build dynamic query
    const fields = [];
    const values = [];

    if (title !== undefined) {
      fields.push(`title = $${fields.length + 1}`);
      values.push(title);
    }

    if (description !== undefined) {
      fields.push(`description = $${fields.length + 1}`);
      values.push(description);
    }

    if (propertyType !== undefined) {
      fields.push(`propertyType = $${fields.length + 1}`);
      values.push(propertyType);
    }

    if (address !== undefined) {
      fields.push(`address = $${fields.length + 1}`);
      values.push(address);
    }

    if (city !== undefined) {
      fields.push(`city = $${fields.length + 1}`);
      values.push(city);
    }

    if (country !== undefined) {
      fields.push(`country = $${fields.length + 1}`);
      values.push(country);
    }

    if (latitude !== undefined) {
      fields.push(`latitude = $${fields.length + 1}`);
      values.push(latitude);
    }

    if (longitude !== undefined) {
      fields.push(`longitude = $${fields.length + 1}`);
      values.push(longitude);
    }

    if (maxGuests !== undefined) {
      fields.push(`maxGuests = $${fields.length + 1}`);
      values.push(maxGuests);
    }

    if (bedrooms !== undefined) {
      fields.push(`bedrooms = $${fields.length + 1}`);
      values.push(bedrooms);
    }

    if (bathrooms !== undefined) {
      fields.push(`bathrooms = $${fields.length + 1}`);
      values.push(bathrooms);
    }

    if (amenities !== undefined) {
      fields.push(`amenities = $${fields.length + 1}`);
      const amenitiesArr = Array.isArray(amenities) ? amenities : (amenities ? [amenities] : []);
      values.push(JSON.stringify(amenitiesArr));
    }

    if (images !== undefined) {
      fields.push(`images = $${fields.length + 1}`);
      const imagesArr = Array.isArray(images) ? images : (images ? [images] : []);
      values.push(JSON.stringify(imagesArr));
    }

    if (status !== undefined) {
      fields.push(`status = $${fields.length + 1}`);
      values.push(status);
    }

    fields.push(`updatedAt = $${fields.length + 1}`);
    values.push(new Date());

    if (fields.length === 1) { // Only updatedAt was added
      return this.findById(id);
    }

    const query = `UPDATE properties SET ${fields.join(', ')} WHERE id = $${values.length + 1} RETURNING *`;

    const result = await db.query(query, [...values, id]);
    return result.rows[0];
  }

  // Delete a property
  static async delete(id) {
    const query = 'DELETE FROM properties WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Property;