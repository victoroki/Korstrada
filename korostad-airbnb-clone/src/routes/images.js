const express = require('express');
const { uploadPropertyImages, deletePropertyImage } = require('../controllers/imageController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/properties/:id/images - Upload images for a property (Host/Admin only)
router.post('/:id/images', 
  authenticate, 
  authorizeRole(['host', 'admin']), 
  uploadPropertyImages
);

// DELETE /api/properties/:id/images/:imageId - Delete an image from a property (Host/Admin only)
router.delete('/:id/images/:imageId', 
  authenticate, 
  authorizeRole(['host', 'admin']), 
  deletePropertyImage
);

module.exports = router;