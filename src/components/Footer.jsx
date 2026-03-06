import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>Human Motion Analysis</h3>
                    <p>Physics-Based Simulation of Vertical Jump Mechanics</p>
                </div>
                <div className="footer-content">
                    <p>&copy; {new Date().getFullYear()} Physics Midterm/Final Project</p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Designed for educational use to demonstrate Newton's Laws of Motion practically.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
