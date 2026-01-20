import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, ChevronRight, FileText, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch('http://localhost:8001/api/history');
            const data = await res.json();
            setHistory(data);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewReport = async (id) => {
        try {
            // Fetch full details
            const res = await fetch(`http://localhost:8001/api/analysis/${id}`);
            const data = await res.json();
            // Navigate to results with state
            navigate('/results', { state: { result: data } });
        } catch (error) {
            console.error("Failed to load report", error);
            alert("Could not load report details.");
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this report?")) return;

        try {
            await fetch(`http://localhost:8001/api/analysis/${id}`, { method: 'DELETE' });
            fetchHistory(); // Refresh
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto pb-24">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Analysis History</h1>
                <p className="text-gray-400">Archive of all processed bank statements and risk assessments.</p>
            </header>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading history...</div>
            ) : (
                <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-6 font-semibold">Date</th>
                                <th className="p-6 font-semibold">Company Name</th>
                                <th className="p-6 font-semibold text-center">Risk Score</th>
                                <th className="p-6 font-semibold text-center">Status</th>
                                <th className="p-6 font-semibold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-gray-500">
                                        No history found. Upload a file to get started.
                                    </td>
                                </tr>
                            ) : (
                                history.map((item) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-800/50 transition-colors group"
                                    >
                                        <td className="p-6 text-gray-400 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} />
                                                {new Date(item.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-6 font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-brand">
                                                    <FileText size={16} />
                                                </div>
                                                {item.company_name}
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className={`font-bold text-lg ${item.score < 50 ? 'text-red-400' : 'text-green-400'}`}>
                                                {item.score}
                                            </span>
                                            <span className="text-gray-600 text-xs">/100</span>
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${item.risk_level.includes('High') ? 'bg-red-500/20 text-red-400' :
                                                item.risk_level.includes('Moderate') ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-green-500/20 text-green-400'
                                                }`}>
                                                {item.risk_level}
                                            </span>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="flex items-center justify-center gap-6">
                                                <button
                                                    onClick={() => handleViewReport(item.id)}
                                                    className="text-gray-400 hover:text-brand transition-colors flex items-center gap-2 font-medium text-sm hover:translate-x-1 duration-200"
                                                >
                                                    View Report <ChevronRight size={16} />
                                                </button>
                                                <div className="h-6 w-px bg-gray-800"></div>
                                                <button
                                                    onClick={(e) => handleDelete(e, item.id)}
                                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete Report"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default History;
