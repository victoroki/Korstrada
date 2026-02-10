const Property = require('../models/Property');
const supabase = require('../config/supabase');

const BUCKET_NAME = 'properties';

// ─── Helper: Upload images to Supabase Storage ────────────────────────────────
const uploadImagesToSupabase = async (files) => {
  const uploadedUrls = [];

  for (const file of files) {
    const ext = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw new Error(`Failed to upload image: ${error.message}`);

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    uploadedUrls.push(publicUrlData.publicUrl);
  }

  return uploadedUrls;
};

// ─── Helper: Delete image from Supabase Storage ───────────────────────────────
const deleteImageFromSupabase = async (imageUrl) => {
  try {
    // Extract filename from full public URL
    // e.g. https://xxx.supabase.co/storage/v1/object/public/properties/1234-abc.jpg
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split(`/object/public/${BUCKET_NAME}/`);
    if (pathParts.length < 2) return;
    const filePath = pathParts[1];
    await supabase.storage.from(BUCKET_NAME).remove([filePath]);
  } catch (err) {
    console.error('Failed to delete image from Supabase:', err.message);
  }
};

// ─── Get all properties ───────────────────────────────────────────────────────
const getAllProperties = async (req, res) => {
  try {
    const filters = {
      city: req.query.city,
      maxGuests: req.query.maxGuests,
      checkIn: req.query.checkIn,
      checkOut: req.query.checkOut,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    };

    const properties = await Property.findAll(filters);

    res.status(200).json({
      success: true,
      properties,
      pagination: { page: filters.page, limit: filters.limit, total: properties.length },
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Get property by ID ───────────────────────────────────────────────────────
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.status(200).json({ success: true, property });
  } catch (error) {
    console.error('Get property by ID error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Create property ──────────────────────────────────────────────────────────
// Route must use multer middleware (see routes/properties.js changes below)
const createProperty = async (req, res) => {
  try {
    let imageUrls = [];

    // 1. Existing URLs from frontend (already in Supabase or elsewhere)
    if (req.body.images) {
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    } else if (req.body.existingImages) {
      imageUrls = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
    }

    // 2. Upload new image files
    if (req.files && req.files.length > 0) {
      const uploadedUrls = await uploadImagesToSupabase(req.files);
      imageUrls = [...imageUrls, ...uploadedUrls];
    }

    const propertyData = {
      ...req.body,
      hostId: req.user.id,
      images: imageUrls,
    };

    if (!propertyData.title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const property = await Property.create(propertyData);
    res.status(201).json({ success: true, message: 'Property created successfully', property });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (existingProperty.hostid !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own properties.',
      });
    }

    // 1. Use images from frontend as base (this captures current order/deletions from UI)
    let imageUrls = [];
    if (req.body.images) {
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    } else {
      imageUrls = existingProperty.images || [];
    }

    // 2. Upload new files if provided
    if (req.files && req.files.length > 0) {
      const newUrls = await uploadImagesToSupabase(req.files);
      imageUrls = [...imageUrls, ...newUrls];
    }

    // 3. Explicit deletions if requested
    if (req.body.deleteImages) {
      const toDelete = Array.isArray(req.body.deleteImages) ? req.body.deleteImages : [req.body.deleteImages];
      for (const url of toDelete) {
        await deleteImageFromSupabase(url);
        imageUrls = imageUrls.filter(u => u !== url);
      }
    }

    const updatedProperty = await Property.update(id, { ...req.body, images: imageUrls });
    res.status(200).json({ success: true, message: 'Property updated successfully', property: updatedProperty });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Delete property ──────────────────────────────────────────────────────────
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (existingProperty.hostid !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own properties.',
      });
    }

    // Clean up images from Supabase Storage before deleting the DB record
    if (existingProperty.images && existingProperty.images.length > 0) {
      for (const url of existingProperty.images) await deleteImageFromSupabase(url);
    }

    await Property.delete(id);
    res.status(200).json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Get properties by host ───────────────────────────────────────────────────
const getPropertiesByHost = async (req, res) => {
  try {
    const { hostId } = req.params;

    if (req.user.id !== hostId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const properties = await Property.findByHostId(hostId);
    res.status(200).json({ success: true, properties });
  } catch (error) {
    console.error('Get properties by host error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesByHost,
};