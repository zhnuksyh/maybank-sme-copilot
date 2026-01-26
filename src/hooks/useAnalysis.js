import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAnalysis = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('idle'); // idle, processing, complete, error
    const [steps, setSteps] = useState([
        { id: 1, label: 'OCR Extraction (LlamaParse)', status: 'pending' },
        { id: 2, label: 'Merging & Standardizing Data', status: 'pending' },
        { id: 3, label: 'Generating Financial Risk Graph', status: 'pending' }
    ]);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [error, setError] = useState(null);

    const updateStep = (index, status) => {
        setSteps(prev => prev.map((step, i) =>
            i === index ? { ...step, status } : step
        ));
    };

    const startAnalysis = async (files) => {
        setStatus('processing');
        setCurrentStepIndex(0);
        setError(null);

        try {
            // Step 1: Upload and OCR
            // We'll treat the upload API call as covering all steps for now, 
            // but we can animate the progress bar while waiting.

            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });

            // Start animation for step 1
            updateStep(0, 'process');

            // Ideally we would stream progress, but for a simple prototype:
            // We'll just wait for the response.
            // To make it look "alive", we can simulate step completion if it takes time, 
            // or just move to "done" when we get the response.

            const response = await fetch('http://localhost:8000/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();

            // When data comes back, strict sequence:
            updateStep(0, 'done');
            setCurrentStepIndex(1);

            // Fast forward other steps for visual effect
            await new Promise(r => setTimeout(r, 500));
            updateStep(1, 'done');
            setCurrentStepIndex(2);

            await new Promise(r => setTimeout(r, 500));
            updateStep(2, 'done');

            setStatus('complete');

            // Navigate with data
            setTimeout(() => {
                navigate('/results', { state: { data } });
            }, 500);

        } catch (err) {
            console.error(err);
            setError(err.message);
            setStatus('error');
        }
    };

    return {
        status,
        steps,
        currentStepIndex,
        startAnalysis,
        error
    };
};
