import React from 'react';

const StepByStepSolution = ({ results, inputs }) => {
    if (!results) return null;

    const h = inputs.height;
    const m = inputs.mass || 0;
    const g = 9.81;

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <h3 className="mb-6 section-title" style={{ fontSize: '1.75rem', textAlign: 'left' }}>Step-by-Step Computation Guide</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="equation-step card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', boxShadow: 'none', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ background: 'var(--accent-color)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '0.75rem' }}>1</div>
                        <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>Initial Velocity (v)</h4>
                    </div>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Formula: <strong>v = √(2gh)</strong></p>
                    <div className="equation-block" style={{ margin: 0, backgroundColor: 'white' }}>
                        v = √(2 × {g} × {h})<br />
                        v = √{(2 * g * h).toFixed(4)}<br />
                        <strong>v = {results.v.toFixed(2)} m/s</strong>
                    </div>
                </div>

                <div className="equation-step card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', boxShadow: 'none', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ background: 'var(--accent-color)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '0.75rem' }}>2</div>
                        <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>Time to Peak (t_up)</h4>
                    </div>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Formula: <strong>t_up = v / g</strong></p>
                    <div className="equation-block" style={{ margin: 0, backgroundColor: 'white' }}>
                        t_up = {results.v.toFixed(2)} / {g}<br />
                        <strong>t_up = {results.t_up.toFixed(2)} s</strong>
                    </div>
                </div>

                <div className="equation-step card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', boxShadow: 'none', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ background: 'var(--accent-color)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '0.75rem' }}>3</div>
                        <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>Total Airtime (t_tot)</h4>
                    </div>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Formula: <strong>t_total = 2 × t_up</strong></p>
                    <div className="equation-block" style={{ margin: 0, backgroundColor: 'white' }}>
                        t_total = 2 × {results.t_up.toFixed(2)}<br />
                        <strong>t_total = {results.t_total.toFixed(2)} s</strong>
                    </div>
                </div>

                <div className="equation-step card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', boxShadow: 'none', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ background: 'var(--accent-color)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '0.75rem' }}>4</div>
                        <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>Weight (W)</h4>
                    </div>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Formula: <strong>W = m × g</strong></p>
                    <div className="equation-block" style={{ margin: 0, backgroundColor: 'white' }}>
                        W = {results.usedMass} × {g}<br />
                        <strong>W = {results.w.toFixed(2)} N</strong>
                    </div>
                </div>

                <div className="equation-step card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', boxShadow: 'none', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ background: 'var(--accent-color)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '0.75rem' }}>5</div>
                        <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>Momentum (p)</h4>
                    </div>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Formula: <strong>p = m × v</strong></p>
                    <div className="equation-block" style={{ margin: 0, backgroundColor: 'white' }}>
                        p = {results.usedMass} × {results.v.toFixed(2)}<br />
                        <strong>p = {results.p.toFixed(2)} kg·m/s</strong>
                    </div>
                </div>

                <div className="equation-step card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', boxShadow: 'none', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ background: 'var(--accent-color)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '0.75rem' }}>6</div>
                        <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>Kinetic Energy (KE)</h4>
                    </div>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Formula: <strong>KE = 0.5 × m × v²</strong></p>
                    <div className="equation-block" style={{ margin: 0, backgroundColor: 'white' }}>
                        KE = 0.5 × {results.usedMass} × ({results.v.toFixed(2)})²<br />
                        <strong>KE = {results.ke.toFixed(2)} J</strong>
                    </div>
                </div>

                <div className="equation-step card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', boxShadow: 'none', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ background: 'var(--accent-color)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '0.75rem' }}>7</div>
                        <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>Potential Energy (PE)</h4>
                    </div>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Formula: <strong>PE = m × g × h</strong></p>
                    <div className="equation-block" style={{ margin: 0, backgroundColor: 'white' }}>
                        PE = {results.usedMass} × {g} × {h}<br />
                        <strong>PE = {results.pe.toFixed(2)} J</strong>
                    </div>
                </div>

                <div className="equation-step card md:col-span-2 lg:col-span-2" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', boxShadow: 'none', backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ background: '#1e3a8a', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '0.75rem' }}>8</div>
                        <h4 style={{ margin: 0, color: '#1e3a8a' }}>Height vs Time Equation (y(t))</h4>
                    </div>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: '#1e3a8a' }}>Formula: <strong>y(t) = v × t - 0.5 × g × t²</strong></p>
                    <div className="equation-block" style={{ margin: 0, backgroundColor: 'white', borderLeftColor: '#1e3a8a' }}>
                        y(t) = {results.v.toFixed(2)}t - {0.5 * g}t²<br />
                        <strong style={{ fontSize: '1.1rem', color: '#1e3a8a' }}>{results.eqStr}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepByStepSolution;
