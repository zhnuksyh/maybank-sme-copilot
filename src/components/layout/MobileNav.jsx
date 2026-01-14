import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart2, User, MessageSquare } from 'lucide-react';

const MobileNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="md:hidden bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center fixed bottom-0 w-full pb-6 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
            <button
                onClick={() => navigate('/')}
                className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-brand' : 'text-gray-300'}`}
            >
                <LayoutDashboard size={20} />
                <span className="text-[10px] font-bold">Home</span>
            </button>

            <button className="flex flex-col items-center gap-1 text-gray-300">
                <FileText size={20} />
                <span className="text-[10px] font-medium">Files</span>
            </button>

            {/* Floating Action Button placeholder space */}
            <div className="w-14"></div>

            <div className="absolute left-1/2 -translate-x-1/2 -top-6">
                <button
                    onClick={() => navigate('/chat')} // Or toggle chat overlay
                    className="w-14 h-14 rounded-full bg-black text-white shadow-xl flex items-center justify-center border-4 border-gray-50 transition-transform hover:scale-105 active:scale-95"
                >
                    <MessageSquare size={24} />
                </button>
            </div>

            <button className="flex flex-col items-center gap-1 text-gray-300">
                <BarChart2 size={20} />
                <span className="text-[10px] font-medium">Stats</span>
            </button>

            <button className="flex flex-col items-center gap-1 text-gray-300">
                <User size={20} />
                <span className="text-[10px] font-medium">Profile</span>
            </button>
        </nav>
    );
};

export default MobileNav;
