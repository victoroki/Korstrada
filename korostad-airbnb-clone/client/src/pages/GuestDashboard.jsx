import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const GuestDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings');
        if (response.data.success) {
          setBookings(response.data.bookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="bg-[#fcfaf8] min-h-screen py-16 px-6 font-jakarta">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <h4 className="text-[#ec6d13] font-black uppercase tracking-[0.3em] text-[10px] mb-2">Member Portal</h4>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
              Welcome back, {user?.firstName || 'Traveler'}
            </h1>
            <p className="text-gray-500 font-bold mt-2">Explore your curated journeys and account insights.</p>
          </div>
          <Link to="/" className="bg-white text-gray-900 border-2 border-gray-100 font-bold px-8 py-4 rounded-2xl shadow-sm hover:shadow-xl transition-all active:scale-95 flex items-center gap-2">
            <span className="material-symbols-outlined">explore</span>
            Explore Stays
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50">
            <span className="material-symbols-outlined text-orange-600 bg-orange-50 p-4 rounded-2xl mb-6">calendar_month</span>
            <h3 className="text-3xl font-black text-gray-900 mb-1">{bookings.length}</h3>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Journeys</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50">
            <span className="material-symbols-outlined text-orange-600 bg-orange-50 p-4 rounded-2xl mb-6">favorite</span>
            <h3 className="text-3xl font-black text-gray-900 mb-1">0</h3>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Saved Stays</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50">
            <span className="material-symbols-outlined text-orange-600 bg-orange-50 p-4 rounded-2xl mb-6">badge</span>
            <h3 className="text-3xl font-black text-gray-900 mb-1">Elite</h3>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Member Status</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Bookings List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Upcoming Stays</h2>
              <button className="text-sm font-bold text-[#ec6d13] hover:underline">View History</button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-40 bg-gray-100 rounded-[2rem] animate-pulse"></div>)}
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-6">
                {bookings.map(booking => (
                  <div key={booking.id} className="bg-white p-6 rounded-[2rem] shadow-md border border-gray-50 flex gap-6 hover:shadow-xl transition-all group">
                    <div className="size-32 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={booking.propertyImage || 'https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=2070&auto=format&fit=crop'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xl font-black text-gray-900">{booking.propertyTitle}</h4>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-400 mb-4">{new Date(booking.checkin).toLocaleDateString()} - {new Date(booking.checkout).toLocaleDateString()}</p>
                      <div className="flex gap-4">
                        <button className="text-xs font-black uppercase text-[#ec6d13] tracking-widest hover:underline">Stay Details</button>
                        <button className="text-xs font-black uppercase text-gray-400 tracking-widest hover:text-red-500 transition-colors">Modify</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
                <span className="material-symbols-outlined text-gray-200 text-7xl mb-4">luggage</span>
                <h3 className="text-xl font-bold text-gray-900 mb-1">No upcoming trips</h3>
                <p className="text-gray-500 mb-8 font-medium">Your next masterfully curated journey starts here.</p>
                <Link to="/" className="bg-[#ec6d13] text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all hover:-translate-y-1 block mx-auto max-w-xs">Start Planning</Link>
              </div>
            )}
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-black p-10 rounded-[2.5rem] text-white shadow-2xl shadow-gray-900/20 overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-2 tracking-tight">Become a Curator</h3>
                <p className="text-gray-400 font-bold text-sm mb-6 leading-relaxed">Share your extraordinary space with the Kornialle community and earn elite status.</p>
                <button className="w-full bg-[#ec6d13] py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all">List Your Property</button>
              </div>
              <div className="absolute -right-4 -bottom-4 size-32 bg-orange-600/20 blur-3xl group-hover:bg-orange-600/40 transition-all"></div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50">
              <h3 className="font-black text-gray-900 mb-6 tracking-tight">Quick Settings</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-[#ec6d13]">person</span>
                    <span className="font-bold text-sm text-gray-700">Profile Details</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-300 text-lg">chevron_right</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-[#ec6d13]">payments</span>
                    <span className="font-bold text-sm text-gray-700">Payment Methods</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-300 text-lg">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;