import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Check, AlertCircle, TrendingUp, MessageSquare, Bot } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import ChatOverlay from '../components/ui/ChatOverlay';

const defaultData = [
    { name: 'Jan', inflow: 4000, outflow: 2400 },
    { name: 'Feb', inflow: 3000, outflow: 1398 },
    { name: 'Mar', inflow: 2000, outflow: 9800 },
    { name: 'Apr', inflow: 2780, outflow: 3908 },
    { name: 'May', inflow: 1890, outflow: 4800 },
    { name: 'Jun', inflow: 2390, outflow: 3800 },
];

const Results = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isChatOpen, setIsChatOpen] = useState(false);

    const apiData = location.state?.data;
    // Map backend graph_data "month" to Recharts "name" if needed
    // Backend returns: { month: "Jan", inflow: ..., outflow: ... }
    // Recharts expects: { name: "Jan", ... }

    const chartData = apiData?.graph_data?.map(item => ({
        ...item,
        name: item.month
    })) || defaultData;

    // Calculate totals if from API
    const totalInflow = apiData?.summary?.total_inflow || "15,000"; // Fallback/demo
    const totalOutflow = apiData?.summary?.total_outflow || "8,000";


    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-6xl mx-auto pb-32"
        >
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-dark">{apiData?.entity_name || "MegaMart Sdn Bhd"}</h1>
                    <p className="text-sm text-gray-500 mt-1 font-mono flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span> SSM: {apiData?.ssm || "202301004567"}
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
                                <div className="text-5xl font-bold text-brand">{apiData?.summary?.score !== undefined ? apiData.summary.score : 88}<span className="text-xl text-white font-normal opacity-40">/100</span></div>
                                <div className={`text-sm font-bold mt-3 flex items-center gap-2 ${apiData?.summary?.score < 50 ? 'text-red-400' : 'text-green-400'}`}>
                                    <Check size={18} />
                                    {apiData?.summary?.risk_level || "Low Risk Profile"}
                                </div>
                            </div>
                            <div className="w-24 h-24 rounded-full border-[6px] border-gray-700 flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border-[6px] border-brand border-l-transparent border-b-transparent rotate-[-45deg]"></div>
                                <span className="text-3xl font-bold">{apiData?.summary?.score >= 80 ? 'A' : apiData?.summary?.score >= 50 ? 'B' : 'C'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Red Flags Alert */}
                    {apiData?.red_flags && apiData.red_flags.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 mb-6 animate-pulse">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                    <AlertCircle size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-red-700">Risk Alerts Detected</h3>
                            </div>
                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1 ml-2">
                                {apiData.red_flags.map((flag, i) => (
                                    <li key={i}>{flag}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* AI Insights Component */}
                    <div>
                        <h3 className="font-bold text-dark mb-4 text-sm flex items-center gap-2">
                            <Bot className="text-brand" size={20} />
                            AI Assessment
                        </h3>
                        <div className="space-y-4">
                            {apiData?.insights && apiData.insights.length > 0 ? (
                                apiData.insights.map((insight, idx) => (
                                    <div key={idx} className={`border p-4 rounded-xl flex items-start gap-3 ${insight.type === 'positive' ? 'bg-green-50 border-green-100' : insight.type === 'warning' ? 'bg-yellow-50 border-yellow-100' : insight.type === 'negative' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                                        <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${insight.type === 'positive' ? 'bg-green-100 text-green-600' : insight.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : insight.type === 'negative' ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-500'}`}>
                                            {insight.type === 'positive' ? <TrendingUp size={14} /> : <AlertCircle size={14} />}
                                        </div>
                                        <div>
                                            <div className={`text-sm font-bold ${insight.type === 'positive' ? 'text-green-800' : insight.type === 'warning' ? 'text-yellow-800' : insight.type === 'negative' ? 'text-red-800' : 'text-gray-800'}`}>{insight.title}</div>
                                            <div className={`text-xs mt-1 leading-relaxed ${insight.type === 'positive' ? 'text-green-700' : insight.type === 'warning' ? 'text-yellow-700' : insight.type === 'negative' ? 'text-red-700' : 'text-gray-600'}`}>{insight.text}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-400 italic">No specific insights generated.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Graphs & Concentration */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-dark text-sm">Cash Flow Analysis (6 Months)</h3>
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-2 h-2 rounded-full bg-green-500"></span> Inflow</span>
                                <span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-2 h-2 rounded-full bg-red-500"></span> Outflow</span>
                            </div>
                        </div>
                        <div className="flex-1 relative min-h-[300px]">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={chartData}>
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

                    {/* Concentration Risk Table */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-dark text-sm mb-4">Top Customers (Concentration Risk)</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-400 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">Counterparty Name</th>
                                        <th className="px-4 py-3 text-right">Total Inflow</th>
                                        <th className="px-4 py-3 text-right rounded-r-lg">% Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {apiData?.top_payers && apiData.top_payers.length > 0 ? (
                                        apiData.top_payers.map((payer, idx) => (
                                            <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                                                <td className="px-4 py-3 font-medium text-dark">{payer.name}</td>
                                                <td className="px-4 py-3 text-right text-green-600 font-mono">RM {payer.amount.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${payer.percentage > 40 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                                        {payer.percentage}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-4 py-8 text-center text-gray-400 italic">No inflow data available for concentration analysis.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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
