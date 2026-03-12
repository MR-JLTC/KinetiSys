import React, { useEffect, useState, useRef, useCallback } from 'react';
import TimeHeightChart from './TimeHeightChart';

const StickmanSimulation = ({ inputs1, inputs2, results1, results2, simState }) => {
    const [stickmanX, setStickmanX] = useState(54); // percentage X position (centered in graph)
    const [stickmanY, setStickmanY] = useState(0);  // percentage above ground
    const animFrameRef = useRef(null);
    const startTimeRef = useRef(null);
    const containerRef = useRef(null);
    const stickmanRef = useRef(null);

    // Target heights
    const h1 = results1 ? results1.h : (inputs1 && inputs1.height ? parseFloat(inputs1.height) : 0);
    const h2 = results2 ? results2.h : (inputs2 && inputs2.height ? parseFloat(inputs2.height) : 0);
    const targetHeight1 = Math.max(h1, 0);
    const targetHeight2 = Math.max(h2, 0);

    const overallMaxHeight = Math.max(targetHeight1, targetHeight2);
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
    const GRAPH_LEFT = 12;
    const GRAPH_RIGHT = 97;
    const GRAPH_TOP = 8;
    const GRAPH_BOTTOM = 78;

    const getX = useCallback((t) => GRAPH_LEFT + (t / maxTime) * (GRAPH_RIGHT - GRAPH_LEFT), [maxTime]);
    const getY = useCallback((h) => GRAPH_BOTTOM - (h / scaleMax) * (GRAPH_BOTTOM - GRAPH_TOP), [scaleMax]);

    const t_peak1 = t_jump1_start + (results1 ? results1.t_up : 0);
    const t_peak2 = t_jump2_start + (results2 ? results2.t_up : 0);

    const isSim2Active = simState.includes('2');
    const graphHeightPercent = GRAPH_BOTTOM - GRAPH_TOP; // 70%

    const g = 9.81;
    const mass = isSim2Active ? m2 : m1;
    const crouchDuration = isSim2Active ? crouch2 : crouch1;

    // --- CENTER X positions for each jump zone (stickman stays in place at the center of each parabola) ---
    const jump1CenterX = getX((t_jump1_start + t_jump1_end) / 2);
    const jump2CenterX = results2 ? getX((t_jump2_start + t_jump2_end) / 2) : jump1CenterX;
    const defaultCenterX = (GRAPH_LEFT + GRAPH_RIGHT) / 2;

    // Generate evenly spaced vertical markers (Height) – always show 0.5m steps
    const markerStep = 0.5;
    let markers = [];
    for (let val = 0; val <= scaleMax + 0.01; val += markerStep) {
        markers.push({ label: `${val.toFixed(1)}m`, val });
    }
    // Always add the exact target height(s) as highlighted markers if not already present
    [targetHeight1, targetHeight2].forEach(th => {
        if (th > 0 && !markers.some(m => Math.abs(m.val - th) < 0.01)) {
            markers.push({ label: `${th.toFixed(2)}m`, val: th, isTarget: true });
        }
    });
    // Collision detection: remove standard markers that are too close to explicit target markers (e.g. within 0.15m)
    const targetMarkers = markers.filter(m => m.isTarget);
    if (targetMarkers.length > 0) {
        markers = markers.filter(m => m.isTarget || !targetMarkers.some(tm => Math.abs(m.val - tm.val) < 0.15));
    }
    markers.sort((a, b) => a.val - b.val);

    // Generate evenly spaced horizontal markers (Time)
    const timeMarkerCount = Math.min(Math.ceil(maxTime / 0.5) + 1, 12);
    const timeMarkerStep = maxTime / (timeMarkerCount - 1);
    let timeMarkers = [];
    for (let i = 0; i < timeMarkerCount; i++) {
        const val = parseFloat((i * timeMarkerStep).toFixed(2));
        timeMarkers.push({ label: `${val.toFixed(1)}s`, val });
    }
    
    // Always add the exact peak times as highlighted markers if not already present
    [t_peak1, t_peak2].forEach((pt, idx) => {
        const h = idx === 0 ? targetHeight1 : targetHeight2;
        if (h > 0 && !timeMarkers.some(m => Math.abs(m.val - pt) < 0.01)) {
            timeMarkers.push({ label: `${pt.toFixed(2)}s`, val: pt, isTarget: true });
        }
    });
    // Collision detection: remove standard time markers that are too close to exact peak times (e.g. within 0.15s)
    const exactTimeMarkers = timeMarkers.filter(m => m.isTarget);
    if (exactTimeMarkers.length > 0) {
        timeMarkers = timeMarkers.filter(m => m.isTarget || !exactTimeMarkers.some(tm => Math.abs(m.val - tm.val) < 0.15));
    }
    timeMarkers.sort((a, b) => a.val - b.val);

    // --- Calculate precise head offset: distance from container bottom to head top ---
    // SVG viewBox 0-120 rendered at 84px, head circle cy=20 r=15 (standing) -> top at y=5
    // Shadow 6px with marginTop -3px -> 3px effective below SVG
    // In 100px container with flex-end: SVG top = 100 - 84 - 3 = 13px from top
    // Head top = 13 + (5/120)*84 = 13 + 3.5 = 16.5px from top = 83.5px from bottom
    const getHeadOffsetPercent = useCallback(() => {
        if (!containerRef.current) return 0;
        const areaH = containerRef.current.offsetHeight;
        // 83.5px = distance from stickman container bottom edge to the top of the head
        return (83.5 / areaH) * 100;
    }, []);

    // --- Animation: stickman stays at fixed X center, Y follows parabola with HEAD reaching target height ---
    const animateJump = useCallback((jumpTargetHeight, jumpV0, jumpTTotal) => {
        if (!jumpTargetHeight || jumpTargetHeight <= 0) return;

        // Full travel distance (graph %) if feet were to reach the target line
        const fullTravel = (jumpTargetHeight / scaleMax) * graphHeightPercent;
        // Subtract the precise head-to-bottom offset so the HEAD reaches the target, not the feet
        const headOffset = getHeadOffsetPercent();
        const headTravel = Math.max(0, fullTravel - headOffset);

        const totalDurationMs = jumpTTotal * 1000;

        const step = (timestamp) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const elapsed = timestamp - startTimeRef.current;
            const t = Math.min(elapsed / 1000, jumpTTotal);

            // Parabolic arc: y = v0*t - 0.5*g*t²
            const y = jumpV0 * t - 0.5 * g * t * t;
            // Normalize so at peak (y = jumpTargetHeight) the offset equals headTravel
            const normalizedY = (y / jumpTargetHeight) * headTravel;
            setStickmanY(Math.max(0, normalizedY));

            if (elapsed < totalDurationMs) {
                animFrameRef.current = requestAnimationFrame(step);
            } else {
                setStickmanY(0);
                startTimeRef.current = null;
            }
        };
        startTimeRef.current = null;
        animFrameRef.current = requestAnimationFrame(step);
    }, [scaleMax, graphHeightPercent, getHeadOffsetPercent, g]);

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
            // When idle with no results, center in graph; otherwise stay at jump 1 center
            setStickmanX(results1 ? jump1CenterX : defaultCenterX);
        } else if (simState === 'crouch1') {
            cancelAnimation();
            setStickmanY(0);
            setStickmanX(jump1CenterX);
        } else if (simState === 'jumping1') {
            const v1 = results1 ? results1.v : Math.sqrt(2 * g * (targetHeight1 || 0.5));
            setStickmanX(jump1CenterX);
            animateJump(targetHeight1, v1, t_total1);
        } else if (simState === 'landed1') {
            cancelAnimation();
            setStickmanY(0);
            setStickmanX(jump1CenterX);
        } else if (simState === 'crouch2') {
            cancelAnimation();
            setStickmanY(0);
            // Move to the center of the second jump zone (visible gap in between)
            setStickmanX(jump2CenterX);
        } else if (simState === 'jumping2') {
            const v2 = results2 ? results2.v : Math.sqrt(2 * g * (targetHeight2 || 0.5));
            setStickmanX(jump2CenterX);
            animateJump(targetHeight2, v2, t_total2);
        } else if (simState === 'landed2') {
            cancelAnimation();
            setStickmanY(0);
            setStickmanX(jump2CenterX);
        }
        return () => cancelAnimation();
    }, [simState, animateJump, cancelAnimation,
        jump1CenterX, jump2CenterX, defaultCenterX,
        t_total1, t_total2, targetHeight1, targetHeight2, results1, results2, g]);

    // Stickman pose
    const isCrouching = simState.startsWith('crouch');
    const isInAir = simState.startsWith('jumping');

    const headY = isCrouching ? 40 : 20;
    const bodyY1 = isCrouching ? 60 : 40;
    const bodyY2 = isCrouching ? 90 : 80;
    const armY = isCrouching ? 90 : 60;
    const legBendY = isCrouching ? 110 : 100;
    const footY = 120;

    // The stickman's feet rest at the X-axis (GRAPH_BOTTOM from top = (100-GRAPH_BOTTOM) from bottom)
    const groundBottomPercent = 100 - GRAPH_BOTTOM; // 22%

    return (
        <div className="simulation-area" ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Modern professional background */}
            <div className="sky-bg"></div>
            <div className="ground-line"></div>

            {/* The Master Static Background Container for the chart */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5 }}>

                {/* Dynamic vertical height scale markers along Y-axis - rendered OUTSIDE the graph */}
                <div className="height-scale" style={{
                    top: `${GRAPH_TOP}%`,
                    height: `${GRAPH_BOTTOM - GRAPH_TOP}%`,
                    bottom: 'auto',
                    /* Position it to the left of the graph start */
                    left: `2%`,
                    width: `${GRAPH_LEFT - 3}%`,
                    borderRight: '2px solid rgba(51, 65, 85, 0.5)',
                    transform: 'none'
                }}>
                    {markers.map((m) => {
                        const percentPos = (m.val / scaleMax) * 100;
                        const isTarget = m.isTarget;
                        return (
                            <div key={`${m.val}-${m.label}`} className="scale-mark" style={{
                                bottom: `${percentPos}%`,
                                right: '0px',
                                width: '10px', // small tick mark
                                borderBottom: isTarget ? '2px solid #dc2626' : '2px solid var(--accent-color)'
                            }}>
                                <span className="scale-label" style={{
                                    right: '15px', // move label text further left
                                    color: isTarget ? '#dc2626' : undefined,
                                    fontWeight: isTarget ? 800 : undefined,
                                    fontSize: isTarget ? '0.8rem' : undefined,
                                    background: isTarget ? 'rgba(220, 38, 38, 0.1)' : undefined,
                                    border: isTarget ? '1px solid rgba(220, 38, 38, 0.3)' : undefined
                                }}>{m.label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Dynamic horizontal time scale markers */}
                <div className="time-scale" style={{ bottom: `${100 - GRAPH_BOTTOM - 5}%`, width: '100%', position: 'absolute' }}>
                    {timeMarkers.map((m) => {
                        const percentPos = getX(m.val);
                        const isTarget = m.isTarget;
                        return (
                            <div key={`${m.val}-${m.label}`} className="time-scale-mark" style={{
                                left: `${percentPos}%`,
                                borderLeft: isTarget ? '2px solid #dc2626' : undefined,
                                zIndex: isTarget ? 10 : 1
                            }}>
                                <span className="time-scale-label" style={{
                                    color: isTarget ? '#dc2626' : undefined,
                                    fontWeight: isTarget ? 800 : undefined,
                                    fontSize: isTarget ? '0.8rem' : undefined,
                                    background: isTarget ? 'rgba(220, 38, 38, 0.1)' : undefined,
                                    border: isTarget ? '1px solid rgba(220, 38, 38, 0.3)' : undefined
                                }}>{m.label}</span>
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

            {/* Stickman – positioned at the CENTER of the jump zone, jumps in place */}
            <div
                ref={stickmanRef}
                className="stickman-container"
                style={{
                    bottom: `calc(${groundBottomPercent}% + ${stickmanY}%)`,
                    left: `${stickmanX}%`,
                    transform: 'translateX(-50%)',
                    transition: isCrouching
                        ? `bottom ${crouchDuration}s ease-in-out, left 0.3s ease-in-out`
                        : (simState === 'crouch2' || simState === 'landed1' ? 'left 0.4s ease-in-out' : 'none'),
                    width: '70px',
                    height: '100px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    zIndex: 20
                }}
            >
                <svg width="56" height="84" viewBox="0 0 80 120" overflow="visible" style={{ zIndex: 2, position: 'relative' }}>
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
                    width: '30px',
                    height: '6px',
                    backgroundColor: 'rgba(0,0,0,0.15)',
                    borderRadius: '50%',
                    marginTop: '-3px',
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
