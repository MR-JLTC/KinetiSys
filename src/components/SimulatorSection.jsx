import React, { useState, useRef, useEffect } from 'react';
import InputPanel from './InputPanel';
import StickmanSimulation from './StickmanSimulation';
import ResultsPanel from './ResultsPanel';
import StepByStepSolution from './StepByStepSolution';

const SimulatorSection = () => {
    const [inputs, setInputs] = useState({ height: '', mass: '' });
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    // Simulator state machine: 'idle' | 'crouch' | 'jumping' | 'falling' | 'landed'
    const [simState, setSimState] = useState('idle');

    // Use a ref to store timeout so we can clear it if needed
    const simTimeoutRef = useRef(null);

    const calculatePhysics = (h, mStr) => {
        const g = 9.81;

        // v = sqrt(2gh)
        const v = Math.sqrt(2 * g * h);

        // t_up = v/g
        const t_up = v / g;

        // t_total = 2 * t_up
        const t_total = 2 * t_up;

        // Use mass if provided, else default to an average 70kg for display purposes
        // So that we can always show force/energy equations as requested
        const m = (mStr && parseFloat(mStr) > 0) ? parseFloat(mStr) : 70;

        // Weight = m * g
        const w = m * g;

        // Potential Energy = mgh
        const pe = m * g * h;

        // Kinetic Energy at takeoff = 1/2 m v^2
        // Which should equal PE at the peak due to conservation of energy
        const ke = 0.5 * m * (v * v);

        // Momentum = m * v
        const p = m * v;

        // Height vs Time Equation: y(t) = v*t - 0.5*g*t^2
        const eqStr = `y(t) = ${v.toFixed(2)}t - ${(0.5 * g).toFixed(2)}t²`;

        return {
            h,
            v,
            t_up,
            t_total,
            pe,
            ke,
            p,
            w,
            eqStr,
            usedMass: m,
            isDefaultMass: (!mStr || parseFloat(mStr) <= 0)
        };
    };

    const clearTimer = () => {
        if (simTimeoutRef.current) {
            clearTimeout(simTimeoutRef.current);
        }
    };

    useEffect(() => {
        return () => clearTimer(); // Cleanup on unmount
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSimulate = () => {
        if (simState !== 'idle' && simState !== 'landed') return;

        const h = parseFloat(inputs.height);
        if (!h || isNaN(h) || h <= 0) {
            setError('Please enter a valid jump height greater than 0.');
            return;
        }

        if (inputs.mass) {
            const m = parseFloat(inputs.mass);
            if (isNaN(m) || m <= 0) {
                setError('Please enter a valid mass greater than 0.');
                return;
            }
        }

        const calculatedResults = calculatePhysics(h, inputs.mass);
        setResults(calculatedResults);

        // Start Animation Sequence
        setSimState('crouch');

        clearTimer();

        // Crouch duration scales subtly with mass
        const massVal = calculatedResults.usedMass;
        const clampedMass = Math.min(Math.max(massVal, 30), 150);
        const crouchMs = 200 + ((clampedMass - 30) / (150 - 30)) * 400;

        // After crouch, start the physics-based jump animation
        // The StickmanSimulation uses requestAnimationFrame to animate the
        // full parabolic arc (up AND down) during the 'jumping' state.
        simTimeoutRef.current = setTimeout(() => {
            setSimState('jumping');

            // Wait for full airtime (t_total) then land
            simTimeoutRef.current = setTimeout(() => {
                setSimState('landed');

                simTimeoutRef.current = setTimeout(() => {
                    setSimState('idle');
                }, 400);

            }, calculatedResults.t_total * 1000 + 100); // small buffer for rAF sync

        }, crouchMs);
    };

    const handleReset = () => {
        clearTimer();
        setInputs({ height: '', mass: '' });
        setResults(null);
        setError('');
        setSimState('idle');
    };

    return (
        <section id="simulator" className="section bg-white">
            <div className="container">
                <h2 className="section-title">Jump Simulator</h2>
                <p className="section-subtitle">Enter parameters to simulate the vertical jump</p>

                <div className="simulator-layout">
                    <div>
                        <InputPanel
                            inputs={inputs}
                            handleInputChange={handleInputChange}
                            handleSimulate={handleSimulate}
                            handleReset={handleReset}
                            isSimulating={['crouch', 'jumping'].includes(simState)}
                            error={error}
                        />
                    </div>

                    <div>
                        <StickmanSimulation
                            inputs={inputs}
                            results={results}
                            simState={simState}
                        />
                    </div>
                </div>

                {/* Results Panel — full width below the simulator for landscape layout */}
                {results && (
                    <ResultsPanel results={results} inputs={inputs} />
                )}

                {results && (
                    <div style={{ marginTop: '2rem' }}>
                        <StepByStepSolution results={results} inputs={inputs} />
                    </div>
                )}
            </div>
        </section>
    );
};

export default SimulatorSection;
