import React from 'react';

const ResultsPanel = ({ results }) => {
    if (!results) return null;

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <h3 className="mb-4">Simulation Results</h3>

            {results.isDefaultMass && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', fontStyle: 'italic' }}>
                    * Assuming average body mass of 70 kg for force and energy calculations.
                </p>
            )}

            {/* Landscape grid: always horizontal rows of results */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                <div className="result-box">
                    <span className="result-label">Jump Height (Target)</span>
                    <span className="result-value">{results.h.toFixed(2)} m</span>
                </div>

                <div className="result-box">
                    <span className="result-label">Initial Velocity (v)</span>
                    <span className="result-value">{results.v.toFixed(2)} m/s</span>
                </div>

                <div className="result-box">
                    <span className="result-label">Time to Peak (t_up)</span>
                    <span className="result-value">{results.t_up.toFixed(2)} s</span>
                </div>

                <div className="result-box">
                    <span className="result-label">Total Airtime (t_total)</span>
                    <span className="result-value">{results.t_total.toFixed(2)} s</span>
                </div>

                <div className="result-box">
                    <span className="result-label">Weight (W)</span>
                    <span className="result-value">{results.w.toFixed(2)} N</span>
                </div>

                <div className="result-box">
                    <span className="result-label">Momentum (p)</span>
                    <span className="result-value">{results.p.toFixed(2)} kg·m/s</span>
                </div>

                <div className="result-box">
                    <span className="result-label">Kinetic Energy (Takeoff)</span>
                    <span className="result-value">{results.ke.toFixed(2)} J</span>
                </div>

                <div className="result-box">
                    <span className="result-label">Potential Energy (Peak)</span>
                    <span className="result-value">{results.pe.toFixed(2)} J</span>
                </div>
            </div>

            {/* Height vs Time Equation — full width */}
            <div className="result-box" style={{ marginTop: '1rem' }}>
                <span className="result-label">Height vs Time Equation</span>
                <span className="result-value" style={{ fontSize: '1.25rem', fontFamily: 'monospace' }}>{results.eqStr}</span>
            </div>

            {/* Physics interpretation */}
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.75rem', border: '1px solid #bfdbfe' }}>
                <p style={{ color: '#1e3a8a' }}>
                    <strong>Interpretation:</strong> To reach {results.h.toFixed(2)} meters, the jumper needs an initial upward velocity of {results.v.toFixed(2)} m/s and stays in the air for approximately {results.t_total.toFixed(2)} seconds. The takeoff kinetic energy perfectly converts into the peak potential energy.
                </p>
            </div>

            {/* Mass explanation — shown when mass is entered */}
            {!results.isDefaultMass && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fefce8', borderRadius: '0.75rem', border: '1px solid #fde68a' }}>
                    <p style={{ color: '#92400e', fontWeight: 600, marginBottom: '0.5rem' }}>
                        💡 How does body mass affect the jump?
                    </p>
                    <p style={{ color: '#78350f', fontSize: '0.95rem', lineHeight: 1.7 }}>
                        A greater body mass does not automatically mean a lower jump. However, reaching the same jump height with a greater mass requires <strong>more energy</strong>. The jump height is determined solely by the initial velocity — which comes from the kinematic equation <em>v = √(2gh)</em>. Body mass affects energy-related values (KE, PE), weight (W), and momentum (p), but does not change the height or airtime of the jump itself.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ResultsPanel;
