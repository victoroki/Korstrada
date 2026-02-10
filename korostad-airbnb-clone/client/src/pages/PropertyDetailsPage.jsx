import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingState, setBookingState] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/properties/${id}`);
        if (response.data.success) {
          setProperty(response.data.property);
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
    window.scrollTo(0, 0);
  }, [id]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to continue booking');
      return;
    }
    alert('Booking feature coming soon! We are finalizing our secure payment integration.');
  };

  if (loading) {
    return (
      <div className="min-h-screen animate-pulse">
        <div className="h-[60vh] bg-gray-200 w-full mb-8"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-10 bg-gray-200 rounded w-2/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <span className="material-symbols-outlined text-gray-200 text-9xl mb-4">search_off</span>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Property Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-sm">The listing you're looking for might have been removed or is currently unavailable.</p>
        <Link to="/" className="bg-[#ec6d13] text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-orange-100 transition-all active:scale-95">Back to Explore</Link>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000&auto=format&fit=crop'];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Gallery Section */}
      <section className="relative h-[65vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={images[activeImage]} alt={property.title} className="w-full h-full object-cover transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
        </div>

        <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
          <div className="text-white space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-orange-600 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">Featured Stay</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter drop-shadow-2xl">{property.title}</h1>
            <p className="text-white/90 font-bold flex items-center gap-2 drop-shadow-lg">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {property.address}, {property.city}
            </p>
          </div>

          <div className="hidden md:flex gap-3">
            {images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`size-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#ec6d13] scale-105 shadow-xl' : 'border-white/20 hover:border-white/50 opacity-80'}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 mt-16">
        <div className="lg:col-span-2 space-y-12">
          {/* Key Attributes */}
          <div className="flex flex-wrap gap-8 items-center py-8 border-y border-gray-100">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-3 rounded-2xl">home_work</span>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Type</p>
                <p className="font-bold text-gray-900 capitalize">{property.propertyType || property.propertytype || 'Boutique'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-3 rounded-2xl">group</span>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Capacity</p>
                <p className="font-bold text-gray-900">{property.maxGuests || property.maxguests || 2} Guests</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-3 rounded-2xl">bed</span>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Space</p>
                <p className="font-bold text-gray-900">{property.bedrooms || 1} Rooms</p>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-4">About this experience</h3>
            <p className="text-gray-600 font-medium leading-relaxed">
              {property.description || "Indulge in a world where luxury meets local charm. This hand-picked Korstrada selection offers more than just a place to sleep—it's a curated experience designed to inspire your journey."}
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8">The Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {(property.amenities || ['Fast WiFi', 'Free Parking', 'Kitchen', 'Workspace', 'Climate Control']).map((amenity, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-orange-500 transition-colors">check_circle</span>
                  <span className="font-bold text-gray-700 text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Host Profile Card */}
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col md:flex-row gap-8 items-center md:items-start anim-fade-in">
            <div className="size-24 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
              <img src={property.hostProfileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${property.hostFirstName || 'host'}`} className="w-full h-full object-cover" />
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-xl font-black text-gray-900 mb-1">Hosted by {property.hostFirstName || property.hostfirstname || 'Korstrada Curator'}</h4>
              <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mb-4">Verified Professional Host</p>
              <p className="text-gray-600 font-medium leading-relaxed mb-6 italic max-w-md">"My goal is to provide a seamless, beautiful environment where you can truly unplug and enjoy the local essence. Welcome to my home."</p>
              <button className="px-6 py-2.5 rounded-xl border-2 border-gray-200 font-bold text-sm text-gray-700 hover:bg-white hover:border-gray-900 transition-all">Contact Host</button>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white border border-gray-200 rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-gray-900">${property.basePrice || property.baseprice || property.price || 150}</span>
                <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">/ night</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-xl">
                <span className="material-symbols-outlined text-orange-600 text-sm">star</span>
                <span className="font-black text-orange-600 text-sm">4.96</span>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-px bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-white p-4">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Check In</label>
                  <input type="date" required className="w-full font-bold text-gray-900 border-none p-0 focus:ring-0 text-sm" />
                </div>
                <div className="bg-white p-4 border-l border-gray-200">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Check Out</label>
                  <input type="date" required className="w-full font-bold text-gray-900 border-none p-0 focus:ring-0 text-sm" />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Guests</label>
                <select className="w-full font-bold text-gray-900 border-none p-0 focus:ring-0 text-sm bg-transparent">
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4+ Guests</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-[#ec6d13] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all hover:-translate-y-1 active:scale-95">
                Book This Stay
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-4">
              <div className="flex justify-between text-sm font-bold text-gray-500">
                <span>${property.basePrice || property.baseprice || 150} x 5 nights</span>
                <span className="text-gray-900 font-extrabold">${(property.basePrice || property.baseprice || 150) * 5}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-500">
                <span>Korstrada Service Fee</span>
                <span className="text-gray-900 font-extrabold">$25</span>
              </div>
              <div className="flex justify-between text-lg font-black text-gray-900 pt-4">
                <span>Total</span>
                <span>${((property.basePrice || property.baseprice || 150) * 5) + 25}</span>
              </div>
            </div>

            <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-8">
              Secure Payment via Korstrada
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetailsPage;