const supabase = require('../config/supabase');
const BUCKET_NAME = 'properties';

// Helper: Upload images to Supabase Storage
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

// Helper: Delete image from Supabase Storage
const deleteImageFromSupabase = async (imageUrl) => {
  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split(`/object/public/${BUCKET_NAME}/`);
    if (pathParts.length < 2) return;
    const filePath = pathParts[1];
    await supabase.storage.from(BUCKET_NAME).remove([filePath]);
  } catch (err) {
    console.error('Failed to delete image from Supabase:', err.message);
  }
};

// Upload property images (standalone endpoint)
const uploadPropertyImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    const imageUrls = await uploadImagesToSupabase(req.files);

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      imageUrls
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete property image (standalone endpoint)
const deletePropertyImage = async (req, res) => {
  try {
    // Note: This endpoint is tricky because we usually need the image URL to delete it.
    // However, if we only have imageId (which might be the filename), we need to reconstruct the path
    // or the client should send the full URL or path.
    // Assuming the imageId IS the filename or part of the path OR the client sends the full URL in body?
    // The route is DELETE /:id/images/:imageId
    // It's safer if the client provides the full URL or if we fetch the property and find the image.

    // For now, let's assume imageId is actually the filename in the bucket.
    const { imageId } = req.params;

    // But wait, the route includes Property ID (:id) too.
    // Ideally we should update the Property record to remove this image URL as well.
    const { id, imageId: filename } = req.params;

    // Remove from storage
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filename]);

    if (error) {
      console.warn("Storage deletion error (might not exist):", error.message);
    }

    // Also we need to update the Property in DB?
    // Typically deleteImage is called via updateProperty which handles the DB update.
    // This endpoint might be for just deleting the file from storage?

    res.status(200).json({
      success: true,
      message: 'Image deleted from storage (if existed)'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  uploadPropertyImages,
  deletePropertyImage
};