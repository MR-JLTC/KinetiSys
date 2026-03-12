import React from 'react';

const ResultsPanel = ({ results, results2, avgVelocity }) => {
    if (!results) return null;

    const renderResultGrid = (res, title, color) => (
        <div style={{ flex: 1 }}>
            {title && <h4 className="mb-3" style={{ color: color || 'inherit' }}>{title}</h4>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                <div className="result-box">
                    <span className="result-label">Target Height</span>
                    <span className="result-value">{res.h.toFixed(2)} m</span>
                </div>
                <div className="result-box">
                    <span className="result-label">Initial Velocity</span>
                    <span className="result-value">{res.v.toFixed(2)} m/s</span>
                </div>
                <div className="result-box">
                    <span className="result-label">Avg. Velocity (Ascent)</span>
                    <span className="result-value">{(res.v / 2).toFixed(2)} m/s</span>
                </div>
                <div className="result-box">
                    <span className="result-label">Time to Peak</span>
                    <span className="result-value">{res.t_up.toFixed(2)} s</span>
                </div>
                <div className="result-box">
                    <span className="result-label">Total Airtime</span>
                    <span className="result-value">{res.t_total.toFixed(2)} s</span>
                </div>
                <div className="result-box">
                    <span className="result-label">Weight (W)</span>
                    <span className="result-value">{res.w.toFixed(2)} N</span>
                </div>
                <div className="result-box">
                    <span className="result-label">Momentum (p)</span>
                    <span className="result-value">{res.p.toFixed(2)} kg·m/s</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <h3 className="mb-4">Simulation Results</h3>

            {results2 && avgVelocity !== null && (
                <div className="result-box" style={{ marginBottom: '2rem', border: '2px solid var(--accent-color)', backgroundColor: '#f0f9ff', textAlign: 'center' }}>
                    <span className="result-label" style={{ color: 'var(--primary-color)' }}>Combined Average Initial Velocity</span>
                    <span className="result-value" style={{ fontSize: '2.5rem' }}>{avgVelocity.toFixed(2)} m/s</span>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: results2 ? 'column' : 'row', gap: '2rem' }}>
                {renderResultGrid(results, results2 ? "Simulation 1" : null, "var(--accent-color)")}
                {results2 && renderResultGrid(results2, "Simulation 2", "#f97316")}
            </div>

            {/* Height vs Time Equations */}
            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: results2 ? '1fr 1fr' : '1fr', gap: '1rem' }}>
                <div className="result-box">
                    <span className="result-label">Eq. 1: {results.eqStr}</span>
                </div>
                {results2 && (
                    <div className="result-box">
                        <span className="result-label">Eq. 2: {results2.eqStr}</span>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.75rem', border: '1px solid #bfdbfe' }}>
                <p style={{ color: '#1e3a8a' }}>
                    <strong>Interpretation:</strong> {results2
                        ? `Comparing both, Sim 2 requires ${results2.v > results.v ? 'more' : 'less'} initial velocity than Sim 1 to reach its target height.`
                        : `To reach ${results.h.toFixed(2)} meters, the jumper needs an initial upward velocity of ${results.v.toFixed(2)} m/s.`}
                </p>
            </div>
        </div>
    );
};

export default ResultsPanel;
