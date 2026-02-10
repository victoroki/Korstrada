import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store'; // We'll create this
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import MobileNav from './components/common/MobileNav';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import GuestDashboard from './pages/GuestDashboard';
import HostDashboard from './pages/HostDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminProperties from './pages/AdminProperties';
import AdminBookings from './pages/AdminBookings';
import AdminReviews from './pages/AdminReviews';
import AdminSettings from './pages/AdminSettings';
import AddPropertyPage from './pages/AddPropertyPage';
import AdminPropertyEdit from './pages/AdminPropertyEdit';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/property/:id" element={<PropertyDetailsPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard/guest"
                  element={
                    <ProtectedRoute allowedRoles={['guest']}>
                      <GuestDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/host"
                  element={
                    <ProtectedRoute allowedRoles={['host']}>
                      <HostDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/admin/properties"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminProperties />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/admin/bookings"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminBookings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/admin/reviews"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminReviews />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/admin/settings"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/admin/properties/new"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AddPropertyPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/admin/properties/edit/:id"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminPropertyEdit />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
            <MobileNav />
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
