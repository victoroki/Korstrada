import React, { useState } from 'react';
import AdminSidebar from '../components/admin/Sidebar';

const AdminSettings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <main className="flex-1 p-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">System Settings</h1>
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm max-w-2xl">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <div>
                                <p className="font-bold text-gray-900">Maintenance Mode</p>
                                <p className="text-sm text-gray-500 font-medium">Temporarily disable the platform for users.</p>
                            </div>
                            <div className="size-12 bg-gray-200 rounded-full cursor-not-allowed"></div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <div>
                                <p className="font-bold text-gray-900">Email Notifications</p>
                                <p className="text-sm text-gray-500 font-medium">Send automated emails for bookings.</p>
                            </div>
                            <div className="size-12 bg-[#ec6d13]/20 rounded-full flex items-center justify-center">
                                <div className="size-6 bg-[#ec6d13] rounded-full"></div>
                            </div>
                        </div>
                        <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl active:scale-95 transition-all">
                            Save Global Settings
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminSettings;
