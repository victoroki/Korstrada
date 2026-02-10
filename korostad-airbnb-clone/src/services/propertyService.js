// services/propertyService.js
// Helper functions for calling property API endpoints with image uploads

import api from './api'; // your existing axios instance

/**
 * Create a new property with images.
 *
 * Usage:
 *   const files = e.target.files;  // from <input type="file" multiple>
 *   await createProperty({ title: 'Beach House', city: 'Mombasa', ... }, files);
 */
export const createProperty = async (formData, imageFiles = []) => {
    const data = new FormData();

    // Append all text fields
    Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            // e.g. amenities: ['wifi', 'pool']
            value.forEach((v) => data.append(key, v));
        } else if (value !== undefined && value !== null) {
            data.append(key, value);
        }
    });

    // Append image files under the field name "images"
    imageFiles.forEach((file) => data.append('images', file));

    const response = await api.post('/properties', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
};

/**
 * Update a property. Optionally upload new images or delete existing ones.
 *
 * @param {string|number} id            - Property ID
 * @param {object}        formData      - Fields to update
 * @param {File[]}        newImageFiles - New image files to upload (optional)
 * @param {string[]}      deleteImages  - Array of existing image URLs to remove (optional)
 */
export const updateProperty = async (id, formData, newImageFiles = [], deleteImages = []) => {
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((v) => data.append(key, v));
        } else if (value !== undefined && value !== null) {
            data.append(key, value);
        }
    });

    // New files to upload
    newImageFiles.forEach((file) => data.append('images', file));

    // URLs of images to delete from storage
    deleteImages.forEach((url) => data.append('deleteImages', url));

    const response = await api.put(`/properties/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
};