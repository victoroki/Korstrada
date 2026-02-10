import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/assets/logo.png" alt="Korstrada" className="h-15 w-auto object-contain transition-transform group-hover:scale-105" />
          <h1 className="text-2xl font-black tracking-tighter text-gray-900">Korstrada</h1>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 mr-4">
            <Link to="/" className="text-sm font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Explore</Link>
            <Link to="/" className="text-sm font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Experiences</Link>
            {user?.role === 'host' && (
              <Link to="/dashboard/host" className="text-sm font-black text-[#ec6d13] hover:text-orange-600 transition-colors uppercase tracking-widest">Curator Portal</Link>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-center size-10 rounded-full bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all active:scale-95"
            >
              {isAuthenticated && user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-gray-600 select-none">person</span>
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Signed in as</p>
                      <p className="text-sm font-extrabold text-gray-900 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to={`/dashboard/${user?.role}`}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="material-symbols-outlined text-gray-400">dashboard</span>
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="material-symbols-outlined text-gray-400">account_circle</span>
                      My Profile
                    </Link>
                    <div className="border-t border-gray-50 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <span className="material-symbols-outlined">logout</span>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;