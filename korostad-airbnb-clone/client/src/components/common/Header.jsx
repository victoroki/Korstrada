import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="text-sm font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Explore</Link>
      <Link to="/" className="text-sm font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Experiences</Link>
      {user?.role === 'host' && (
        <Link to="/dashboard/host" className="text-sm font-black text-[#ec6d13] hover:text-orange-600 transition-colors uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Curator Portal</Link>
      )}
    </>
  );

  return (
    <header className={`sticky top-0 z-50 border-b border-gray-100 px-4 md:px-6 py-4 transition-all duration-300 ${mobileMenuOpen ? 'bg-white' : 'bg-white/80 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 group" onClick={() => setMobileMenuOpen(false)}>
          <img src="/assets/logo.png" alt="Kornialle" className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105" />
          <h1 className="text-xl md:text-2xl font-black tracking-tighter text-gray-900">Kornialle</h1>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-8">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavLinks />
          </nav>

          {/* User Profile Dropdown */}
          <div className="hidden lg:block relative">
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

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Signed in as</p>
                      <p className="text-sm font-extrabold text-gray-900 truncate">{user?.email}</p>
                    </div>
                    <Link to={`/dashboard/${user?.role}`} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                      <span className="material-symbols-outlined text-gray-400">dashboard</span> Dashboard
                    </Link>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                      <span className="material-symbols-outlined text-gray-400">account_circle</span> My Profile
                    </Link>
                    <div className="border-t border-gray-50 my-1"></div>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50">
                      <span className="material-symbols-outlined">logout</span> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                      <span className="material-symbols-outlined text-gray-400">login</span> Log in
                    </Link>
                    <Link to="/register" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                      <span className="material-symbols-outlined text-gray-400">person_add</span> Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Hamburger Menu Toggle */}
          <button
            className="lg:hidden flex items-center justify-center size-10 rounded-xl bg-gray-50 text-gray-600 active:scale-90 transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[73px] bg-white z-[60] overflow-y-auto h-[calc(100vh-73px)] animate-in slide-in-from-right duration-300">
          <div className="flex flex-col p-6 gap-8 pb-20">
            <div className="flex flex-col gap-6 border-b border-gray-100 pb-8">
              <NavLinks />
            </div>
            <div className="flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="flex items-center gap-3 text-lg font-black text-gray-900 p-2 hover:bg-gray-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                    <span className="material-symbols-outlined">account_circle</span> Profile
                  </Link>
                  <Link to={`/dashboard/${user?.role}`} className="flex items-center gap-3 text-lg font-black text-gray-900 p-2 hover:bg-gray-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                    <span className="material-symbols-outlined">dashboard</span> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 text-lg font-black text-red-500 mt-4 text-left p-2 hover:bg-red-50/50 rounded-xl">
                    <span className="material-symbols-outlined">logout</span> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center justify-center w-full py-4 rounded-2xl border-2 border-gray-100 font-black text-gray-900 text-lg hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                  <Link to="/register" className="flex items-center justify-center w-full py-4 rounded-2xl bg-gray-900 text-white font-black text-lg hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;