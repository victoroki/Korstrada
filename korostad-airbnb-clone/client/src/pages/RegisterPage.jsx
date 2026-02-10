import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'guest'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = JSON.parse(atob(token.split('.')[1]));
        const userRole = userData.role || 'guest';
        navigate(`/dashboard/${userRole}`);
      } else {
        navigate('/');
      }
    } else {
      alert(result.message || 'Registration failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#fcfaf8] py-20 px-6 lg:px-8 font-jakarta">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-flex flex-col items-center gap-2 group mb-8">
          <img src="/assets/logo.png" alt="Korstrada" className="h-16 w-auto object-contain transition-transform group-hover:scale-110" />
          <h1 className="text-3xl font-black tracking-tighter text-gray-900">Korstrada</h1>
        </Link>
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Request Access</h2>
        <p className="mt-2 text-gray-500 font-bold">Join the most exclusive community of boutique travelers and curators.</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-12 px-10 shadow-2xl shadow-gray-200/50 rounded-[3rem] border border-gray-100">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <div className="col-span-1">
              <label htmlFor="firstName" className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 font-bold focus:outline-none focus:border-[#ec6d13] transition-all sm:text-sm"
                placeholder="Julian"
              />
            </div>

            <div className="col-span-1">
              <label htmlFor="lastName" className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="block w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 font-bold focus:outline-none focus:border-[#ec6d13] transition-all sm:text-sm"
                placeholder="Korst"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="email" className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 font-bold focus:outline-none focus:border-[#ec6d13] transition-all sm:text-sm"
                placeholder="julian@korstrada.org"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="phoneNumber" className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="block w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 font-bold focus:outline-none focus:border-[#ec6d13] transition-all sm:text-sm"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label htmlFor="password" className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 font-bold focus:outline-none focus:border-[#ec6d13] transition-all sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label htmlFor="role" className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Portal Type</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 font-bold focus:outline-none focus:border-[#ec6d13] transition-all sm:text-sm appearance-none bg-no-repeat bg-[right_1.25rem_center] bg-[length:1rem]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
              >
                <option value="guest">Boutique Traveler</option>
                <option value="host">Stay Curator (Host)</option>
              </select>
            </div>

            <div className="col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-xl shadow-orange-100 text-lg font-black text-white bg-[#ec6d13] hover:bg-orange-600 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Request Access'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-bold text-gray-500">
              Existing member?{' '}
              <Link to="/login" className="text-[#ec6d13] hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;