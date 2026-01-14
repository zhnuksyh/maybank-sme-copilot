import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';

const MainLayout = () => {
    return (
        <div className="bg-gray-50 text-gray-900 h-screen flex overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                <TopBar />
                <div id="content-area" className="flex-1 overflow-y-auto no-scrollbar bg-gray-50 pb-24 md:pb-10 p-4 md:p-8">
                    <Outlet />
                </div>
            </div>
            <MobileNav />
        </div>
    );
};

export default MainLayout;
