import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AdminSidebar from '../components/admin/Sidebar';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/users');
            if (response.data.success) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await api.put(`/admin/users/${userId}/role`, { role: newRole });
            if (response.data.success) {
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
                alert('User role updated successfully');
            }
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role');
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            <main className="flex-1 overflow-x-hidden">
                <div className="max-w-7xl mx-auto px-8 py-10">
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Users</h1>
                            <p className="text-gray-500 font-medium mt-1">Manage platform participants and permissions.</p>
                        </div>
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
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Current Role</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Joined Date</th>
                                        <th className="px-8 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Management</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-orange-50 text-[#ec6d13] flex items-center justify-center font-bold border border-white group-hover:border-[#ec6d13] transition-all">
                                                        {u.firstname?.charAt(0) || <span className="material-symbols-outlined text-sm font-bold">person</span>}
                                                    </div>
                                                    <span className="font-bold text-gray-900 leading-none">{u.firstname} {u.lastname}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-medium text-gray-500">{u.email}</td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                        u.role === 'host' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-medium text-gray-400">
                                                {new Date(u.createdat).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="inline-flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100 group-hover:bg-white transition-colors">
                                                    <select
                                                        value={u.role}
                                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                        className="bg-transparent text-xs font-bold text-gray-700 border-none focus:ring-0 cursor-pointer py-1 pl-3 pr-8"
                                                    >
                                                        <option value="guest">Guest</option>
                                                        <option value="host">Host</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
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

export default AdminUsers;
