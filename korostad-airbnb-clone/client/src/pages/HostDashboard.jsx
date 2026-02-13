import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const HostDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const response = await api.get('/properties/my-properties');
        if (response.data.success) {
          setProperties(response.data.properties);
        }
      } catch (error) {
        console.error('Error fetching my properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProperties();
  }, []);

  return (
    <div className="bg-[#fcfaf8] min-h-screen py-16 px-6 font-jakarta">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <h4 className="text-[#ec6d13] font-black uppercase tracking-[0.3em] text-[10px] mb-2">Curator Portal</h4>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
              Welcome back, {user?.firstName || 'Curator'}
            </h1>
            <p className="text-gray-500 font-bold mt-2">Manage your boutique collection and stay experiences.</p>
          </div>
          <Link to="/dashboard/admin/properties/new" className="bg-[#ec6d13] text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95 flex items-center gap-2">
            <span className="material-symbols-outlined">add</span>
            New Listing
          </Link>
        </div>

        {/* Performance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Listings</p>
            <h3 className="text-4xl font-black text-gray-900">{properties.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Earnings</p>
            <h3 className="text-4xl font-black text-gray-900">$0.00</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Avg. Rating</p>
            <h3 className="text-4xl font-black text-[#ec6d13]">5.0</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Response Rate</p>
            <h3 className="text-4xl font-black text-gray-900">100%</h3>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Listings List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Collection</h2>
              <button className="text-sm font-black text-[#ec6d13] hover:underline uppercase tracking-widest">Manage All</button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-60 bg-gray-100 rounded-[2.5rem] animate-pulse"></div>)}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {properties.map(property => (
                  <div key={property.id} className="bg-white rounded-[2.5rem] shadow-md border border-gray-50 overflow-hidden group hover:shadow-2xl transition-all">
                    <div className="relative h-48 overflow-hidden">
                      <img src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=2070&auto=format&fit=crop'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-gray-900 shadow-sm border border-gray-100">
                        {property.status}
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-black text-gray-900 mb-1 line-clamp-1">{property.title}</h4>
                      <p className="text-sm font-bold text-gray-400 mb-6">{property.city}, {property.country}</p>
                      <div className="flex gap-4">
                        <Link to={`/dashboard/admin/properties/edit/${property.id}`} className="flex-1 bg-gray-50 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-600 hover:bg-[#ec6d13] hover:text-white transition-all text-center">Edit</Link>
                        <button className="size-12 rounded-xl border-2 border-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 transition-all">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
                <span className="material-symbols-outlined text-gray-200 text-7xl mb-4">add_home</span>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Your collection is empty</h3>
                <p className="text-gray-500 mb-8 font-medium">Start your journey as a Kornialle curator by adding your first masterpiece.</p>
                <Link to="/dashboard/admin/properties/new" className="bg-[#ec6d13] text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all hover:-translate-y-1 inline-block">Create Listing</Link>
              </div>
            )}
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50">
              <h3 className="font-black text-gray-900 mb-8 tracking-tight">Recent Reservations</h3>
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                  <span className="material-symbols-outlined text-5xl mb-2 text-gray-300">history</span>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">No recent activity</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50">
              <h3 className="font-black text-gray-900 mb-6 tracking-tight">Curator Tips</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100/30">
                  <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-2">Pro Tip</p>
                  <p className="text-sm font-bold text-gray-700 leading-relaxed">"High-quality photography increases booking requests by 40%. Consider professional shooting for your masterpiece."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;