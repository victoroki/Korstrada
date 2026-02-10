import React from 'react';
import { NavLink } from 'react-router-dom';

const MobileNav = () => {
    const navItems = [
        { icon: 'explore', label: 'Explore', path: '/' },
        { icon: 'dashboard', label: 'Portal', path: '/dashboard/guest' },
        { icon: 'account_circle', label: 'Profile', path: '/profile' }
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => (
                <NavLink
                    key={item.label}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 transition-all active:scale-90 ${isActive ? 'text-[#ec6d13]' : 'text-gray-400'
                        }`
                    }
                >
                    <span className={`material-symbols-outlined text-2xl transition-all`}>
                        {item.icon}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default MobileNav;
