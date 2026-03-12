import React, { useEffect, useState, useRef, useCallback } from 'react';
import TimeHeightChart from './TimeHeightChart';

const StickmanSimulation = ({ inputs1, inputs2, results1, results2, simState }) => {
    const [stickmanY, setStickmanY] = useState(0); // percentage above ground
    const animFrameRef = useRef(null);
    const startTimeRef = useRef(null);
    const containerRef = useRef(null);

    // Target heights
    const h1 = results1 ? results1.h : (inputs1 && inputs1.height ? parseFloat(inputs1.height) : 0);
    const h2 = results2 ? results2.h : (inputs2 && inputs2.height ? parseFloat(inputs2.height) : 0);
    const targetHeight1 = Math.max(h1, 0);
    const targetHeight2 = Math.max(h2, 0);

    const overallMaxHeight = Math.max(targetHeight1, targetHeight2);
    // scaleMax should be slightly higher than peak for headroom, using nice increments
    const scaleMax = overallMaxHeight > 0
        ? Math.ceil(overallMaxHeight / 0.5) * 0.5 + 0.5
        : 1.0;

    // Calculate precise timeline durations based on SimulatorSection logic
    const rawMass1 = inputs1 && inputs1.mass ? parseFloat(inputs1.mass) : 0;
    const m1 = (isNaN(rawMass1) || rawMass1 <= 0) ? 0 : rawMass1;
    const crouch1 = 0.2 + ((Math.min(Math.max(m1, 30), 150) - 30) / 120) * 0.4;

    const rawMass2 = inputs2 && inputs2.mass ? parseFloat(inputs2.mass) : 0;
    const m2 = (isNaN(rawMass2) || rawMass2 <= 0) ? 0 : rawMass2;
    const crouch2 = 0.2 + ((Math.min(Math.max(m2, 30), 150) - 30) / 120) * 0.4;

    const t_total1 = results1 ? results1.t_total : 0;
    const t_total2 = results2 ? results2.t_total : 0;

    const t_jump1_start = crouch1;
    const t_jump1_end = t_jump1_start + t_total1;
    const t_landed1_start = t_jump1_end + 0.1;
    const t_crouch2_start = t_landed1_start + 0.4;
    const t_jump2_start = t_crouch2_start + crouch2;
    const t_jump2_end = t_jump2_start + t_total2;
    const t_landed2_start = t_jump2_end + 0.1;

    const maxTime = results2 ? (t_landed2_start + 0.4) : (t_landed1_start + 0.4);

    // --- FULL PANEL GRAPH LAYOUT ---
    // Graph area within the panel (percentage based)
    // Left margin for Y-axis labels, bottom margin for X-axis labels & ground
    const GRAPH_LEFT = 12;   // % from left edge  (room for Y labels)
    const GRAPH_RIGHT = 97;  // % from left edge
    const GRAPH_TOP = 8;     // % from top
    const GRAPH_BOTTOM = 78; // % from top (leaves room for labels above ground)

    const getX = useCallback((t) => GRAPH_LEFT + (t / maxTime) * (GRAPH_RIGHT - GRAPH_LEFT), [maxTime]);
    const getY = useCallback((h) => GRAPH_BOTTOM - (h / scaleMax) * (GRAPH_BOTTOM - GRAPH_TOP), [scaleMax]);

    const t_peak1 = t_jump1_start + (results1 ? results1.t_up : 0);
    const t_peak2 = t_jump2_start + (results2 ? results2.t_up : 0);

    const isSim2Active = simState.includes('2');
    const activeTargetHeight = isSim2Active ? targetHeight2 : targetHeight1;
    const activeResults = isSim2Active ? results2 : results1;

    // The height range in % that the graph area covers (from ground to top)
    const graphHeightPercent = GRAPH_BOTTOM - GRAPH_TOP; // 77%

    // The stickman should travel: (targetHeight / scaleMax) * graphHeightPercent
    // This way at peak, the stickman's feet are exactly at the correct Y-axis height
    const stickmanTravelPercent = activeTargetHeight > 0 ? (activeTargetHeight / scaleMax) * graphHeightPercent : 0;

    const g = 9.81;
    const v0 = activeResults ? activeResults.v : Math.sqrt(2 * g * (activeTargetHeight || 0.5));
    const t_total = activeResults ? activeResults.t_total : (2 * v0) / g;

    const mass = isSim2Active ? m2 : m1;
    const crouchDuration = isSim2Active ? crouch2 : crouch1;

    // Generate evenly spaced vertical markers (Height) using 0.5m or 1.0m steps
    const markerStep = scaleMax > 2 ? 1.0 : 0.5;
    const markers = [];
    for (let val = 0; val <= scaleMax; val += markerStep) {
        markers.push({ label: `${val.toFixed(1)}m`, val });
    }

    // Generate evenly spaced horizontal markers (Time)
    const timeMarkerCount = Math.min(Math.ceil(maxTime / 0.5) + 1, 12);
    const timeMarkerStep = maxTime / (timeMarkerCount - 1);
    const timeMarkers = [];
    for (let i = 0; i < timeMarkerCount; i++) {
        const val = parseFloat((i * timeMarkerStep).toFixed(2));
        timeMarkers.push({ label: `${val.toFixed(1)}s`, val });
    }

    const animateJump = useCallback(() => {
        if (!activeResults || activeTargetHeight <= 0) return;
        const totalDurationMs = t_total * 1000;
        const step = (timestamp) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const elapsed = timestamp - startTimeRef.current;
            const t = Math.min(elapsed / 1000, t_total);
            const y = v0 * t - 0.5 * g * t * t;
            // Normalize: at peak, y = activeTargetHeight, so (y / activeTargetHeight) = 1
            // Then multiply by stickmanTravelPercent to get the exact CSS % offset
            const normalizedY = (y / activeTargetHeight) * stickmanTravelPercent;
            setStickmanY(normalizedY);

            if (elapsed < totalDurationMs) {
                animFrameRef.current = requestAnimationFrame(step);
            } else {
                setStickmanY(0);
                startTimeRef.current = null;
            }
        };
        startTimeRef.current = null;
        animFrameRef.current = requestAnimationFrame(step);
    }, [activeResults, activeTargetHeight, v0, g, t_total, stickmanTravelPercent]);

    const cancelAnimation = useCallback(() => {
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
        }
        startTimeRef.current = null;
    }, []);

    useEffect(() => {
        if (simState === 'idle') {
            cancelAnimation();
            setStickmanY(0);
        } else if (simState === 'landed1' || simState === 'landed2') {
            cancelAnimation();
            setStickmanY(0);
        } else if (simState.startsWith('jumping')) {
            animateJump();
        }
        return () => cancelAnimation();
    }, [simState, animateJump, cancelAnimation]);

    // Stickman pose
    const isCrouching = simState.startsWith('crouch');
    const isInAir = simState.startsWith('jumping');

    const headY = isCrouching ? 40 : 20;
    const bodyY1 = isCrouching ? 60 : 40;
    const bodyY2 = isCrouching ? 90 : 80;
    const armY = isCrouching ? 90 : 60;
    const legBendY = isCrouching ? 110 : 100;
    const footY = 120;

    // The stickman's feet should rest at the X-axis (GRAPH_BOTTOM from top = (100-GRAPH_BOTTOM) from bottom)
    const groundBottomPercent = 100 - GRAPH_BOTTOM; // 22%

    return (
        <div className="simulation-area" ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Modern professional background */}
            <div className="sky-bg"></div>
            <div className="ground-line"></div>

            {/* The Master Static Background Container for the chart */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5 }}>

                {/* Dynamic vertical height scale markers along Y-axis */}
                <div className="height-scale" style={{
                    top: `${GRAPH_TOP}%`,
                    height: `${GRAPH_BOTTOM - GRAPH_TOP}%`,
                    bottom: 'auto',
                    left: `${GRAPH_LEFT}%`,
                    borderRight: 'none',
                    transform: 'translateX(-8px)'
                }}>
                    {markers.map((m) => {
                        const percentPos = (m.val / scaleMax) * 100;
                        return (
                            <div key={m.label} className="scale-mark" style={{ bottom: `${percentPos}%`, right: '-10px' }}>
                                <span className="scale-label" style={{ right: '5px' }}>{m.label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Dynamic horizontal time scale markers */}
                <div className="time-scale" style={{ bottom: `${100 - GRAPH_BOTTOM - 5}%`, width: '100%', position: 'absolute' }}>
                    {timeMarkers.map((m) => {
                        const percentPos = getX(m.val);
                        return (
                            <div key={m.label} className="time-scale-mark" style={{ left: `${percentPos}%` }}>
                                <span className="time-scale-label">{m.label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* The TimeHeightChart parabola graph */}
                <TimeHeightChart
                    results1={results1}
                    results2={results2}
                    simState={simState}
                    scaleMax={scaleMax}
                    getX={getX}
                    getY={getY}
                    t_peak1={t_peak1}
                    t_peak2={t_peak2}
                    t_jump1_start={t_jump1_start}
                    t_jump1_end={t_jump1_end}
                    t_crouch2_start={t_crouch2_start}
                    t_jump2_start={t_jump2_start}
                    maxTime={maxTime}
                />
            </div>

            {/* Mass Badge */}
            {(results1 || results2) && (
                <div style={{
                    position: 'absolute',
                    top: '3%',
                    right: '3%',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#e2e8f0',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    zIndex: 30,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    Body Mass: {mass} kg
                </div>
            )}

            {/* Stickman */}
            <div
                className="stickman-container"
                style={{
                    bottom: `calc(${groundBottomPercent}% + ${stickmanY}%)`,
                    left: `${GRAPH_LEFT}%`,
                    transition: isCrouching ? `bottom ${crouchDuration}s ease-in-out` : 'none',
                    width: '100px',
                    height: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    zIndex: 20
                }}
            >
                <svg width="80" height="120" viewBox="0 0 80 120" overflow="visible" style={{ zIndex: 2, position: 'relative' }}>
                    <g stroke="var(--primary-color)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        <circle cx="40" cy={headY} r="15" fill="var(--primary-color)" />
                        <line x1="40" y1={bodyY1} x2="40" y2={bodyY2} />
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
                        {isCrouching ? (
                            <>
                                <path d={`M 40 ${bodyY2} L 55 ${legBendY} L 45 ${footY}`} />
                                <path d={`M 40 ${bodyY2} L 25 ${legBendY} L 35 ${footY}`} />
                            </>
                        ) : (
                            <>
                                <line x1="40" y1={bodyY2} x2="50" y2={footY} />
                                <line x1="40" y1={bodyY2} x2="30" y2={footY} />
                            </>
                        )}
                    </g>
                </svg>

                {/* Simulated ground shadow */}
                <div style={{
                    width: '40px',
                    height: '8px',
                    backgroundColor: 'rgba(0,0,0,0.15)',
                    borderRadius: '50%',
                    marginTop: '-4px',
                    filter: 'blur(2px)',
                    transform: `scale(${Math.max(0.2, 1 - (stickmanY / 100))})`,
                    transition: 'transform 0.1s linear',
                    zIndex: 1,
                    position: 'relative'
                }}></div>
            </div>
        </div>
    );
};

export default StickmanSimulation;
