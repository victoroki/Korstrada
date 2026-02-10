import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { updateProperty as updatePropertyService } from '../services/propertyService';
import AdminSidebar from '../components/admin/Sidebar';

// ─── Individual image upload state tracker ─────────────────────────────────
// Each item: { id, file, preview, status: 'uploading'|'done'|'error', progress, url }

const AdminPropertyEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadQueue, setUploadQueue] = useState([]); // tracks upload states
    const [deletedImages, setDeletedImages] = useState([]); // tracks URLs to delete from storage
    const fileInputRef = useRef(null);

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
        images: [],
        status: 'pending',
    });

    useEffect(() => { fetchPropertyData(); }, [id]);

    const fetchPropertyData = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/properties/${id}`);
            if (response.data.success) {
                const p = response.data.property;
                setFormData({
                    title: p.title || '',
                    description: p.description || '',
                    propertyType: p.propertytype || 'apartment',
                    address: p.address || '',
                    city: p.city || '',
                    country: p.country || '',
                    basePrice: p.baseprice || '',
                    maxGuests: p.maxguests || '2',
                    bedrooms: p.bedrooms || '1',
                    bathrooms: p.bathrooms || '1',
                    amenities: p.amenities || [],
                    images: p.images || [],
                    status: p.status || 'pending',
                });
            }
        } catch (error) {
            console.error('Error fetching property:', error);
            alert('Failed to load property data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ─── Image upload handler ───────────────────────────────────────────────
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const remainingSlots = 15 - formData.images.length - uploadQueue.filter(u => u.status !== 'error').length;
        const filesToUpload = files.slice(0, remainingSlots);

        if (filesToUpload.length === 0) {
            alert('Maximum 15 images allowed');
            return;
        }

        // Create queue entries with local previews immediately
        const newQueueItems = filesToUpload.map(file => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            file,
            preview: URL.createObjectURL(file),
            status: 'uploading', // uploading | done | error
            progress: 0,
            url: null,
        }));

        setUploadQueue(prev => [...prev, ...newQueueItems]);

        // Upload each file
        const { supabase } = await import('../services/supabaseClient');

        for (const item of newQueueItems) {
            try {
                // Simulate progress in increments (Supabase JS doesn't have progress events)
                const progressInterval = setInterval(() => {
                    setUploadQueue(prev => prev.map(q =>
                        q.id === item.id && q.status === 'uploading'
                            ? { ...q, progress: Math.min(q.progress + Math.random() * 25, 85) }
                            : q
                    ));
                }, 300);

                const fileName = `property-images/${Date.now()}_${item.file.name.replace(/\s+/g, '_')}`;
                const { data, error } = await supabase.storage
                    .from('properties')
                    .upload(fileName, item.file);

                clearInterval(progressInterval);

                if (error) throw error;

                const { data: { publicUrl } } = supabase.storage
                    .from('properties')
                    .getPublicUrl(data.path);

                // Mark as done with 100% progress
                setUploadQueue(prev => prev.map(q =>
                    q.id === item.id
                        ? { ...q, status: 'done', progress: 100, url: publicUrl }
                        : q
                ));

                // Add to formData images
                setFormData(prev => ({ ...prev, images: [...prev.images, publicUrl] }));

            } catch (err) {
                console.error('Upload error:', err);
                setUploadQueue(prev => prev.map(q =>
                    q.id === item.id
                        ? { ...q, status: 'error', progress: 0 }
                        : q
                ));
            }
        }

        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Remove an existing (already saved) image
    const removeExistingImage = (idx) => {
        const imageUrl = formData.images[idx];
        if (imageUrl) {
            setDeletedImages(prev => [...prev, imageUrl]);
        }
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== idx),
        }));
    };

    // Remove a queued upload (cancel/dismiss error)
    const removeQueueItem = (itemId) => {
        const item = uploadQueue.find(q => q.id === itemId);
        if (item?.url) {
            setDeletedImages(prev => [...prev, item.url]);
            // Also remove from formData if it was already added
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter(img => img !== item.url),
            }));
        }
        setUploadQueue(prev => prev.filter(q => q.id !== itemId));
    };

    const totalImages = formData.images.length + uploadQueue.filter(q => q.status === 'uploading').length;
    const isUploading = uploadQueue.some(q => q.status === 'uploading');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isUploading) {
            alert('Please wait for all images to finish uploading.');
            return;
        }
        try {
            setSaving(true);
            // We use the service which converts json to FormData for the multipart backend
            // Pass the local state + things to delete to our service
            const response = await updatePropertyService(id, formData, [], deletedImages);
            if (response.success) {
                navigate('/dashboard/admin/properties');
            }
        } catch (error) {
            console.error('Error updating property:', error);
            alert('Failed to update property');
        } finally {
            setSaving(false);
        }
    };

    const statusConfig = {
        active: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
        pending: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
        inactive: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
    };
    const sc = statusConfig[formData.status] || statusConfig.pending;

    if (loading) {
        return (
            <div className="flex bg-gray-50 min-h-screen">
                <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
                <main className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec6d13]" />
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Loading property…</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            <main className="flex-1 overflow-x-hidden">
                <div className="max-w-4xl mx-auto px-8 py-10">

                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <button
                                onClick={() => navigate('/dashboard/admin/properties')}
                                className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors mb-3"
                            >
                                <span className="material-symbols-outlined text-base">arrow_back</span>
                                Back to Properties
                            </button>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Property</h1>
                            <p className="text-gray-500 font-medium mt-1">Update listing details, photos, and status.</p>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${sc.bg}`}>
                            <span className={`size-2 rounded-full ${sc.dot} animate-pulse`} />
                            <span className={`text-xs font-black uppercase tracking-widest ${sc.text}`}>
                                {formData.status}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* ── Section: Basic Info ─────────────────────────────── */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-base font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#ec6d13]">info</span>
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Property Title</label>
                                    <input
                                        type="text" name="title" required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent focus:bg-white transition-all font-semibold text-gray-800 outline-none"
                                        value={formData.title} onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Property Type</label>
                                    <select
                                        name="propertyType"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent focus:bg-white transition-all font-semibold text-gray-800 outline-none"
                                        value={formData.propertyType} onChange={handleChange}
                                    >
                                        <option value="apartment">Apartment</option>
                                        <option value="house">House</option>
                                        <option value="villa">Villa</option>
                                        <option value="cabin">Cabin</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Listing Status</label>
                                    <select
                                        name="status"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent focus:bg-white transition-all font-semibold text-gray-800 outline-none"
                                        value={formData.status} onChange={handleChange}
                                    >
                                        <option value="pending">Pending Review</option>
                                        <option value="active">Active / Published</option>
                                        <option value="inactive">Inactive / Hidden</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                                    <textarea
                                        name="description" rows="4"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent focus:bg-white transition-all font-semibold text-gray-800 outline-none resize-none"
                                        value={formData.description} onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Section: Location & Price ───────────────────────── */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-base font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#ec6d13]">location_on</span>
                                Location & Pricing
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Street Address</label>
                                    <input
                                        type="text" name="address"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent focus:bg-white transition-all font-semibold text-gray-800 outline-none"
                                        value={formData.address} onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">City</label>
                                    <input type="text" name="city"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent focus:bg-white transition-all font-semibold text-gray-800 outline-none"
                                        value={formData.city} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Country</label>
                                    <input type="text" name="country"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent focus:bg-white transition-all font-semibold text-gray-800 outline-none"
                                        value={formData.country} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Price / Night ($)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">$</span>
                                        <input type="number" name="basePrice"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-8 pr-4 py-3.5 focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent focus:bg-white transition-all font-bold text-gray-800 outline-none"
                                            value={formData.basePrice} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Section: Capacity ───────────────────────────────── */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-base font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#ec6d13]">group</span>
                                Capacity
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { name: 'maxGuests', label: 'Guests', icon: 'group' },
                                    { name: 'bedrooms', label: 'Bedrooms', icon: 'king_bed' },
                                    { name: 'bathrooms', label: 'Bathrooms', icon: 'bathtub' },
                                ].map(({ name, label, icon }) => (
                                    <div key={name} className="bg-gray-50 rounded-2xl p-5 flex flex-col items-center gap-3 border border-gray-100">
                                        <span className="material-symbols-outlined text-2xl text-[#ec6d13]">{icon}</span>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</label>
                                        <div className="flex items-center gap-3">
                                            <button type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, [name]: Math.max(1, parseInt(prev[name] || 1) - 1) }))}
                                                className="size-8 rounded-xl bg-white border border-gray-200 font-black text-gray-500 hover:border-[#ec6d13] hover:text-[#ec6d13] transition-all flex items-center justify-center shadow-sm"
                                            >−</button>
                                            <span className="text-xl font-black text-gray-800 w-6 text-center">{formData[name]}</span>
                                            <button type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, [name]: parseInt(prev[name] || 1) + 1 }))}
                                                className="size-8 rounded-xl bg-white border border-gray-200 font-black text-gray-500 hover:border-[#ec6d13] hover:text-[#ec6d13] transition-all flex items-center justify-center shadow-sm"
                                            >+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Section: Photos ─────────────────────────────────── */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-base font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#ec6d13]">photo_library</span>
                                    Property Photos
                                </h2>
                                <div className="flex items-center gap-2">
                                    {isUploading && (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#ec6d13] bg-orange-50 px-3 py-1.5 rounded-full">
                                            <span className="size-2 bg-[#ec6d13] rounded-full animate-pulse" />
                                            Uploading…
                                        </span>
                                    )}
                                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
                                        {formData.images.length} / 15
                                    </span>
                                </div>
                            </div>

                            {/* Upload drop zone */}
                            <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer transition-all group mb-5
                                ${formData.images.length >= 15 ? 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50' : 'border-gray-200 bg-gray-50 hover:border-[#ec6d13] hover:bg-orange-50'}`}>
                                <div className="flex flex-col items-center gap-2 pointer-events-none">
                                    <span className={`material-symbols-outlined text-4xl transition-colors ${formData.images.length >= 15 ? 'text-gray-300' : 'text-gray-300 group-hover:text-[#ec6d13]'}`}>
                                        cloud_upload
                                    </span>
                                    <p className="text-sm font-bold text-gray-400 group-hover:text-[#ec6d13] transition-colors uppercase tracking-wider">
                                        {formData.images.length >= 15 ? 'Maximum reached' : 'Click to upload photos'}
                                    </p>
                                    <p className="text-[11px] text-gray-400">PNG, JPG, WEBP up to 10MB each</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    disabled={formData.images.length >= 15 || saving}
                                    onChange={handleImageUpload}
                                />
                            </label>

                            {/* Image grid: existing + uploading queue */}
                            {(formData.images.length > 0 || uploadQueue.length > 0) && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">

                                    {/* Saved images */}
                                    {formData.images.map((img, idx) => (
                                        <div key={`saved-${idx}`} className="relative aspect-square group">
                                            <img
                                                src={img}
                                                alt=""
                                                className="w-full h-full object-cover rounded-2xl border-2 border-transparent group-hover:border-[#ec6d13] transition-all shadow-sm"
                                            />
                                            {/* Cover badge for first image */}
                                            {idx === 0 && (
                                                <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg">
                                                    Cover
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(idx)}
                                                className="absolute -top-2 -right-2 size-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                                            >
                                                <span className="material-symbols-outlined text-xs">close</span>
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload queue items */}
                                    {uploadQueue.map((item) => (
                                        <div key={item.id} className="relative aspect-square">
                                            {/* Preview image */}
                                            <img
                                                src={item.preview}
                                                alt=""
                                                className={`w-full h-full object-cover rounded-2xl border-2 transition-all shadow-sm ${item.status === 'uploading' ? 'border-[#ec6d13] opacity-60' :
                                                    item.status === 'error' ? 'border-red-400 opacity-60' :
                                                        'border-emerald-400'
                                                    }`}
                                            />

                                            {/* Uploading overlay */}
                                            {item.status === 'uploading' && (
                                                <div className="absolute inset-0 rounded-2xl bg-black/40 flex flex-col items-center justify-center gap-1.5 p-2">
                                                    {/* Circular progress */}
                                                    <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                                                        <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                                                        <circle
                                                            cx="16" cy="16" r="12" fill="none"
                                                            stroke="#ec6d13" strokeWidth="3"
                                                            strokeLinecap="round"
                                                            strokeDasharray={`${2 * Math.PI * 12}`}
                                                            strokeDashoffset={`${2 * Math.PI * 12 * (1 - item.progress / 100)}`}
                                                            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                                                        />
                                                    </svg>
                                                    <span className="text-white text-[10px] font-black">{Math.round(item.progress)}%</span>
                                                </div>
                                            )}

                                            {/* Done overlay */}
                                            {item.status === 'done' && (
                                                <div className="absolute inset-0 rounded-2xl bg-emerald-500/30 flex items-center justify-center">
                                                    <div className="size-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                                        <span className="material-symbols-outlined text-white text-base">check</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Error overlay */}
                                            {item.status === 'error' && (
                                                <div className="absolute inset-0 rounded-2xl bg-red-500/40 flex flex-col items-center justify-center gap-1 p-2">
                                                    <span className="material-symbols-outlined text-white text-xl">error</span>
                                                    <span className="text-white text-[9px] font-black uppercase">Failed</span>
                                                </div>
                                            )}

                                            {/* Remove button (shown for done/error items) */}
                                            {item.status !== 'uploading' && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeQueueItem(item.id)}
                                                    className={`absolute -top-2 -right-2 size-6 text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all ${item.status === 'error' ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-900'}`}
                                                >
                                                    <span className="material-symbols-outlined text-xs">close</span>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Empty state */}
                            {formData.images.length === 0 && uploadQueue.length === 0 && (
                                <div className="text-center py-6 text-gray-400">
                                    <span className="material-symbols-outlined text-5xl block mb-2 text-gray-200">image</span>
                                    <p className="text-sm font-semibold">No photos yet — upload some above</p>
                                </div>
                            )}
                        </div>

                        {/* ── Actions ─────────────────────────────────────────── */}
                        <div className="flex gap-4 pb-10">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard/admin/properties')}
                                className="flex-1 py-4 px-6 rounded-2xl border-2 border-gray-200 font-bold text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving || isUploading}
                                className="flex-[2] py-4 px-6 rounded-2xl bg-[#ec6d13] text-white font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        Saving Changes…
                                    </>
                                ) : isUploading ? (
                                    <>
                                        <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        Waiting for uploads…
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-base">save</span>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
};

export default AdminPropertyEdit;