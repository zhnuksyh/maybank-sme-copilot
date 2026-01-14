import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';

const TopBar = () => {
    const location = useLocation();

    const getTitle = () => {
        switch (location.pathname) {
            case '/': return 'Dashboard';
            case '/upload': return 'New Application';
            case '/processing': return 'Analysing Data';
            case '/results': return 'Risk Analysis';
            default: return 'SME Copilot';
        }
    };

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-gray-100 md:bg-white">
            <div className="md:hidden flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center font-bold text-xs shadow-sm">
                    M
                </div>
                <span className="font-bold text-lg tracking-tight">SME Copilot</span>
            </div>

            <div className="hidden md:block">
                <h2 className="font-bold text-xl text-dark">{getTitle()}</h2>
            </div>

            <div className="w-10 h-10 rounded-full bg-gray-50 border flex items-center justify-center relative hover:bg-gray-100 cursor-pointer transition">
                <Bell className="text-gray-600" size={18} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
        </header>
    );
};

export default TopBar;
