import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AdminSidebar from '../components/admin/Sidebar';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProperties: 0,
    occupancyRate: 0,
    activeUsers: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.stats);
        setRecentBookings(response.data.recentBookings || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Overview</h1>
              <p className="text-gray-500 font-medium mt-1">Welcome back, {user?.firstName || 'Admin'}. Here is your platform summary.</p>
            </div>
            <div className="flex gap-4">
              <button className="bg-white border border-gray-200 text-gray-700 font-bold px-6 py-3 rounded-2xl hover:bg-gray-50 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400">calendar_month</span>
                Last 30 Days
              </button>
              <Link
                to="/dashboard/admin/properties/new"
                className="bg-[#ec6d13] text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all flex items-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined">add</span>
                New Property
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white h-32 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-xl group">
                  <div className="size-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-3xl">payments</span>
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-black text-gray-900">{formatCurrency(stats.totalRevenue)}</h3>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-xl group">
                  <div className="size-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-3xl">home</span>
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Properties</p>
                  <h3 className="text-3xl font-black text-gray-900">{stats.totalProperties}</h3>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-xl group">
                  <div className="size-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-3xl">analytics</span>
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Occupancy</p>
                  <h3 className="text-3xl font-black text-gray-900">{stats.occupancyRate}%</h3>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-xl group">
                  <div className="size-14 bg-orange-50 rounded-2xl flex items-center justify-center text-[#ec6d13] mb-6 group-hover:bg-[#ec6d13] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-3xl">group</span>
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Users</p>
                  <h3 className="text-3xl font-black text-gray-900">{stats.activeUsers}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings Table */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Recent Bookings</h3>
                    <Link to="/dashboard/admin/bookings" className="text-[#ec6d13] font-bold text-sm hover:underline">View All</Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50/50">
                        <tr>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Guest</th>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Property</th>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                          <th className="px-8 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {recentBookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-gray-50/80 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 overflow-hidden border border-white group-hover:border-[#ec6d13] transition-colors">
                                  {booking.firstname?.charAt(0) || <span className="material-symbols-outlined text-sm">person</span>}
                                </div>
                                <span className="font-bold text-gray-900">{booking.firstname || booking.email.split('@')[0]}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-sm font-medium text-gray-500">{booking.propertytitle}</td>
                            <td className="px-8 py-5">
                              <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right font-black text-gray-900">{formatCurrency(booking.totalprice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* System Status & Quick Actions */}
                <div className="space-y-8">
                  <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl shadow-gray-200">
                    <h3 className="text-lg font-bold mb-6">Launch Pad</h3>
                    <div className="space-y-4">
                      <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center gap-4 transition-all group">
                        <span className="material-symbols-outlined text-orange-400 group-hover:scale-110 transition-transform">article</span>
                        <div className="text-left">
                          <p className="text-sm font-bold">Generate Reports</p>
                          <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Financial summary</p>
                        </div>
                      </button>
                      <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center gap-4 transition-all group">
                        <span className="material-symbols-outlined text-green-400 group-hover:scale-110 transition-transform">verified_user</span>
                        <div className="text-left">
                          <p className="text-sm font-bold">Verify Hosts</p>
                          <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">3 Pending approvals</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">System Health</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-bold text-gray-600">Main Server</span>
                        </div>
                        <span className="text-xs font-black text-green-600 uppercase">Online</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="size-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-bold text-gray-600">PostgreSQL DB</span>
                        </div>
                        <span className="text-xs font-black text-green-600 uppercase">Stable</span>
                      </div>
                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-400">API Latency</span>
                        <span className="text-sm font-black text-gray-900">24ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;