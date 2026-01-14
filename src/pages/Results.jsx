import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, AlertCircle, TrendingUp, MessageSquare, Bot } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import ChatOverlay from '../components/ui/ChatOverlay';

const data = [
    { name: 'Jan', inflow: 4000, outflow: 2400 },
    { name: 'Feb', inflow: 3000, outflow: 1398 },
    { name: 'Mar', inflow: 2000, outflow: 9800 },
    { name: 'Apr', inflow: 2780, outflow: 3908 },
    { name: 'May', inflow: 1890, outflow: 4800 },
    { name: 'Jun', inflow: 2390, outflow: 3800 },
];

const Results = () => {
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-6xl mx-auto pb-32"
        >
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-dark">MegaMart Sdn Bhd</h1>
                    <p className="text-sm text-gray-500 mt-1 font-mono flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span> SSM: 202301004567
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span> Retail
                    </p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-sm font-bold bg-white border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 transition"
                >
                    <X size={18} />
                    Close Analysis
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Score & Insights */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Score Card Component */}
                    <div className="bg-dark text-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Overall Risk Score</div>
                                <div className="text-5xl font-bold text-brand">88<span className="text-xl text-white font-normal opacity-40">/100</span></div>
                                <div className="text-green-400 text-sm font-bold mt-3 flex items-center gap-2">
                                    <Check size={18} />
                                    Low Risk Profile
                                </div>
                            </div>
                            <div className="w-24 h-24 rounded-full border-[6px] border-gray-700 flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border-[6px] border-brand border-l-transparent border-b-transparent rotate-[-45deg]"></div>
                                <span className="text-3xl font-bold">A</span>
                            </div>
                        </div>
                    </div>

                    {/* AI Insights Component */}
                    <div>
                        <h3 className="font-bold text-dark mb-4 text-sm flex items-center gap-2">
                            <Bot className="text-brand" size={20} />
                            AI Assessment
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-start gap-3">
                                <div className="mt-0.5 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                    <TrendingUp size={14} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-green-800">Stable Revenue Growth</div>
                                    <div className="text-xs text-green-700 mt-1 leading-relaxed">Consistent +12% MoM growth observed over 6 months based on inflow analysis.</div>
                                </div>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex items-start gap-3">
                                <div className="mt-0.5 w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">
                                    <AlertCircle size={14} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-yellow-800">Supplier Dependency</div>
                                    <div className="text-xs text-yellow-700 mt-1 leading-relaxed">40% of outflow goes to a single entity ("Nestle"). Risk of supply chain disruption.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Graphs */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-dark text-sm">Cash Flow Analysis (6 Months)</h3>
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-2 h-2 rounded-full bg-green-500"></span> Inflow</span>
                                <span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-2 h-2 rounded-full bg-red-500"></span> Outflow</span>
                            </div>
                        </div>
                        <div className="flex-1 relative min-h-[300px]">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="inflow" stroke="#22c55e" fillOpacity={1} fill="url(#colorInflow)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="outflow" stroke="#ef4444" fillOpacity={1} fill="url(#colorOutflow)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Chat Button */}
            <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="flex items-center gap-3 bg-black text-white pl-5 pr-2 py-2 rounded-full shadow-2xl hover:scale-105 transition-transform group"
                >
                    <span className="text-sm font-bold">Ask AI Copilot</span>
                    <div className="w-10 h-10 rounded-full bg-brand text-black flex items-center justify-center">
                        <MessageSquare size={20} />
                    </div>
                </button>
            </div>

            <ChatOverlay isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </motion.div>
    );
};

export default Results;
