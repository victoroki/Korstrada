import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AdminSidebar from '../components/admin/Sidebar';

const AdminProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/properties');
            if (response.data.success) {
                setProperties(response.data.properties);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;
        try {
            const response = await api.delete(`/properties/${id}`);
            if (response.data.success) {
                setProperties(properties.filter(p => p.id !== id));
                alert('Property deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting property:', error);
            alert('Failed to delete property');
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            <main className="flex-1 overflow-x-hidden">
                <div className="max-w-7xl mx-auto px-8 py-10">
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Properties</h1>
                            <p className="text-gray-500 font-medium mt-1">Monitor and moderate all listings on Kornialle.</p>
                        </div>
                        <Link
                            to="/dashboard/admin/properties/new"
                            className="bg-[#ec6d13] text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all flex items-center gap-2 active:scale-95"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Add Listing
                        </Link>
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
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Listing</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Host</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                                        <th className="px-8 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Control</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {properties.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-white group-hover:border-[#ec6d13] transition-all">
                                                        {p.images && p.images[0] ? (
                                                            <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <span className="material-symbols-outlined">image</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 group-hover:text-[#ec6d13] transition-colors">{p.title}</div>
                                                        <div className="text-xs font-medium text-gray-400">{p.city}, {p.country}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-sm font-bold text-gray-700">{p.hostfirstname} {p.hostlastname}</div>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Host ID: #{p.hostid?.toString().slice(-4)}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-xs font-bold text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-lg">{p.propertytype}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${p.status === 'active' ? 'bg-green-100 text-green-700' :
                                                    p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 font-black text-gray-900">${p.baseprice}</td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link to={`/property/${p.id}`} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                                    </Link>
                                                    <Link to={`/dashboard/admin/properties/edit/${p.id}`} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-[#ec6d13] hover:bg-orange-50 transition-all">
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </Link>
                                                    <button onClick={() => handleDelete(p.id)} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all">
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
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

export default AdminProperties;
