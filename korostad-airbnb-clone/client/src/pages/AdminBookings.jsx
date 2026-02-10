import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AdminSidebar from '../components/admin/Sidebar';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/bookings');
            if (response.data.success) {
                setBookings(response.data.bookings || []);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
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

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            <main className="flex-1 overflow-x-hidden">
                <div className="max-w-7xl mx-auto px-8 py-10">
                    <div className="mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Bookings</h1>
                        <p className="text-gray-500 font-medium mt-1">Manage all transactions and reservations.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        {loading ? (
                            <div className="p-20 flex justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec6d13]"></div>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Guest</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Property</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Duration</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Total Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {bookings.map((b) => (
                                        <tr key={b.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="font-bold text-gray-900">{b.firstname} {b.lastname}</div>
                                                <div className="text-xs font-medium text-gray-400">{b.email}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-sm font-bold text-gray-700">{b.propertytitle}</div>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Property ID: #{b.propertyid?.toString().slice(-4)}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-xs font-bold text-gray-900">
                                                    {new Date(b.checkindate).toLocaleDateString()}
                                                </div>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">to {new Date(b.checkoutdate).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right font-black text-gray-900">{formatCurrency(b.totalprice)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminBookings;
