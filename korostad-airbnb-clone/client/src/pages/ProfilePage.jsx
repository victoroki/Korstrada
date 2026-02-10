import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProfilePage = () => {
    const { user, logout, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phoneNumber: user?.phoneNumber || '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await api.put('/auth/profile', formData);
            if (response.data.success) {
                updateUser(response.data.user);
                setIsEditing(false);
                alert('Profile updated successfully');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            alert(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#fcfaf8] min-h-screen py-20 px-6 font-jakarta">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    {/* Cover / Profile Header */}
                    <div className="h-48 bg-gradient-to-r from-orange-400 to-[#ec6d13]"></div>
                    <div className="px-12 pb-12 -mt-16">
                        <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
                            <div className="size-32 rounded-[2rem] border-8 border-white shadow-xl overflow-hidden bg-white">
                                <img src={user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} className="w-full h-full object-cover" alt="Profile" />
                            </div>
                            <div className="flex-1 pb-2">
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user?.firstName || 'Julien'} {user?.lastName || 'Korst'}</h1>
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">{user?.role || 'Boutique Traveler'} Member</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-6 py-3 rounded-xl border-2 border-gray-100 font-black text-xs uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-all"
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">First Name</label>
                                        <input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-4 border-2 border-gray-50 rounded-2xl font-bold focus:border-[#ec6d13] outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Last Name</label>
                                        <input
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-4 border-2 border-gray-50 rounded-2xl font-bold focus:border-[#ec6d13] outline-none transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Phone Number (Mandatory)</label>
                                        <input
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            required
                                            type="tel"
                                            className="w-full px-5 py-4 border-2 border-gray-50 rounded-2xl font-bold focus:border-[#ec6d13] outline-none transition-all"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#ec6d13] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                                </button>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Personal Details</h3>
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email</p>
                                                <p className="font-bold text-gray-900">{user?.email}</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                                                <p className="font-bold text-gray-900">{user?.phoneNumber || 'Not Provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Account Actions</h3>
                                        <div className="space-y-3">
                                            <button className="w-full flex items-center justify-between p-5 bg-white border-2 border-gray-50 rounded-2xl hover:border-[#ec6d13] transition-all group shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-gray-400 group-hover:text-[#ec6d13]">security</span>
                                                    <span className="font-bold text-gray-700">Password & Security</span>
                                                </div>
                                                <span className="material-symbols-outlined text-gray-300">chevron_right</span>
                                            </button>
                                            <button
                                                onClick={logout}
                                                className="w-full flex items-center justify-between p-5 bg-red-50/50 border-2 border-transparent rounded-2xl hover:bg-red-50 transition-all group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-red-400">logout</span>
                                                    <span className="font-bold text-red-600">Sign Out</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em]">Member since 2026 · Korstrada Exclusive</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
