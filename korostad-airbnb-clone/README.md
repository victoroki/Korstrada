# Airbnb Clone - Full-Stack Application

This is a complete full-stack Airbnb clone built with Node.js/Express on the backend and React/Vite on the frontend, featuring role-based access control, property management, booking system, and more.

## Features

- **User Authentication**: JWT-based authentication with role-based access control (guest, host, admin)
- **Property Management**: CRUD operations for properties with images, pricing, and availability
- **Booking System**: Complete booking workflow with status management
- **Reviews & Ratings**: Detailed review system with multiple rating categories
- **Image Upload**: Multer integration with Cloudinary for image handling
- **Responsive UI**: Built with Tailwind CSS for mobile-first design
- **Security**: Password hashing with bcrypt, input validation, and secure token handling

## Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL database
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Express-validator for input validation
- Helmet and CORS for security

### Frontend
- React.js with Vite
- React Router for navigation
- Redux Toolkit for state management
- Axios for API calls
- React Hook Form for form handling
- Tailwind CSS for styling

## Database Schema

The application uses PostgreSQL with the following tables:
- Users: Stores user information with roles (guest, host, admin)
- Properties: Property listings with details, location, and host information
- Pricing: Property-specific pricing information
- Availability: Calendar-based availability management
- Bookings: Complete booking system with status tracking
- Reviews: Detailed review system with multiple rating categories

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Properties
- `GET /api/properties` - Get all properties with filters
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create a new property (Host/Admin only)
- `PUT /api/properties/:id` - Update a property (Host/Admin only)
- `DELETE /api/properties/:id` - Delete a property (Host/Admin only)

### Images
- `POST /api/properties/:id/images` - Upload property images (Host/Admin only)
- `DELETE /api/properties/:id/images/:imageId` - Delete property image (Host/Admin only)

### Pricing
- `POST /api/properties/:id/pricing` - Set property pricing (Host/Admin only)
- `PUT /api/properties/:id/pricing` - Update property pricing (Host/Admin only)
- `GET /api/properties/:id/pricing` - Get property pricing

### Availability
- `POST /api/properties/:id/availability` - Set property availability (Host/Admin only)
- `GET /api/properties/:id/availability` - Get property availability
- `PUT /api/properties/:id/availability/:availabilityId` - Update availability (Host/Admin only)
- `DELETE /api/properties/:id/availability/:availabilityId` - Delete availability (Host/Admin only)

### Bookings
- `POST /api/bookings` - Create a new booking (Guest only)
- `GET /api/bookings` - Get user's bookings (Authenticated users)
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/status` - Update booking status (Host/Admin only)
- `DELETE /api/bookings/:id` - Cancel booking (Guest or Admin)

### Reviews
- `POST /api/reviews` - Create a review (Guest only, after completed booking)
- `GET /api/properties/:id/reviews` - Get property reviews
- `PUT /api/reviews/:id` - Update own review
- `DELETE /api/reviews/:id` - Delete own review or Admin

### Admin
- `GET /api/admin/stats` - Get platform statistics (Admin only)
- `GET /api/admin/users` - Get all users (Admin only)
- `PUT /api/admin/users/:id/role` - Update user role (Admin only)

## Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```
4. Set up environment variables in `.env` file
5. Run database migrations
6. Start the server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/airbnb_clone
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=24h
REFRESH_TOKEN_SECRET=another_secret_key
REFRESH_TOKEN_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run frontend` - Start the frontend development server
- `npm run both` - Start both servers concurrently

## Security Features

- Passwords are hashed using bcrypt with 10 rounds
- JWT tokens with 24-hour expiration
- Refresh tokens stored in httpOnly cookies
- Input validation with express-validator
- Protection against SQL injection with parameterized queries
- Rate limiting on authentication routes
- Helmet.js for security headers
- File upload validation and size limits

## Folder Structure

```
korostad-airbnb-clone/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API route definitions
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── config/          # Configuration files
│   └── db/              # Database schema and migrations
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service functions
│   │   ├── context/     # React Context providers
│   │   ├── hooks/       # Custom React hooks
│   │   └── utils/       # Utility functions
├── .env                 # Environment variables
├── .gitignore
└── package.json
```