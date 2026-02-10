const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesByHost,
} = require('../controllers/propertyController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// ─── Multer setup: store files in memory so we can stream to Supabase ────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /api/properties
router.get('/', getAllProperties);

// GET /api/properties/:id
router.get('/:id', getPropertyById);

// POST /api/properties  →  multipart/form-data with field "images" (up to 10 files)
router.post(
  '/',
  authenticate,
  authorizeRole(['host', 'admin']),
  upload.array('images', 10),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional().isLength({ max: 5000 }),
    body('propertyType').optional().isIn(['apartment', 'house', 'villa', 'cabin', 'other']),
    body('maxGuests').optional().isInt({ min: 1 }),
    body('bedrooms').optional().isInt({ min: 0 }),
    body('bathrooms').optional().isInt({ min: 0 }),
    body('address').optional().trim(),
    body('city').optional().trim(),
    body('country').optional().trim(),
    body('amenities').optional(),
  ],
  createProperty
);

// PUT /api/properties/:id  →  multipart/form-data with optional new "images"
router.put(
  '/:id',
  authenticate,
  authorizeRole(['host', 'admin']),
  upload.array('images', 10),
  [
    body('title').optional().notEmpty(),
    body('description').optional().isLength({ max: 5000 }),
    body('propertyType').optional().isIn(['apartment', 'house', 'villa', 'cabin', 'other']),
    body('maxGuests').optional().isInt({ min: 1 }),
    body('bedrooms').optional().isInt({ min: 0 }),
    body('bathrooms').optional().isInt({ min: 0 }),
    body('address').optional().trim(),
    body('city').optional().trim(),
    body('country').optional().trim(),
    body('amenities').optional(),
  ],
  updateProperty
);

// DELETE /api/properties/:id
router.delete('/:id', authenticate, authorizeRole(['host', 'admin']), deleteProperty);

// GET /api/properties/host/:hostId
router.get('/host/:hostId', authenticate, authorizeRole(['host', 'admin']), getPropertiesByHost);

module.exports = router;