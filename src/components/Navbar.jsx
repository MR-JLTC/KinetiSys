import React from 'react';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="navbar-brand">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    KinetiSys
                </div>
                <div className="navbar-links">
                    <a href="#about" className="navbar-link">About</a>
                    <a href="#simulator" className="navbar-link">Simulator</a>
                    <a href="#laws" className="navbar-link">Newton's Laws</a>
                    <a href="#formulas" className="navbar-link">Formulas</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
