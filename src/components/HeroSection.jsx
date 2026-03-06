import React from 'react';

const HeroSection = () => {
    return (
        <section className="hero">
            <div className="container">
                <h1>Human Motion Analysis</h1>
                <p>A Physics-Based Simulation of Vertical Jump Mechanics Using Newton's Laws of Motion</p>
                <div style={{ marginTop: '2rem' }}>
                    <a href="#simulator" className="btn btn-secondary">Go to Simulator</a>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
