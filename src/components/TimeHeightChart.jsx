import React, { useEffect, useState } from 'react';

const TimeHeightChart = ({ results1, results2, simState, scaleMax, getX, getY, t_peak1, t_peak2, maxTime, t_jump1_start, t_jump1_end, t_crouch2_start, t_jump2_start }) => {
    // Persistent state so dots don't disappear once revealed
    const [peak1Revealed, setPeak1Revealed] = useState(false);
    const [peak2Revealed, setPeak2Revealed] = useState(false);

    // Reset when starting a new simulation (from crouch1)
    useEffect(() => {
        if (simState === 'crouch1' || simState === 'crouch') {
            setPeak1Revealed(false);
            setPeak2Revealed(false);
        } else if (simState === 'landed1' || simState === 'crouch2' || simState === 'jumping2' || simState === 'landed2') {
            setPeak1Revealed(true);
        }

        if (simState === 'landed2') {
            setPeak2Revealed(true);
        }
    }, [simState]);

    if (!results1) return null;

    const g = 9.81;
    const t_total1 = results1.t_total;
    const t_total2 = results2 ? results2.t_total : 0;

    // Generate the continuous theoretical path based on simulation timing
    const generateContinuousPath = () => {
        const points = [];
        const stepsPerPhase = 50;

        // Start at t=0
        points.push(`${getX(0)},${getY(0)}`);

        // Phase 1: crouch1 wait
        points.push(`${getX(t_jump1_start)},${getY(0)}`);

        // Phase 2: jump 1
        for (let i = 1; i <= stepsPerPhase; i++) {
            let dt = (i / stepsPerPhase) * t_total1;
            let t = t_jump1_start + dt;
            let y = results1.v * dt - 0.5 * g * dt * dt;
            points.push(`${getX(t)},${getY(Math.max(0, y))}`);
        }

        if (results2) {
            // Phase 3: gap from end of jump 1 to start of jump 2
            points.push(`${getX(t_jump1_end)},${getY(0)}`); // Flatline immediately at ground
            points.push(`${getX(t_jump2_start)},${getY(0)}`); // Flatline wait across gap & crouch2

            // Phase 4: jump 2
            for (let i = 1; i <= stepsPerPhase; i++) {
                let dt = (i / stepsPerPhase) * t_total2;
                let t = t_jump2_start + dt;
                let y = results2.v * dt - 0.5 * g * dt * dt;
                points.push(`${getX(t)},${getY(Math.max(0, y))}`);
            }
        }
        return `M ${points.join(' L ')}`;
    };

    // Calculate grid lines
    // X ticks: every 0.5 or 1 second
    const gridT_step = Math.max(0.5, Math.ceil((maxTime - 0.5) / 10 * 2) / 2);
    const gridLinesX = [];
    for (let t = 0; t <= maxTime; t += gridT_step) { gridLinesX.push(t); }

    // Y ticks: match marker logic from StickmanSimulation for perfect alignment
    const gridH_step = scaleMax > 2 ? 1.0 : 0.5;
    const gridLinesY = [];
    for (let y = 0; y <= scaleMax; y += gridH_step) { gridLinesY.push(y); }

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 15
        }}>
            {/* SVG for drawing the exact textbook Position vs Time graph */}
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0 }}>
                {/* Background Grid Pattern */}
                <rect width="100%" height="100%" fill="rgba(255,255,255,0.35)" />

                {/* Vertical and Horizontal Grid Lines */}
                {gridLinesX.map((t, idx) => (
                    <line key={`gx-${idx}`} x1={getX(t)} y1={getY(scaleMax) - 5} x2={getX(t)} y2={getY(0)} stroke="#e0e7ff" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                ))}
                {gridLinesY.map((y, idx) => (
                    <line key={`gy-${idx}`} x1={getX(0)} y1={getY(y)} x2={getX(maxTime)} y2={getY(y)} stroke="#e0e7ff" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                ))}

                {/* Continuous Red Graph Line */}
                <path
                    d={generateContinuousPath()}
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    style={{ filter: 'drop-shadow(0 2px 2px rgba(220, 38, 38, 0.3))' }}
                />

                {/* Peak Dots overlaid directly on the graph timeline */}
                {peak1Revealed && (
                    <circle cx={getX(t_peak1)} cy={getY(results1.h)} r="3" fill="#818cf8" stroke="#312e81" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                )}
                {results2 && peak2Revealed && (
                    <circle cx={getX(t_peak2)} cy={getY(results2.h)} r="3" fill="#818cf8" stroke="#312e81" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                )}

                {/* Define Arrowhead for Axes */}
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
                    </marker>
                </defs>

                {/* X Axis Line */}
                <line x1={getX(0)} y1={getY(0)} x2={getX(maxTime) + 2} y2={getY(0)} stroke="#334155" strokeWidth="1" vectorEffect="non-scaling-stroke" markerEnd="url(#arrow)" />

                {/* Y Axis Line */}
                <line x1={getX(0)} y1={getY(0)} x2={getX(0)} y2={getY(scaleMax) - 5} stroke="#334155" strokeWidth="1" vectorEffect="non-scaling-stroke" markerEnd="url(#arrow)" />
            </svg>

            {/* Overlay HTML for crisp textbook text styling */}
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* HTML Labels for exactly when the peaks were reached */}
                {peak1Revealed && (
                    <div style={{
                        position: 'absolute',
                        left: `${getX(t_peak1)}%`,
                        top: `${getY(results1.h)}%`,
                        transform: 'translate(-50%, -150%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        animation: 'fadeIn 0.3s ease-in-out'
                    }}>
                        <div style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '0.75rem', textShadow: '1px 1px 0px rgba(255,255,255,0.9)' }}>
                            {results1.h.toFixed(2)}m
                        </div>
                        <div style={{ color: '#dc2626', fontSize: '0.7rem', opacity: 0.8, fontWeight: 'bold', textShadow: '1px 1px 0px rgba(255,255,255,0.9)' }}>
                            t={t_peak1.toFixed(2)}s
                        </div>
                    </div>
                )}

                {results2 && peak2Revealed && (
                    <div style={{
                        position: 'absolute',
                        left: `${getX(t_peak2)}%`,
                        top: `${getY(results2.h)}%`,
                        transform: 'translate(-50%, -150%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        animation: 'fadeIn 0.3s ease-in-out'
                    }}>
                        <div style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '0.75rem', textShadow: '1px 1px 0px rgba(255,255,255,0.9)' }}>
                            {results2.h.toFixed(2)}m
                        </div>
                        <div style={{ color: '#dc2626', fontSize: '0.7rem', opacity: 0.8, fontWeight: 'bold', textShadow: '1px 1px 0px rgba(255,255,255,0.9)' }}>
                            {t_peak2 > t_peak1 ? 'final' : 'peak2'}
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translate(-50%, -10px) scale(0.8); }
                    to { opacity: 1; transform: translate(-50%, -150%) scale(1); }
                }
            `}</style>
        </div>
    );
};

export default TimeHeightChart;
