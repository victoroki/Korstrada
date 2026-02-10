const db = require('../config/db');

class Review {
  // Create a new review
  static async create(reviewData) {
    const {
      propertyId,
      guestId,
      bookingId,
      rating,
      cleanliness,
      accuracy,
      communication,
      location,
      value,
      comment
    } = reviewData;

    const query = `
      INSERT INTO reviews (
        propertyId, guestId, bookingId, rating, cleanliness, accuracy, 
        communication, location, value, comment
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      propertyId, guestId, bookingId, rating, 
      cleanliness || rating, accuracy || rating, 
      communication || rating, location || rating, 
      value || rating, comment || null
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Find review by ID
  static async findById(id) {
    const query = `
      SELECT r.*, 
             u.firstName as guestFirstName,
             u.lastName as guestLastName,
             u.profileImage as guestProfileImage
      FROM reviews r
      JOIN users u ON r.guestId = u.id
      WHERE r.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Find reviews by property ID
  static async findByPropertyId(propertyId, filters = {}) {
    const { page = 1, limit = 10 } = filters;

    const query = `
      SELECT r.*, 
             u.firstName as guestFirstName,
             u.lastName as guestLastName,
             u.profileImage as guestProfileImage
      FROM reviews r
      JOIN users u ON r.guestId = u.id
      WHERE r.propertyId = $1
      ORDER BY r.createdAt DESC
      LIMIT $2 OFFSET $3
    `;

    const offset = (page - 1) * limit;
    const result = await db.query(query, [propertyId, limit, offset]);
    return result.rows;
  }

  // Find review by booking ID (to check if user already reviewed)
  static async findByBookingId(bookingId) {
    const query = 'SELECT * FROM reviews WHERE bookingId = $1';
    const result = await db.query(query, [bookingId]);
    return result.rows[0];
  }

  // Calculate average ratings for a property
  static async calculateAverageRatings(propertyId) {
    const query = `
      SELECT 
        AVG(rating) as overall,
        AVG(cleanliness) as cleanliness,
        AVG(accuracy) as accuracy,
        AVG(communication) as communication,
        AVG(location) as location,
        AVG(value) as value,
        COUNT(*) as totalReviews
      FROM reviews
      WHERE propertyId = $1
    `;
    const result = await db.query(query, [propertyId]);
    return result.rows[0];
  }

  // Update a review
  static async update(reviewId, reviewData) {
    const {
      rating,
      cleanliness,
      accuracy,
      communication,
      location,
      value,
      comment
    } = reviewData;

    // Build dynamic query
    const fields = [];
    const values = [];

    if (rating !== undefined) {
      fields.push(`rating = $${fields.length + 1}`);
      values.push(rating);
    }

    if (cleanliness !== undefined) {
      fields.push(`cleanliness = $${fields.length + 1}`);
      values.push(cleanliness);
    }

    if (accuracy !== undefined) {
      fields.push(`accuracy = $${fields.length + 1}`);
      values.push(accuracy);
    }

    if (communication !== undefined) {
      fields.push(`communication = $${fields.length + 1}`);
      values.push(communication);
    }

    if (location !== undefined) {
      fields.push(`location = $${fields.length + 1}`);
      values.push(location);
    }

    if (value !== undefined) {
      fields.push(`value = $${fields.length + 1}`);
      values.push(value);
    }

    if (comment !== undefined) {
      fields.push(`comment = $${fields.length + 1}`);
      values.push(comment);
    }

    fields.push(`updatedAt = $${fields.length + 1}`);
    values.push(new Date());

    if (fields.length === 1) { // Only updatedAt was added
      return this.findById(reviewId);
    }

    const query = `UPDATE reviews SET ${fields.join(', ')} WHERE id = $${fields.length} RETURNING *`;

    const result = await db.query(query, [...values, reviewId]);
    return result.rows[0];
  }

  // Delete a review
  static async delete(reviewId) {
    const query = 'DELETE FROM reviews WHERE id = $1 RETURNING *';
    const result = await db.query(query, [reviewId]);
    return result.rows[0];
  }
}

module.exports = Review;