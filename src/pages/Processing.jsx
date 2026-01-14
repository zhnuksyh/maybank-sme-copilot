import React, { useEffect } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const Processing = () => {
    const { status, steps, startAnalysis } = useAnalysis();

    useEffect(() => {
        startAnalysis();
    }, []);

    return (
        <div className="h-full flex flex-col justify-center items-center text-center bg-white/90 backdrop-blur-sm absolute inset-0 z-50">
            <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-[6px] border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-[6px] border-brand rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">AI</div>
            </div>

            <h2 className="text-2xl font-bold text-dark mb-2">Analyzing Data</h2>
            <div className="h-6 overflow-hidden relative w-full max-w-xs mb-8">
                <p className="text-sm text-gray-500 transition-all duration-300 absolute w-full text-center top-0">
                    Initializing LlamaParse...
                </p>
            </div>

            <div className="text-left space-y-3 w-full max-w-[280px]">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: step.status === 'pending' ? 0 : 1, y: step.status === 'pending' ? 10 : 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 text-sm text-green-600"
                    >
                        <Check size={18} />
                        {step.label}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Processing;
