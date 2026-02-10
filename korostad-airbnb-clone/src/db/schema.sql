-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('guest', 'host', 'admin');
CREATE TYPE property_status AS ENUM ('active', 'inactive', 'pending');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'guest',
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    phoneNumber VARCHAR(20),
    profileImage TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostId UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    propertyType VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    maxGuests INTEGER DEFAULT 1,
    bedrooms INTEGER DEFAULT 1,
    bathrooms INTEGER DEFAULT 1,
    amenities JSONB,
    images JSONB,
    status property_status DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pricing table
CREATE TABLE pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    propertyId UUID REFERENCES properties(id) ON DELETE CASCADE,
    basePrice DECIMAL(10, 2) NOT NULL,
    weekendPrice DECIMAL(10, 2),
    cleaningFee DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Availability table
CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    propertyId UUID REFERENCES properties(id) ON DELETE CASCADE,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    isAvailable BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    propertyId UUID REFERENCES properties(id) ON DELETE CASCADE,
    guestId UUID REFERENCES users(id) ON DELETE CASCADE,
    checkInDate DATE NOT NULL,
    checkOutDate DATE NOT NULL,
    numberOfGuests INTEGER NOT NULL,
    totalPrice DECIMAL(10, 2) NOT NULL,
    status booking_status DEFAULT 'pending',
    paymentStatus payment_status DEFAULT 'pending',
    specialRequests TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    propertyId UUID REFERENCES properties(id) ON DELETE CASCADE,
    guestId UUID REFERENCES users(id) ON DELETE CASCADE,
    bookingId UUID REFERENCES bookings(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    cleanliness INTEGER CHECK (cleanliness >= 1 AND cleanliness <= 5),
    accuracy INTEGER CHECK (accuracy >= 1 AND accuracy <= 5),
    communication INTEGER CHECK (communication >= 1 AND communication <= 5),
    location INTEGER CHECK (location >= 1 AND location <= 5),
    value INTEGER CHECK (value >= 1 AND value <= 5),
    comment TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_country ON properties(country);
CREATE INDEX idx_properties_host ON properties(hostId);
CREATE INDEX idx_bookings_guest ON bookings(guestId);
CREATE INDEX idx_bookings_property ON bookings(propertyId);
CREATE INDEX idx_availability_property ON availability(propertyId);
CREATE INDEX idx_availability_dates ON availability(startDate, endDate);
CREATE INDEX idx_reviews_property ON reviews(propertyId);
CREATE INDEX idx_users_email ON users(email);