const db = require('../config/db');

class Booking {
  // Create a new booking
  static async create(bookingData) {
    const {
      propertyId,
      guestId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
      specialRequests
    } = bookingData;

    const query = `
      INSERT INTO bookings (
        propertyId, guestId, checkInDate, checkOutDate, numberOfGuests, 
        totalPrice, specialRequests, status, paymentStatus
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', 'pending')
      RETURNING *
    `;

    const values = [
      propertyId, guestId, checkInDate, checkOutDate, 
      numberOfGuests, totalPrice, specialRequests || null
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Find booking by ID
  static async findById(id) {
    const query = `
      SELECT b.*, 
             p.title as propertyName, 
             p.city as propertyCity, 
             p.country as propertyCountry
      FROM bookings b
      JOIN properties p ON b.propertyId = p.id
      WHERE b.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Find bookings by user ID (guest)
  static async findByUserId(userId, filters = {}) {
    const { status, page = 1, limit = 10 } = filters;

    let query = `
      SELECT b.*, 
             p.title as propertyName, 
             p.city as propertyCity, 
             p.country as propertyCountry,
             p.images[1] as propertyImage
      FROM bookings b
      JOIN properties p ON b.propertyId = p.id
      WHERE b.guestId = $1
    `;

    const values = [userId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND b.status = $${paramCount}`;
      values.push(status);
    }

    query += ` ORDER BY b.createdAt DESC`;

    // Add pagination
    const offset = (page - 1) * limit;
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    values.push(limit);

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    values.push(offset);

    const result = await db.query(query, values);
    return result.rows;
  }

  // Find bookings by property ID (host)
  static async findByPropertyId(propertyId, filters = {}) {
    const { status, page = 1, limit = 10 } = filters;

    let query = `
      SELECT b.*, 
             u.firstName as guestFirstName, 
             u.lastName as guestLastName,
             u.profileImage as guestProfileImage
      FROM bookings b
      JOIN users u ON b.guestId = u.id
      WHERE b.propertyId = $1
    `;

    const values = [propertyId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND b.status = $${paramCount}`;
      values.push(status);
    }

    query += ` ORDER BY b.createdAt DESC`;

    // Add pagination
    const offset = (page - 1) * limit;
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    values.push(limit);

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    values.push(offset);

    const result = await db.query(query, values);
    return result.rows;
  }

  // Update booking status
  static async updateStatus(bookingId, status) {
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const query = `
      UPDATE bookings 
      SET status = $1, updatedAt = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `;

    const result = await db.query(query, [status, bookingId]);
    return result.rows[0];
  }

  // Cancel a booking
  static async cancel(bookingId) {
    const query = `
      UPDATE bookings 
      SET status = 'cancelled', updatedAt = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;

    const result = await db.query(query, [bookingId]);
    return result.rows[0];
  }

  // Find bookings by date range for a property (to check availability)
  static async findConflictingBookings(propertyId, checkInDate, checkOutDate) {
    const query = `
      SELECT id, checkInDate, checkOutDate, status
      FROM bookings
      WHERE propertyId = $1
      AND status != 'cancelled'
      AND checkInDate < $2
      AND checkOutDate > $3
    `;

    const result = await db.query(query, [propertyId, checkOutDate, checkInDate]);
    return result.rows;
  }
}

module.exports = Booking;