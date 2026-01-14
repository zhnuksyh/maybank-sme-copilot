import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAnalysis = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('idle'); // idle, processing, complete
    const [steps, setSteps] = useState([
        { id: 1, label: 'OCR Extraction (Azure Doc Intel)', status: 'pending' },
        { id: 2, label: 'Merging 6 Months Data', status: 'pending' },
        { id: 3, label: 'Running Risk Guardrails', status: 'pending' }
    ]);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);

    const startAnalysis = () => {
        setStatus('processing');
        setCurrentStepIndex(0);

        // Simulate step 1
        setTimeout(() => {
            updateStep(0, 'done');
            setCurrentStepIndex(1);

            // Simulate step 2
            setTimeout(() => {
                updateStep(1, 'done');
                setCurrentStepIndex(2);

                // Simulate step 3
                setTimeout(() => {
                    updateStep(2, 'done');
                    setStatus('complete');
                    navigate('/results');
                }, 1500);
            }, 1500);
        }, 1500);
    };

    const updateStep = (index, status) => {
        setSteps(prev => prev.map((step, i) =>
            i === index ? { ...step, status } : step
        ));
    };

    return {
        status,
        steps,
        currentStepIndex,
        startAnalysis
    };
};
