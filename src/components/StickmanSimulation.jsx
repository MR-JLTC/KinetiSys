import React, { useEffect, useState, useRef, useCallback } from 'react';

const StickmanSimulation = ({ inputs, results, simState }) => {
    const [stickmanY, setStickmanY] = useState(0); // percentage above ground
    const animFrameRef = useRef(null);
    const startTimeRef = useRef(null);

    // --- Dynamic height scale based on user input ---
    const h = inputs.height ? parseFloat(inputs.height) : 0;
    const targetHeight = Math.max(h, 0);
    const scaleMax = Math.max(1, Math.ceil(targetHeight * 2) / 2);

    // Marker percent for the ruler (where the target line is drawn)
    const markerPercent = targetHeight > 0 ? (targetHeight / scaleMax) * 80 : 0;

    // Stickman travel: subtract ~20% for body height so head aligns with marker
    const headOffsetPercent = 20;
    const stickmanTravelPercent = Math.max(0, markerPercent - headOffsetPercent);

    // Generate evenly spaced markers
    const markerCount = Math.min(Math.round(scaleMax / 0.5) + 1, 8);
    const markerStep = scaleMax / (markerCount - 1);
    const markers = [];
    for (let i = 0; i < markerCount; i++) {
        const val = parseFloat((i * markerStep).toFixed(2));
        markers.push({ label: `${val.toFixed(1)}m`, val });
    }

    // Physics values
    const g = 9.81;
    const v0 = results ? results.v : Math.sqrt(2 * g * (targetHeight || 0.5));
    const t_total = results ? results.t_total : (2 * v0) / g;

    // --- Mass-based SUBTLE animation style ---
    const rawMass = inputs.mass ? parseFloat(inputs.mass) : 0;
    const mass = (isNaN(rawMass) || rawMass <= 0) ? 0 : rawMass;
    const clampedMass = Math.min(Math.max(mass, 30), 150);
    const crouchDuration = 0.2 + ((clampedMass - 30) / (150 - 30)) * 0.4;

    // --- Real physics animation using requestAnimationFrame ---
    // y(t) = v0*t - 0.5*g*t²   (parabolic arc)
    // Normalized: y/h = (v0*t - 0.5*g*t²) / h
    // At t=0, y=0. At t=t_total/2, y=h (peak). At t=t_total, y=0.
    const animateJump = useCallback(() => {
        if (!results || targetHeight <= 0) return;

        const totalDurationMs = t_total * 1000;

        const step = (timestamp) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const elapsed = timestamp - startTimeRef.current;
            const t = Math.min(elapsed / 1000, t_total); // current time in seconds

            // Kinematic equation: y(t) = v0*t - 0.5*g*t²
            const y = v0 * t - 0.5 * g * t * t;

            // Normalize y to percentage of stickman travel
            // y ranges from 0 to h (at peak). Map to 0 to stickmanTravelPercent.
            const normalizedY = Math.max(0, y / targetHeight) * stickmanTravelPercent;
            setStickmanY(normalizedY);

            if (elapsed < totalDurationMs) {
                animFrameRef.current = requestAnimationFrame(step);
            } else {
                // Animation complete — stickman back on ground
                setStickmanY(0);
                startTimeRef.current = null;
            }
        };

        startTimeRef.current = null;
        animFrameRef.current = requestAnimationFrame(step);
    }, [results, targetHeight, v0, g, t_total, stickmanTravelPercent]);

    // Cancel any running animation
    const cancelAnimation = useCallback(() => {
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
        }
        startTimeRef.current = null;
    }, []);

    useEffect(() => {
        if (simState === 'idle' || simState === 'landed') {
            cancelAnimation();
            setStickmanY(0);
        } else if (simState === 'jumping') {
            // Start the real physics animation
            animateJump();
        }

        return () => cancelAnimation();
    }, [simState, animateJump, cancelAnimation]);

    // Stickman pose
    const isCrouching = simState === 'crouch';
    const isInAir = simState === 'jumping'; // during the parabolic arc
    const headY = isCrouching ? 40 : 20;
    const bodyY1 = isCrouching ? 60 : 40;
    const bodyY2 = isCrouching ? 90 : 80;
    const armY = isCrouching ? 90 : 60;
    const legBendY = isCrouching ? 110 : 100;
    const footY = 120;

    return (
        <div className="simulation-area">
            <div className="sky-bg"></div>

            {/* Dynamic height scale markers */}
            <div className="height-scale">
                {markers.map((m) => {
                    const percentPos = (m.val / scaleMax) * 80;
                    return (
                        <div key={m.label} className="scale-mark" style={{ bottom: `calc(10% + ${percentPos}%)` }}>
                            <span className="scale-label">{m.label}</span>
                        </div>
                    );
                })}
                {results && targetHeight > 0 && (
                    <div className="scale-mark" style={{ bottom: `calc(10% + ${markerPercent}%)`, borderBottomColor: 'var(--danger-color)', borderBottomStyle: 'solid' }}>
                        <span className="scale-label" style={{ color: 'var(--danger-color)', fontWeight: 700 }}>Target ({targetHeight.toFixed(2)}m)</span>
                    </div>
                )}
            </div>

            <div className="ground-line"></div>

            {/* Mass info badge */}
            {results && (
                <div style={{
                    position: 'absolute',
                    bottom: '12%',
                    right: '10px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    zIndex: 30,
                    letterSpacing: '0.03em',
                    backdropFilter: 'blur(4px)',
                }}>
                    {mass} kg
                </div>
            )}

            <div
                className="stickman-container"
                style={{
                    bottom: `calc(10% + ${stickmanY}%)`,
                    transition: isCrouching ? `bottom ${crouchDuration}s ease-in-out` : 'none',
                    width: '100px',
                    height: '140px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }}
            >
                <svg width="80" height="120" viewBox="0 0 80 120" overflow="visible">
                    <g stroke="var(--primary-color)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        {/* Head */}
                        <circle cx="40" cy={headY} r="15" fill="var(--primary-color)" />

                        {/* Body */}
                        <line x1="40" y1={bodyY1} x2="40" y2={bodyY2} />

                        {/* Arms */}
                        {isCrouching ? (
                            <>
                                <path d={`M 40 ${bodyY1 + 10} Q 60 70 70 ${armY}`} />
                                <path d={`M 40 ${bodyY1 + 10} Q 20 70 10 ${armY}`} />
                            </>
                        ) : isInAir ? (
                            <>
                                <path d={`M 40 ${bodyY1 + 10} Q 50 30 70 10`} />
                                <path d={`M 40 ${bodyY1 + 10} Q 30 30 10 10`} />
                            </>
                        ) : (
                            <>
                                <path d={`M 40 ${bodyY1 + 10} Q 50 60 45 ${armY}`} />
                                <path d={`M 40 ${bodyY1 + 10} Q 30 60 35 ${armY}`} />
                            </>
                        )}

                        {/* Legs */}
                        {isCrouching ? (
                            <>
                                <path d={`M 40 ${bodyY2} L 55 ${legBendY} L 45 ${footY}`} />
                                <path d={`M 40 ${bodyY2} L 25 ${legBendY} L 35 ${footY}`} />
                            </>
                        ) : isInAir ? (
                            <>
                                <line x1="40" y1={bodyY2} x2="50" y2={footY} />
                                <line x1="40" y1={bodyY2} x2="30" y2={footY} />
                            </>
                        ) : (
                            <>
                                <line x1="40" y1={bodyY2} x2="50" y2={footY} />
                                <line x1="40" y1={bodyY2} x2="30" y2={footY} />
                            </>
                        )}
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default StickmanSimulation;
