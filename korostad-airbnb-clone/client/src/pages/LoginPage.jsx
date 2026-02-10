import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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

    const result = await login(formData.email, formData.password);

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
      alert(result.message || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#fcfaf8] py-12 px-6 lg:px-8 font-jakarta">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex flex-col items-center gap-2 group">
            <img src="/assets/logo.png" alt="Korstrada" className="h-16 w-auto object-contain transition-transform group-hover:scale-110" />
            <h1 className="text-3xl font-black tracking-tighter text-gray-900">Korstrada</h1>
          </Link>
        </div>
        <h2 className="text-center text-4xl font-black text-gray-900 tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-gray-500 font-bold">
          Enter your credentials to access your curator portal.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-10 shadow-2xl shadow-gray-200/50 rounded-[2.5rem] border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 font-bold placeholder-gray-300 focus:outline-none focus:border-[#ec6d13] focus:ring-0 transition-all sm:text-sm"
                placeholder="curator@korstrada.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 font-bold placeholder-gray-300 focus:outline-none focus:border-[#ec6d13] focus:ring-0 transition-all sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[#ec6d13] focus:ring-[#ec6d13] border-gray-300 rounded-lg cursor-pointer" />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-bold text-gray-500 cursor-pointer">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-bold text-[#ec6d13] hover:underline">Forgot password?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-xl shadow-orange-100 text-lg font-black text-white bg-[#ec6d13] hover:bg-orange-600 focus:outline-none transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-bold text-gray-500">
              New to our community?{' '}
              <Link to="/register" className="text-[#ec6d13] hover:underline">
                Request access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;