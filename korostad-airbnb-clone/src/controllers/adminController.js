const User = require('../models/User');

const getStats = async (req, res) => {
  try {
    const db = require('../config/db');

    // Get total users count
    const usersResult = await db.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Get total properties count
    const propertiesResult = await db.query('SELECT COUNT(*) as count FROM properties');
    const totalProperties = parseInt(propertiesResult.rows[0].count);

    // Get total bookings count
    const bookingsResult = await db.query('SELECT COUNT(*) as count FROM bookings');
    const totalBookings = parseInt(bookingsResult.rows[0].count);

    // Get total revenue
    const revenueResult = await db.query('SELECT COALESCE(SUM(totalPrice), 0) as total FROM bookings WHERE status = $1', ['confirmed']);
    const totalRevenue = parseFloat(revenueResult.rows[0].total);

    // Get occupancy rate (confirmed bookings / total properties)
    const occupancyRate = totalProperties > 0 ? ((totalBookings / totalProperties) * 100).toFixed(1) : 0;

    // Get recent bookings
    const recentBookingsResult = await db.query(`
      SELECT b.id, b.checkInDate, b.checkOutDate, b.totalPrice, b.status, b.numberOfGuests,
             u.firstName, u.lastName, u.email,
             p.title as propertyTitle
      FROM bookings b
      JOIN users u ON b.guestId = u.id
      JOIN properties p ON b.propertyId = p.id
      ORDER BY b.createdAt DESC
      LIMIT 10
    `);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProperties,
        totalBookings,
        totalRevenue,
        occupancyRate,
        activeUsers: totalUsers // For now, all users are considered active
      },
      recentBookings: recentBookingsResult.rows
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all users with filters
const getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    const users = await User.findAll({ role, page: parseInt(page), limit: parseInt(limit) });

    const db = require('../config/db');
    let countQuery = 'SELECT COUNT(*) FROM users';
    const countValues = [];
    if (role) {
      countQuery += ' WHERE role = $1';
      countValues.push(role);
    }
    const countResult = await db.query(countQuery, countValues);
    const total = parseInt(countResult.rows[0].count);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all properties
const getProperties = async (req, res) => {
  try {
    const Property = require('../models/Property');
    const { page = 1, limit = 10 } = req.query;
    const properties = await Property.findAllAdmin({ page: parseInt(page), limit: parseInt(limit) });

    const db = require('../config/db');
    const countResult = await db.query('SELECT COUNT(*) FROM properties');
    const total = parseInt(countResult.rows[0].count);

    res.status(200).json({
      success: true,
      properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all bookings
const getBookings = async (req, res) => {
  try {
    const db = require('../config/db');
    const { page = 1, limit = 10 } = req.query;

    const result = await db.query(`
      SELECT b.*, u.firstName, u.lastName, u.email, p.title as propertyTitle
      FROM bookings b
      JOIN users u ON b.guestId = u.id
      JOIN properties p ON b.propertyId = p.id
      ORDER BY b.createdAt DESC
      LIMIT $1 OFFSET $2
    `, [parseInt(limit), (parseInt(page) - 1) * parseInt(limit)]);

    const countResult = await db.query('SELECT COUNT(*) FROM bookings');
    const total = parseInt(countResult.rows[0].count);

    res.status(200).json({
      success: true,
      bookings: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['guest', 'host', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Valid roles are: guest, host, admin'
      });
    }

    const db = require('../config/db');
    const result = await db.query(
      'UPDATE users SET role = $1, updatedAt = NOW() WHERE id = $2 RETURNING id, email, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getStats,
  getUsers,
  getProperties,
  getBookings,
  updateUserRole
};