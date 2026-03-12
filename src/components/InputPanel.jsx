import React, { useState, useEffect } from 'react';

const InputPanel = ({ inputs, inputs2, simCount, handleInputChange, handleInputChange2, handleSimulate, handleReset, isSimulating, error, error2 }) => {

    const [currentStep, setCurrentStep] = useState(1);

    // Reset step if simCount changes
    useEffect(() => {
        if (simCount === 1) setCurrentStep(1);
    }, [simCount]);

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!inputs.height || parseFloat(inputs.height) <= 0) return; // Prevent advancing if height 1 is invalid
            setCurrentStep(2);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(1);
    };

    const handleLocalReset = () => {
        setCurrentStep(1);
        handleReset();
    };

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className="mb-4">Simulation Parameters</h3>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>

                {/* Step 1: Simulation 1 Settings */}
                {currentStep === 1 && (
                    <div className="fade-in" style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#f8fafc' }}>
                        {simCount === 2 && <h4 className="mb-3" style={{ fontSize: '1rem', color: 'var(--accent-color)' }}>Simulation 1 (1 of 2)</h4>}
                        <div className="input-group">
                            <label className="input-label" htmlFor="height">Target Jump Height (meters) *</label>
                            <input
                                id="height"
                                name="height"
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="e.g., 0.75"
                                className="input-field"
                                value={inputs.height}
                                onChange={handleInputChange}
                                disabled={isSimulating}
                            />
                            {error && <div className="input-error">{error}</div>}
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="mass">Body Mass (kilograms) [Optional]</label>
                            <input
                                id="mass"
                                name="mass"
                                type="number"
                                step="0.1"
                                min="1"
                                placeholder="e.g., 70"
                                className="input-field"
                                value={inputs.mass}
                                onChange={handleInputChange}
                                disabled={isSimulating}
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Simulation 2 Settings */}
                {currentStep === 2 && simCount === 2 && (
                    <div className="fade-in" style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#fff7ed' }}>
                        <h4 className="mb-3" style={{ fontSize: '1rem', color: '#f97316' }}>Simulation 2 (2 of 2)</h4>
                        <div className="input-group">
                            <label className="input-label" htmlFor="height2">Target Jump Height (meters) *</label>
                            <input
                                id="height2"
                                name="height"
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="e.g., 0.85"
                                className="input-field"
                                value={inputs2.height}
                                onChange={handleInputChange2}
                                disabled={isSimulating}
                            />
                            {error2 && <div className="input-error">{error2}</div>}
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="mass2">Body Mass (kilograms) [Optional]</label>
                            <input
                                id="mass2"
                                name="mass"
                                type="number"
                                step="0.1"
                                min="1"
                                placeholder="e.g., 80"
                                className="input-field"
                                value={inputs2.mass}
                                onChange={handleInputChange2}
                                disabled={isSimulating}
                            />
                        </div>
                    </div>
                )}
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem', marginBottom: '1rem' }}>
                * Mass helps calculate Force, Energy and Momentum. Velocity and Time depend on Height.
            </p>

            {/* Stepper / Action Controls */}
            <div className="flex gap-4 mt-auto">
                {simCount === 2 && currentStep === 1 && (
                    <button
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                        onClick={handleNextStep}
                        disabled={isSimulating || !inputs.height || parseFloat(inputs.height) <= 0}
                    >
                        Next: Simulation 2
                    </button>
                )}

                {simCount === 2 && currentStep === 2 && (
                    <button
                        className="btn btn-secondary"
                        style={{ flex: '0 1 auto' }}
                        onClick={handlePrevStep}
                        disabled={isSimulating}
                    >
                        Back
                    </button>
                )}

                {(simCount === 1 || (simCount === 2 && currentStep === 2)) && (
                    <button
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                        onClick={handleSimulate}
                        disabled={isSimulating}
                    >
                        {isSimulating ? 'Simulating...' : 'Simulate Jump'}
                    </button>
                )}

                <button
                    className="btn btn-secondary"
                    onClick={handleLocalReset}
                    disabled={isSimulating}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default InputPanel;
