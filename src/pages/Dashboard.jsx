import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Check, AlertCircle, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';
import StatsGrid from '../components/ui/StatsGrid';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto block"
        >
            <StatsGrid />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Action Card */}
                <div className="md:col-span-1">
                    <div
                        className="bg-dark rounded-3xl p-8 shadow-xl relative overflow-hidden group cursor-pointer h-full min-h-[250px] flex flex-col justify-center"
                        onClick={() => navigate('/upload')}
                    >
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:bg-brand group-hover:text-black transition-colors duration-300">
                                <Upload className="text-white group-hover:text-black" size={32} />
                            </div>
                            <h2 className="text-white font-bold text-2xl mb-2">New Application</h2>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Upload 6 months of statements to perform instant risk analysis.
                            </p>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-brand rounded-full opacity-10 group-hover:opacity-20 transition-all duration-500 transform group-hover:scale-110"></div>
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="md:col-span-2">
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="font-bold text-lg text-dark">Recent Activity</h3>
                        <button className="text-xs text-brand font-semibold hover:underline">View All</button>
                    </div>

                    <div className="space-y-3">
                        {/* Activity Item 1 */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-brand cursor-pointer transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                    TS
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-dark">Tech Solutions Sdn Bhd</div>
                                    <div className="text-xs text-gray-400 font-mono">APP-4922</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                                    <Check size={14} />
                                    Low Risk
                                </div>
                                <div className="text-[10px] text-gray-400 mt-1">2m ago</div>
                            </div>
                        </div>

                        {/* Activity Item 2 */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                                    KR
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-dark">Kedai Runcit Ali</div>
                                    <div className="text-xs text-gray-400 font-mono">APP-4921</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="inline-flex items-center gap-1 text-xs font-bold text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-100">
                                    <AlertCircle size={14} />
                                    Review
                                </div>
                                <div className="text-[10px] text-gray-400 mt-1">1h ago</div>
                            </div>
                        </div>

                        {/* Activity Item 3 */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">
                                    MM
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-dark">Mega Motors</div>
                                    <div className="text-xs text-gray-400 font-mono">APP-4918</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                                    <AlertOctagon size={14} />
                                    High Risk
                                </div>
                                <div className="text-[10px] text-gray-400 mt-1">Yesterday</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.main>
    );
};

export default Dashboard;
