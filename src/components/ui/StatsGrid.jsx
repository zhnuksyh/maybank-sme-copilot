import React from 'react';
import { Clock, CheckSquare, XCircle } from 'lucide-react';

const StatsGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Stat Card 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Pending</div>
                    <div className="text-3xl font-bold text-dark">12</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                    <Clock className="text-gray-400" size={24} />
                </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Approved</div>
                    <div className="text-3xl font-bold text-green-600">45</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckSquare className="text-green-600" size={24} />
                </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Rejected</div>
                    <div className="text-3xl font-bold text-red-500">3</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                    <XCircle className="text-red-500" size={24} />
                </div>
            </div>
        </div>
    );
};

export default StatsGrid;
