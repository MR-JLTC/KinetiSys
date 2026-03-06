import React from 'react';

const InputPanel = ({ inputs, handleInputChange, handleSimulate, handleReset, isSimulating, error }) => {
    return (
        <div className="card">
            <h3 className="mb-4">Simulation Parameters</h3>

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
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Mass is not required to calculate jump height velocity or airtime, but helps calculate Force, Energy and Momentum.
                </p>
            </div>

            <div className="flex gap-4 mt-6" style={{ marginTop: '1.5rem' }}>
                <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={handleSimulate}
                    disabled={isSimulating}
                >
                    {isSimulating ? 'Simulating...' : 'Simulate Jump'}
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={handleReset}
                    disabled={isSimulating}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default InputPanel;
