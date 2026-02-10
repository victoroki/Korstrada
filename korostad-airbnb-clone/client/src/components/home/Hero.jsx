import React, { useState, useRef, useEffect } from 'react';

const Hero = ({ onSearch }) => {
    const [searchLocation, setSearchLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    const [showGuestPicker, setShowGuestPicker] = useState(false);
    const guestRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (guestRef.current && !guestRef.current.contains(e.target)) {
                setShowGuestPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch({ location: searchLocation, dates: { checkIn, checkOut }, guests });
        }
    };

    const formatDate = (val) => {
        if (!val) return null;
        return new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <>
            <style>{`
                .hero-date-input {
                    position: absolute;
                    inset: 0;
                    opacity: 0;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    z-index: 3;
                }
                .hero-date-input::-webkit-calendar-picker-indicator {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    cursor: pointer;
                }
                .hero-field:focus-within {
                    background: #fff8f4 !important;
                    box-shadow: inset 0 0 0 2px #ec6d13;
                    border-radius: 18px;
                }
                .hero-field:focus-within .hero-field-icon {
                    color: #ec6d13 !important;
                }
                .guest-popover {
                    position: absolute;
                    bottom: calc(100% + 15px);
                    left: 50%;
                    transform: translateX(-50%);
                    width: 260px;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 -16px 48px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06);
                    padding: 18px;
                    z-index: 100;
                    animation: gpopIn 0.16s cubic-bezier(0.34,1.56,0.64,1) forwards;
                }
                @keyframes gpopIn {
                    from { opacity: 0; transform: translateX(-50%) scale(0.92) translateY(6px); }
                    to   { opacity: 1; transform: translateX(-50%) scale(1)    translateY(0); }
                }
                .guest-stepper {
                    width: 32px; height: 32px;
                    border-radius: 10px;
                    border: 2px solid #e5e7eb;
                    background: white;
                    font-size: 16px;
                    font-weight: 800;
                    color: #6b7280;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.14s;
                    flex-shrink: 0;
                    line-height: 1;
                }
                .guest-stepper:hover:not(:disabled) { border-color: #ec6d13; color: #ec6d13; }
                .guest-stepper:disabled { opacity: 0.3; cursor: not-allowed; }

                @media (max-width: 1023px) {
                    .guest-popover { left: auto; right: 0; transform: none; }
                    @keyframes gpopIn {
                        from { opacity: 0; transform: scale(0.92) translateY(6px); }
                        to   { opacity: 1; transform: scale(1)    translateY(0); }
                    }
                }
            `}</style>

            <section className="relative px-4 pt-4 mb-16">
                <div
                    className="relative min-h-[480px] md:h-[520px] w-full overflow-hidden rounded-[2.5rem] bg-cover bg-center flex flex-col items-center justify-center p-6 md:p-12 text-center shadow-2xl transition-all"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop')`,
                    }}
                >
                    <div className="relative z-10 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <h2 className="text-white text-4xl md:text-7xl font-black leading-tight mb-6 drop-shadow-2xl tracking-tighter">
                            Experience <span className="text-orange-400">Korstrada</span> Luxury
                        </h2>
                        <p className="text-white/95 text-lg md:text-2xl mb-12 font-bold drop-shadow-lg max-w-2xl mx-auto opacity-90">
                            Curated stays for the modern traveler. Discover hidden gems and unforgettable experiences.
                        </p>

                        {/* Search Bar */}
                        <form
                            onSubmit={handleSearch}
                            className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-2xl rounded-3xl md:rounded-[2rem] shadow-2xl p-2 flex flex-col lg:flex-row items-center gap-2 border border-white/20"
                        >
                            {/* Location */}
                            <div className="hero-field flex-[1.5] w-full flex items-center gap-3 px-5 py-4 border-b lg:border-b-0 lg:border-r border-gray-100 transition-all rounded-[18px]">
                                <span className="material-symbols-outlined hero-field-icon transition-colors" style={{ color: '#ec6d13', fontSize: 22 }}>location_on</span>
                                <div className="flex flex-col items-start w-full">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:block mb-0.5">Location</label>
                                    <input
                                        className="w-full border-none focus:ring-0 bg-transparent text-sm font-bold text-gray-900 placeholder:text-gray-400 p-0 outline-none"
                                        placeholder="Where to?"
                                        type="text"
                                        value={searchLocation}
                                        onChange={(e) => setSearchLocation(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Check-In */}
                            <div className="hero-field flex-1 w-full relative flex items-center gap-3 px-5 py-4 border-b lg:border-b-0 lg:border-r border-gray-100 transition-all rounded-[18px] cursor-pointer">
                                <span className="material-symbols-outlined hero-field-icon transition-colors" style={{ color: '#9ca3af', fontSize: 20 }}>calendar_today</span>
                                <div className="flex flex-col items-start pointer-events-none">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:block mb-0.5">Check In</label>
                                    <span className={`text-sm font-bold ${checkIn ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {formatDate(checkIn) || 'Add date'}
                                    </span>
                                </div>
                                <input
                                    type="date"
                                    className="hero-date-input"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                />
                            </div>

                            {/* Check-Out */}
                            <div className="hero-field flex-1 w-full relative flex items-center gap-3 px-5 py-4 border-b lg:border-b-0 lg:border-r border-gray-100 transition-all rounded-[18px] cursor-pointer">
                                <span className="material-symbols-outlined hero-field-icon transition-colors" style={{ color: '#9ca3af', fontSize: 20 }}>calendar_month</span>
                                <div className="flex flex-col items-start pointer-events-none">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:block mb-0.5">Check Out</label>
                                    <span className={`text-sm font-bold ${checkOut ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {formatDate(checkOut) || 'Add date'}
                                    </span>
                                </div>
                                <input
                                    type="date"
                                    className="hero-date-input"
                                    min={checkIn || undefined}
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                />
                            </div>

                            {/* Guests */}
                            <div className="flex-1 w-full relative" ref={guestRef}>
                                <button
                                    type="button"
                                    onClick={() => setShowGuestPicker(!showGuestPicker)}
                                    className="hero-field w-full flex items-center gap-3 px-5 py-4 border-b lg:border-b-0 hover:bg-gray-50 transition-all rounded-[18px] group"
                                >
                                    <span className="material-symbols-outlined hero-field-icon transition-colors group-hover:scale-110" style={{ color: '#9ca3af', fontSize: 20 }}>group</span>
                                    <div className="flex flex-col items-start flex-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:block mb-0.5 pointer-events-none">Guests</label>
                                        <span className="text-sm font-bold text-gray-900">
                                            {guests} {guests === 1 ? 'Guest' : 'Guests'}
                                        </span>
                                    </div>
                                    <span
                                        className="material-symbols-outlined text-gray-300 text-base"
                                        style={{ transform: showGuestPicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                                    >expand_more</span>
                                </button>

                                {showGuestPicker && (
                                    <div className="guest-popover">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Number of Guests</p>
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-gray-900">Guests</p>
                                                <p className="text-xs text-gray-400">Max 12 guests</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button type="button" className="guest-stepper" onClick={() => setGuests(g => Math.max(1, g - 1))} disabled={guests <= 1}>−</button>
                                                <span className="text-base font-black text-gray-900 w-5 text-center">{guests}</span>
                                                <button type="button" className="guest-stepper" onClick={() => setGuests(g => Math.min(12, g + 1))} disabled={guests >= 12}>+</button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <button
                                                type="button"
                                                onClick={() => { setGuests(1); setShowGuestPicker(false); }}
                                                className="text-xs font-bold text-gray-400 underline underline-offset-2 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer"
                                            >
                                                Reset
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowGuestPicker(false)}
                                                className="bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Search Button */}
                            <button
                                type="submit"
                                className="w-full lg:w-auto bg-[#ec6d13] hover:bg-orange-600 text-white font-black px-10 py-5 rounded-2xl lg:rounded-[1.5rem] transition-all active:scale-95 shadow-xl shadow-orange-600/20 flex items-center justify-center gap-3 md:ml-2 group"
                            >
                                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">search</span>
                                <span className="uppercase tracking-[0.1em] text-xs font-black">Search</span>
                            </button>
                        </form>
                    </div>

                    {/* Decorative overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none"></div>
                </div>
            </section>
        </>
    );
};

export default Hero;