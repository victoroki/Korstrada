import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ open, setOpen }) => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard/admin', icon: 'dashboard' },
        { name: 'Properties', path: '/dashboard/admin/properties', icon: 'domain' },
        { name: 'Users', path: '/dashboard/admin/users', icon: 'group' },
        { name: 'Bookings', path: '/dashboard/admin/bookings', icon: 'book_online' },
        { name: 'Reviews', path: '/dashboard/admin/reviews', icon: 'reviews' },
        { name: 'Settings', path: '/dashboard/admin/settings', icon: 'settings' },
    ];

    return (
        <aside className={`${open ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen sticky top-0`}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                {open && (
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/assets/logo.png" alt="Korstrada" className="h-8 w-auto object-contain" />
                        <span className="font-black text-gray-900 tracking-tighter">Korstrada Admin</span>
                    </Link>
                )}
                <button
                    onClick={() => setOpen(!open)}
                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
                >
                    <span className="material-symbols-outlined">{open ? 'menu_open' : 'menu'}</span>
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${isActive
                                ? 'bg-[#ec6d13] text-white shadow-lg shadow-orange-200'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 group'
                                }`}
                        >
                            <span className={`material-symbols-outlined ${isActive ? 'fill-1' : 'group-hover:scale-110 transition-transform'}`}>
                                {item.icon}
                            </span>
                            {open && <span>{item.name}</span>}
                            {isActive && open && (
                                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-all w-full"
                >
                    <span className="material-symbols-outlined">logout</span>
                    {open && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
