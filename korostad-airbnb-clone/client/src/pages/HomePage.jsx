import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import api from '../services/api';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback mock data if API is empty
  const mockProperties = [
    {
      id: 1,
      title: "The Oak Cottage",
      location: "Cotswolds, UK",
      city: "Cotswolds",
      price: 180,
      rating: 4.98,
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000&auto=format&fit=crop",
      isRareFind: true
    },
    {
      id: 2,
      title: "Seaside Retreat",
      location: "Cornwall, UK",
      city: "Cornwall",
      price: 210,
      rating: 4.95,
      image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop",
      isRareFind: false
    },
    {
      id: 3,
      title: "Golden Hill Cabin",
      location: "Aspen, Colorado",
      city: "Aspen",
      price: 320,
      rating: 4.90,
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop",
      isRareFind: false
    },
    {
      id: 4,
      title: "Stone Mill House",
      location: "Tuscany, Italy",
      city: "Tuscany",
      price: 150,
      rating: 4.85,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
      isRareFind: true
    }
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await api.get('/properties');
        if (response.data.success && response.data.properties.length > 0) {
          setProperties(response.data.properties);
          setFilteredProperties(response.data.properties);
        } else {
          setProperties(mockProperties);
          setFilteredProperties(mockProperties);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties(mockProperties);
        setFilteredProperties(mockProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = ({ location, dates, guests }) => {
    // Basic local filtering for demo purposes
    // In a real app, this might trigger a new API call with query params
    const filtered = properties.filter(p => {
      const matchesLocation = location
        ? p.title.toLowerCase().includes(location.toLowerCase()) ||
        (p.city && p.city.toLowerCase().includes(location.toLowerCase())) ||
        (p.location && p.location.toLowerCase().includes(location.toLowerCase()))
        : true;

      // Simulating guest filter (if property has maxGuests field)
      const matchesGuests = p.maxGuests || p.maxguests ? (p.maxGuests || p.maxguests) >= guests : true;

      return matchesLocation && matchesGuests;
    });
    setFilteredProperties(filtered);

    // Smooth scroll to results
    const resultsElement = document.getElementById('search-results');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#fcfaf8] min-h-screen pb-24">
      <Hero onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto px-6" id="search-results">
        {/* Editor's Picks Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {filteredProperties.length < properties.length ? 'Search Results' : "Editor's Picks"}
            </h3>
            {filteredProperties.length < properties.length && (
              <button
                onClick={() => setFilteredProperties(properties)}
                className="text-gray-400 font-bold text-sm hover:text-gray-900 flex items-center gap-1 group"
              >
                Reset filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm transition-all animate-in fade-in zoom-in-95">
              <span className="material-symbols-outlined text-gray-200 text-9xl mb-4">houseboat</span>
              <h4 className="text-2xl font-black text-gray-900 mb-2">No matching stays found</h4>
              <p className="text-gray-400 font-bold mb-8">Try adjusting your search criteria or removing filters.</p>
              <button
                onClick={() => setFilteredProperties(properties)}
                className="bg-gray-900 text-white font-black px-10 py-4 rounded-2xl shadow-xl transition-all active:scale-95"
              >Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProperties.map((property) => (
                <Link key={property.id} to={`/property/${property.id}`} className="group cursor-pointer">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                    <img
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={property.image || (property.images && property.images[0]) || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000&auto=format&fit=crop'}
                      alt={property.title}
                    />
                    <button className="absolute top-4 right-4 size-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white transition-all active:scale-90 group/heart">
                      <span className="material-symbols-outlined text-gray-700 text-xl font-light group-hover/heart:text-red-500 group-hover/heart:fill-1 transition-colors">favorite</span>
                    </button>
                    {(property.isRareFind || property.status === 'featured') && (
                      <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-wider text-gray-900 shadow-sm border border-gray-100">
                        Rare Find
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-[#ec6d13] transition-colors line-clamp-1">
                      {property.title}
                    </h4>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-orange-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-sm font-bold text-gray-900">{property.rating || '4.9'}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-2 font-medium line-clamp-1">
                    {property.location || (property.city && property.country ? `${property.city}, ${property.country}` : property.city || property.address)}
                  </p>

                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-gray-900">
                      ${property.price || property.basePrice || property.baseprice || 100}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">/ night</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Categories / Trust Section */}
        <section className="py-12 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'verified_user', title: 'Verified Hosts', desc: 'Every stay is vetted by our team' },
              { icon: 'support_agent', title: '24/7 Support', desc: 'Global assistance at any hour' },
              { icon: 'security', title: 'Secure Payment', desc: 'Safe and encrypted transactions' },
              { icon: 'nature_people', title: 'Unique Stays', desc: 'From treehouses to castles' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all duration-300 group">
                <div className="size-12 flex-shrink-0 rounded-xl bg-orange-100/50 flex items-center justify-center group-hover:bg-[#ec6d13] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[#ec6d13] group-hover:text-white transition-colors">{item.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default HomePage;