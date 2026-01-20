import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    BarChart2,
    User,
    LogOut,
    Clock
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full p-6">
            {/* Logo Section */}
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center font-bold text-lg shadow-sm">
                    M
                </div>
                <span className="font-bold text-xl tracking-tight">SME Copilot</span>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2 flex-1">
                <button
                    onClick={() => navigate('/')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/') ? 'bg-gray-50 text-brand' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    <LayoutDashboard size={24} />
                    Dashboard
                </button>
                <button
                    onClick={() => navigate('/history')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/history') ? 'bg-gray-50 text-brand' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    <Clock size={24} />
                    History
                </button>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                >
                    <FileText size={24} />
                    Files
                </button>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                >
                    <BarChart2 size={24} />
                    Statistics
                </button>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                >
                    <User size={24} />
                    Profile
                </button>
            </nav>

            {/* User Profile Stub */}
            <div className="mt-auto pt-6 border-t">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                        <User className="text-gray-400" size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-bold">Zahin Ukasyah</div>
                        <div className="text-xs text-gray-500">Relationship Manager</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
