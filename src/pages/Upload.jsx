import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileText, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Upload = () => {
    const navigate = useNavigate();

    const handleUpload = () => {
        navigate('/processing');
    };

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col max-w-3xl mx-auto"
        >
            <div className="mb-8 text-center md:text-left">
                <button
                    onClick={() => navigate('/')}
                    className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2 hover:text-dark transition"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>
                <h1 className="text-3xl font-bold text-dark mb-2">Upload Documents</h1>
                <p className="text-gray-500">We need 6 months of bank statements (PDF) to perform a full risk analysis.</p>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                {/* Dropzone */}
                <div
                    id="dropzone"
                    className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center bg-white hover:border-brand hover:bg-yellow-50/10 transition-all cursor-pointer group"
                    onClick={handleUpload}
                >
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand group-hover:text-white transition-colors">
                        <UploadIcon className="text-gray-400 group-hover:text-black" size={32} />
                    </div>
                    <h3 className="font-bold text-xl text-dark mb-2">Click to Upload Files</h3>
                    <p className="text-sm text-gray-400">Supports PDF batch upload (Max 10MB per file).</p>
                </div>

                {/* File List Stub */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 opacity-60">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                            <FileText size={18} />
                        </div>
                        <div className="h-2 bg-gray-100 rounded w-full"></div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 opacity-40">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                            <FileText size={18} />
                        </div>
                        <div className="h-2 bg-gray-100 rounded w-full"></div>
                    </div>
                </div>
            </div>
        </motion.main>
    );
};

export default Upload;
