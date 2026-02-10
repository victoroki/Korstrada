const db = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');

class User {
  static async create(userData) {
    const { email, password, firstName, lastName, role, phoneNumber } = userData;

    // Hash password
    const hashedPassword = await hashPassword(password);

    const query = `
      INSERT INTO users (email, password, firstName, lastName, role, phoneNumber)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, firstName, lastName, role, phoneNumber, createdAt, updatedAt
    `;

    const values = [email, hashedPassword, firstName, lastName, role, phoneNumber];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, firstName, lastName, role, phoneNumber, profileImage, createdAt, updatedAt FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, userData) {
    const { firstName, lastName, phoneNumber, profileImage } = userData;

    // Build dynamic query
    const fields = [];
    const values = [];

    if (firstName !== undefined) {
      fields.push(`firstName = $${fields.length + 1}`);
      values.push(firstName);
    }

    if (lastName !== undefined) {
      fields.push(`lastName = $${fields.length + 1}`);
      values.push(lastName);
    }

    if (phoneNumber !== undefined) {
      fields.push(`phoneNumber = $${fields.length + 1}`);
      values.push(phoneNumber);
    }

    if (profileImage !== undefined) {
      fields.push(`profileImage = $${fields.length + 1}`);
      values.push(profileImage);
    }

    fields.push(`updatedAt = $${fields.length + 1}`);
    values.push(new Date());

    if (fields.length === 1) { // Only updatedAt was added
      return this.findById(id);
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${fields.length} RETURNING *`;

    const result = await db.query(query, [...values, id]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    const { role, page = 1, limit = 10 } = filters;
    let query = 'SELECT id, email, firstName, lastName, role, phoneNumber, profileImage, createdAt, updatedAt FROM users';
    const values = [];

    if (role) {
      query += ' WHERE role = $1';
      values.push(role);
    }

    query += ` ORDER BY createdAt DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    const offset = (page - 1) * limit;

    const result = await db.query(query, [...values, limit, offset]);
    return result.rows;
  }

  static async comparePassword(inputPassword, hashedPassword) {
    return await comparePassword(inputPassword, hashedPassword);
  }
}

module.exports = User;