// API endpoints redeployed
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  PROPERTIES: {
    BASE: '/properties',
    IMAGES: (id) => `/properties/${id}/images`,
    PRICING: (id) => `/properties/${id}/pricing`,
    AVAILABILITY: (id) => `/properties/${id}/availability`,
    REVIEWS: (id) => `/properties/${id}/reviews`,
  },
  BOOKINGS: {
    BASE: '/bookings',
    STATUS: (id) => `/bookings/${id}/status`,
  },
  REVIEWS: {
    BASE: '/reviews',
  },
  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users',
    UPDATE_ROLE: (id) => `/admin/users/${id}/role`,
  },
};

// Property types
export const PROPERTY_TYPES = [
  'apartment',
  'house',
  'villa',
  'cabin',
  'cottage',
  'loft',
  'chalet',
  'farmhouse',
  'boat',
  'camper/rv',
  'tiny house',
  'treehouse',
  'dome house',
  'other'
];

// User roles
export const USER_ROLES = {
  GUEST: 'guest',
  HOST: 'host',
  ADMIN: 'admin'
};

// Booking statuses
export const BOOKING_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

// Payment statuses
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
};

// Property statuses
export const PROPERTY_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
};

// Review rating labels
export const RATING_LABELS = {
  CLEANLINESS: 'Cleanliness',
  ACCURACY: 'Accuracy',
  COMMUNICATION: 'Communication',
  LOCATION: 'Location',
  VALUE: 'Value',
};

// Default pagination
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
};