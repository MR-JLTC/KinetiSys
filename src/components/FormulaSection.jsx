import React from 'react';

const FormulaSection = () => {
    return (
        <section id="formulas" className="section" style={{ backgroundColor: '#f8fafc' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <h2 className="section-title">Formula Reference</h2>
                <p className="section-subtitle">The mathematics powering the simulation</p>

                <div className="card">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="mb-2">Initial Velocity (v)</h4>
                            <div className="equation-block">v = √(2gh)</div>
                            <p className="mb-6" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Derived from the kinematic equation v² = u² + 2as. Since velocity at the peak is 0, we can solve for initial velocity.
                            </p>

                            <h4 className="mb-2">Time to Peak (t_up)</h4>
                            <div className="equation-block">t_up = v / g</div>
                            <p className="mb-6" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                The time it takes gravity (g) to decelerate the jumper from their initial velocity to 0 at the peak.
                            </p>

                            <h4 className="mb-2">Total Airtime (t_total)</h4>
                            <div className="equation-block">t_total = 2 × t_up</div>
                            <p className="mb-0" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Assuming the jumper lands at the same height they took off from, descent time equals ascent time.
                            </p>
                        </div>

                        <div>
                            <h4 className="mb-2">Weight (W)</h4>
                            <div className="equation-block">W = m × g</div>
                            <p className="mb-6" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                The force exerted by gravity on the jumper's mass (m). Measured in Newtons.
                            </p>

                            <h4 className="mb-2">Potential Energy (PE)</h4>
                            <div className="equation-block">PE = m × g × h</div>
                            <p className="mb-6" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                The energy stored by an object due to its position relative to Earth. At the peak, all kinetic energy has converted to potential energy.
                            </p>

                            <h4 className="mb-2">Momentum at Takeoff (p)</h4>
                            <div className="equation-block">p = m × v</div>
                            <p className="mb-0" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                The quantity of motion the jumper has when leaving the ground.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                        <p style={{ fontSize: '0.875rem' }}><strong>Constants:</strong> Acceleration due to gravity (g) ≈ 9.81 m/s²</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FormulaSection;
