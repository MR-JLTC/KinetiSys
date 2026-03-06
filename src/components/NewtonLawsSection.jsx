import React from 'react';

const NewtonLawsSection = () => {
    return (
        <section id="laws" className="section bg-white">
            <div className="container">
                <h2 className="section-title">Newton's Laws in Action</h2>
                <p className="section-subtitle">How fundamental physics apply to jumping</p>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="card">
                        <h3 className="mb-4" style={{ color: 'var(--accent-color)' }}>First Law (Inertia)</h3>
                        <p><strong>"An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force."</strong></p>
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                            A person standing still will remain on the ground until their leg muscles generate a force strong enough to overcome gravity and their own inertia.
                        </p>
                    </div>

                    <div className="card">
                        <h3 className="mb-4" style={{ color: 'var(--accent-color)' }}>Second Law (F = ma)</h3>
                        <p><strong>"The acceleration of an object depends on the mass of the object and the amount of force applied."</strong></p>
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                            To jump higher, a greater upward force must be exerted. The more mass a person has, the more force is required to achieve the same acceleration and jump height.
                        </p>
                    </div>

                    <div className="card">
                        <h3 className="mb-4" style={{ color: 'var(--accent-color)' }}>Third Law (Action & Reaction)</h3>
                        <p><strong>"For every action, there is an equal and opposite reaction."</strong></p>
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                            When jumping, the person pushes downward against the ground (action). The ground pushes back upward on the person with an equal amount of force (reaction), propelling them into the air.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewtonLawsSection;
