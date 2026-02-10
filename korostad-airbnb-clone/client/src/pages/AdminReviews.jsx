import React, { useState } from 'react';
import AdminSidebar from '../components/admin/Sidebar';

const AdminReviews = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <main className="flex-1 p-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Reviews</h1>
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <span className="material-symbols-outlined text-6xl text-gray-200 mb-4 scale-150">reviews</span>
                    <h2 className="text-xl font-bold text-gray-900">No Reviews to Display</h2>
                    <p className="text-gray-500 font-medium mt-2">Platform reviews will appear here once guests start leaving them.</p>
                </div>
            </main>
        </div>
    );
};

export default AdminReviews;
