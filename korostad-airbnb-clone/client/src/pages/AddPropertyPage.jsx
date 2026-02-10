import React, { useState } from 'react';
import AdminSidebar from '../components/admin/Sidebar';
import api from '../services/api';
import { createProperty as createPropertyService } from '../services/propertyService';
import { useNavigate } from 'react-router-dom';

const AddPropertyPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        propertyType: 'apartment',
        address: '',
        city: '',
        country: '',
        basePrice: '',
        maxGuests: '2',
        bedrooms: '1',
        bathrooms: '1',
        amenities: [],
        images: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // Use the service which handles FormData conversion
            const response = await createPropertyService(formData);
            if (response.success) {
                alert('Property added successfully!');
                navigate('/dashboard/admin/properties');
            }
        } catch (error) {
            console.error('Error adding property:', error);
            alert('Failed to add property');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            <main className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Add New Property</h1>
                        <p className="text-gray-500 font-medium">Create a new listing for the platform.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Property Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="e.g. Modern Beachfront Villa"
                                    className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#ec6d13] focus:bg-white transition-all font-medium"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Property Type</label>
                                <select
                                    name="propertyType"
                                    className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#ec6d13] focus:bg-white transition-all font-medium"
                                    value={formData.propertyType}
                                    onChange={handleChange}
                                >
                                    <option value="apartment">Apartment</option>
                                    <option value="house">House</option>
                                    <option value="cabin">Cabin</option>
                                    <option value="villa">Villa</option>
                                </select>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Description</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#ec6d13] focus:bg-white transition-all font-medium"
                                    placeholder="Tell us about the property..."
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-3">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Location Details</h3>
                            </div>
                            <div className="md:col-span-3 space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Street Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#ec6d13] transition-all font-medium"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#ec6d13] transition-all font-medium"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#ec6d13] transition-all font-medium"
                                    value={formData.country}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Price per Night ($)</label>
                                <input
                                    type="number"
                                    name="basePrice"
                                    className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#ec6d13] transition-all font-medium"
                                    value={formData.basePrice}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Capacity */}
                        <div className="pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-sm font-bold text-gray-900 border-b border-gray-100 pb-8">
                            <div className="space-y-2">
                                <span className="material-symbols-outlined text-[#ec6d13] block text-3xl mb-1">group</span>
                                <label className="block uppercase tracking-wider">Max Guests</label>
                                <input type="number" name="maxGuests" className="w-20 mx-auto text-center bg-gray-50 rounded-xl p-2 border-none font-bold" value={formData.maxGuests} onChange={handleChange} />
                            </div>
                            <div className="space-y-2 border-x border-gray-100">
                                <span className="material-symbols-outlined text-[#ec6d13] block text-3xl mb-1">king_bed</span>
                                <label className="block uppercase tracking-wider">Bedrooms</label>
                                <input type="number" name="bedrooms" className="w-20 mx-auto text-center bg-gray-50 rounded-xl p-2 border-none font-bold" value={formData.bedrooms} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <span className="material-symbols-outlined text-[#ec6d13] block text-3xl mb-1">bathtub</span>
                                <label className="block uppercase tracking-wider">Bathrooms</label>
                                <input type="number" name="bathrooms" className="w-20 mx-auto text-center bg-gray-50 rounded-xl p-2 border-none font-bold" value={formData.bathrooms} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="pt-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900">Property Photos</h3>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{formData.images.length}/15 images</span>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all group">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-[#ec6d13] mb-2">cloud_upload</span>
                                                <p className="mb-2 text-sm text-gray-500 font-bold uppercase tracking-wider">Click to upload photos</p>
                                                <p className="text-xs text-gray-400">PNG, JPG or WebP (Max 5MB)</p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                multiple
                                                disabled={formData.images.length >= 15 || loading}
                                                onChange={async (e) => {
                                                    const files = Array.from(e.target.files);
                                                    if (files.length === 0) return;

                                                    // Filter for max 15 images total
                                                    const remainingSlots = 15 - formData.images.length;
                                                    const filesToUpload = files.slice(0, remainingSlots);

                                                    if (files.length > remainingSlots) {
                                                        alert(`You can only upload ${remainingSlots} more images.`);
                                                    }

                                                    const { supabase } = await import('../services/supabaseClient');

                                                    for (const file of filesToUpload) {
                                                        try {
                                                            const fileDisplayName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
                                                            const { data, error } = await supabase.storage
                                                                .from('properties')
                                                                .upload(`property-images/${fileDisplayName}`, file);

                                                            if (error) throw error;

                                                            const { data: { publicUrl } } = supabase.storage
                                                                .from('properties')
                                                                .getPublicUrl(data.path);

                                                            setFormData(prev => ({ ...prev, images: [...prev.images, publicUrl] }));
                                                        } catch (err) {
                                                            console.error('Upload error:', err);
                                                            alert(`Failed to upload ${file.name}`);
                                                        }
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>

                                    <div className="flex gap-4 overflow-x-auto pb-4">
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className="relative size-28 flex-shrink-0 group">
                                                <img src={img} className="w-full h-full object-cover rounded-2xl border-2 border-white shadow-sm group-hover:border-[#ec6d13] transition-all" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full size-7 flex items-center justify-center shadow-lg hover:bg-red-600 transition-all hover:scale-110"
                                                >
                                                    <span className="material-symbols-outlined text-sm font-bold">close</span>
                                                </button>
                                            </div>
                                        ))}
                                        {formData.images.length === 0 && (
                                            <div className="flex-1 py-4 text-center">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No images uploaded yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard/admin/properties')}
                                className="flex-1 py-4 px-6 rounded-2xl border-2 border-gray-100 font-bold text-gray-500 hover:bg-gray-50 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] py-4 px-6 rounded-2xl bg-[#ec6d13] text-white font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Adding Property...' : 'Save Property'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddPropertyPage;
