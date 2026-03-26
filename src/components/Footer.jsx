import React from 'react';

const Footer = () => {
    return (
        <footer className="footer" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: '#0f172a' }}>
            <div className="container">
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '1.75rem',
                    paddingTop: '1rem'
                }}>
                    <div style={{ textAlign: 'center', maxWidth: '600px' }}>
                        <h4 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
                            Physics Midterm/Final Project
                        </h4>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                            Designed for educational use to demonstrate Newton's Laws of Motion practically.
                        </p>
                    </div>

                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.4) 100%)',
                        padding: '0.6rem 1.5rem',
                        borderRadius: '9999px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem', fontWeight: '500', letterSpacing: '0.02em' }}>
                            Developed by <span style={{ color: 'white', fontWeight: '700' }}>Mr.JLTC</span>
                        </p>
                        <span style={{ color: '#475569' }}>•</span>
                        <span style={{
                            color: 'white',
                            backgroundColor: 'var(--accent-color)',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            letterSpacing: '0.05em',
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)'
                        }}>
                            BSCS4B
                        </span>
                    </div>

                    <div style={{ 
                        width: '100%', 
                        maxWidth: '300px', 
                        height: '1px', 
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                        margin: '0.5rem 0'
                    }}></div>

                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: '500', letterSpacing: '0.02em' }}>
                        &copy; {new Date().getFullYear()} All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
