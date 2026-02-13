import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-24 md:pb-12 mt-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-24 mb-20">
          {/* Brand Section */}
          <div className="space-y-8 max-w-sm">
            <Link to="/" className="flex items-center gap-4 group">
              <img src="/assets/logo.png" alt="Kornialle" className="h-12 w-auto object-contain transition-transform group-hover:scale-105" />
              <h1 className="text-2xl font-black tracking-tighter text-gray-900">Kornialle</h1>
            </Link>
            <p className="text-gray-500 font-medium text-base leading-relaxed">
              Elevating the art of travel. Discover hand-picked boutique stays and unique experiences curated for the discerning traveler.
            </p>
            <div className="flex items-center gap-5">
              {[
                { name: 'facebook', icon: 'groups' },
                { name: 'twitter', icon: 'share' },
                { name: 'instagram', icon: 'photo_camera' }
              ].map((social) => (
                <a key={social.name} href="#" className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#ec6d13] hover:text-white transition-all transform hover:-translate-y-1 shadow-sm">
                  <span className="material-symbols-outlined text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-16 w-full lg:w-auto flex-1">
            <div className="min-w-[140px]">
              <h4 className="text-gray-900 mb-8 uppercase text-xs font-black tracking-[0.2em] opacity-40">Discovery</h4>
              <ul className="space-y-5">
                <li><Link to="/" className="text-gray-600 font-bold text-sm hover:text-[#ec6d13] transition-colors tracking-wide">Boutique Stays</Link></li>
                <li><Link to="/" className="text-gray-600 font-bold text-sm hover:text-[#ec6d13] transition-colors tracking-wide">Guest Experiences</Link></li>
                <li><Link to="/" className="text-gray-600 font-bold text-sm hover:text-[#ec6d13] transition-colors tracking-wide">Rare Finds</Link></li>
                <li><Link to="/" className="text-gray-600 font-bold text-sm hover:text-[#ec6d13] transition-colors tracking-wide">Curated Maps</Link></li>
              </ul>
            </div>

            <div className="min-w-[140px]">
              <h4 className="text-gray-900 mb-8 uppercase text-xs font-black tracking-[0.2em] opacity-40">Community</h4>
              <ul className="space-y-5">
                <li><Link to="/dashboard/host" className="text-gray-600 font-bold text-sm hover:text-[#ec6d13] transition-colors tracking-wide">Become a Curator</Link></li>
                <li><Link to="/register" className="text-gray-600 font-bold text-sm hover:text-[#ec6d13] transition-colors tracking-wide">Join the Club</Link></li>
                <li><Link to="/login" className="text-gray-600 font-bold text-sm hover:text-[#ec6d13] transition-colors tracking-wide">Member Access</Link></li>
                <li><Link to="/" className="text-gray-600 font-bold text-sm hover:text-[#ec6d13] transition-colors tracking-wide"> Kornialle Events</Link></li>
              </ul>
            </div>

            <div className="min-w-[140px] col-span-2 md:col-span-1">
              <h4 className="text-gray-900 mb-8 uppercase text-xs font-black tracking-[0.2em] opacity-40">Support</h4>
              <ul className="space-y-5">
                <li><a href="#" className="text-gray-600 font-bold text-sm hover:text-[#ec6d13] transition-colors tracking-wide">Help Center</a></li>
                <li><a href="#" className="text-gray-600 font-bold text-sm hover:text-[#ec6d13] transition-colors tracking-wide">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 font-bold text-sm hover:text-[#ec6d13] transition-colors tracking-wide">Privacy Excellence</a></li>
                <li><a href="#" className="text-gray-600 font-bold text-sm hover:text-[#ec6d13] transition-colors tracking-wide">Security Team</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">
          <div className="flex items-center gap-2">
            <span>&copy; 2026 Kornialle Premium Stays.</span>
            <span className="hidden md:inline text-gray-200">|</span>
            <span className="text-gray-300">Handcrafted in London</span>
          </div>

          <div className="flex items-center gap-10">
            <span className="flex items-center gap-2 text-gray-900 hover:text-[#ec6d13] cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-lg">public</span>
              English (International)
            </span>
            <span className="flex items-center gap-2 text-gray-900 hover:text-[#ec6d13] cursor-pointer transition-colors">
              <span className="text-lg">$</span>
              USD - Dollar
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;