import React from 'react';

const AboutSection = () => {
    return (
        <section id="about" className="section bg-white">
            <div className="container" style={{ maxWidth: '800px' }}>
                <h2 className="section-title">About the Project</h2>
                <p className="section-subtitle">
                    An interactive approach to learning physics through biomechanics.
                </p>

                <div className="card">
                    <p className="mb-4">
                        The Human Motion Analysis Simulator is designed to bridge the gap between abstract physics formulas and real-world movements. By visualizing a vertical jump, this educational tool demonstrates how Newton's Laws of Motion govern human kinetics.
                    </p>

                    <h3 className="mb-2" style={{ marginTop: '1.5rem' }}>Key Features:</h3>
                    <ul className="about-list">
                        <li>Interactive visual simulation of a vertical jump based on target height.</li>
                        <li>Real-time compilation of related physics formulas like initial velocity, airtime, and potential energy.</li>
                        <li>Step-by-step mathematical breakdown of the jump mechanics.</li>
                        <li>No backend needed, making it a perfect lightweight tool for classroom demonstrations.</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
