import React, { useState, useRef, useEffect } from 'react';
import InputPanel from './InputPanel';
import StickmanSimulation from './StickmanSimulation';
import ResultsPanel from './ResultsPanel';
import StepByStepSolution from './StepByStepSolution';
import TimeHeightChart from './TimeHeightChart';
import { calculatePhysicsResult } from '../utils/physicsSolver';

const SimulatorSection = () => {
    const [inputs, setInputs] = useState({ height: '', mass: '', time: '' });
    const [inputs2, setInputs2] = useState({ height: '', mass: '', time: '' });
    const [simCount, setSimCount] = useState(1);
    const [results, setResults] = useState(null);
    const [results2, setResults2] = useState(null);
    const [avgVelocity, setAvgVelocity] = useState(null);
    const [error, setError] = useState('');
    const [error2, setError2] = useState('');

    // Simulator state machine: 'idle' | 'crouch1' | 'jumping1' | 'landed1' | 'crouch2' | 'jumping2' | 'landed2'
    const [simState, setSimState] = useState('idle');

    // Use a ref to store timeout so we can clear it if needed
    const simTimeoutRef = useRef(null);

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

    const handleInputChange2 = (e) => {
        const { name, value } = e.target;
        setInputs2(prev => ({ ...prev, [name]: value }));
        setError2('');
    };

    const handleSimulate = () => {
        if (simState !== 'idle' && simState !== 'landed') return;

        // Validate first simulation - need at least two parameters or Height/Time
        const h = parseFloat(inputs.height);
        const t = parseFloat(inputs.time);
        if ((!h || isNaN(h)) && (!t || isNaN(t))) {
            setError('Please enter at least Target Height or Total Airtime.');
            return;
        }

        if (inputs.mass) {
            const m = parseFloat(inputs.mass);
            if (isNaN(m) || m <= 0) {
                setError('Please enter a valid mass greater than 0.');
                return;
            }
        }

        // Validate second simulation if needed
        let calculatedResults2 = null;
        if (simCount === 2) {
            const h2 = parseFloat(inputs2.height);
            const t2 = parseFloat(inputs2.time);
            if ((!h2 || isNaN(h2)) && (!t2 || isNaN(t2))) {
                setError2('Please enter at least Target Height or Total Airtime.');
                return;
            }

            if (inputs2.mass) {
                const m2 = parseFloat(inputs2.mass);
                if (isNaN(m2) || m2 <= 0) {
                    setError2('Please enter a valid mass greater than 0.');
                    return;
                }
            }
            calculatedResults2 = calculatePhysicsResult(inputs2.height, inputs2.mass, inputs2.time);
        }

        const calculatedResults = calculatePhysicsResult(inputs.height, inputs.mass, inputs.time);
        setResults(calculatedResults);
        setResults2(calculatedResults2);

        if (calculatedResults2) {
            setAvgVelocity((calculatedResults.v + calculatedResults2.v) / 2);
        } else {
            setAvgVelocity(calculatedResults.v);
        }

        // Start Animation Sequence for Jump 1
        setSimState('crouch1');

        clearTimer();

        // Crouch duration scales subtly with mass
        const massVal1 = calculatedResults.usedMass;
        const clampedMass1 = Math.min(Math.max(massVal1, 30), 150);
        const crouchMs1 = 200 + ((clampedMass1 - 30) / (150 - 30)) * 400;

        simTimeoutRef.current = setTimeout(() => {
            setSimState('jumping1');

            simTimeoutRef.current = setTimeout(() => {
                setSimState('landed1');

                simTimeoutRef.current = setTimeout(() => {
                    if (simCount === 2 && calculatedResults2) {
                        // Start Animation Sequence for Jump 2
                        setSimState('crouch2');

                        const massVal2 = calculatedResults2.usedMass;
                        const clampedMass2 = Math.min(Math.max(massVal2, 30), 150);
                        const crouchMs2 = 200 + ((clampedMass2 - 30) / (150 - 30)) * 400;

                        simTimeoutRef.current = setTimeout(() => {
                            setSimState('jumping2');

                            simTimeoutRef.current = setTimeout(() => {
                                setSimState('landed2');

                                simTimeoutRef.current = setTimeout(() => {
                                    setSimState('idle');
                                }, 400);

                            }, calculatedResults2.t_total * 1000 + 100);

                        }, crouchMs2);
                    } else {
                        // End after 1 simulation
                        setSimState('idle');
                    }
                }, 400);

            }, calculatedResults.t_total * 1000 + 100); // small buffer for rAF sync

        }, crouchMs1);
    };

    const handleReset = () => {
        clearTimer();
        setInputs({ height: '', mass: '', time: '' });
        setInputs2({ height: '', mass: '', time: '' });
        setResults(null);
        setResults2(null);
        setAvgVelocity(null);
        setError('');
        setError2('');
        setSimCount(1);
        setSimState('idle');
    };

    return (
        <section id="simulator" className="section bg-white">
            <div className="container">
                <h2 className="section-title">Jump Simulator</h2>
                <p className="section-subtitle">Enter parameters to simulate the vertical jump</p>

                {/* Mode Selection */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        className={`btn ${simCount === 1 ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => { handleReset(); setSimCount(1); }}
                    >
                        1 Simulation
                    </button>
                    <button
                        className={`btn ${simCount === 2 ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => { handleReset(); setSimCount(2); }}
                    >
                        2 Simulations
                    </button>
                </div>

                <div className="simulator-layout">
                    <div>
                        <InputPanel
                            inputs={inputs}
                            inputs2={inputs2}
                            simCount={simCount}
                            handleInputChange={handleInputChange}
                            handleInputChange2={handleInputChange2}
                            handleSimulate={handleSimulate}
                            handleReset={handleReset}
                            isSimulating={['crouch1', 'jumping1', 'crouch2', 'jumping2'].includes(simState)}
                            error={error}
                            error2={error2}
                            results={results}
                            results2={results2}
                            simState={simState}
                        />
                    </div>

                    <div>
                        <StickmanSimulation
                            inputs1={inputs}
                            inputs2={inputs2}
                            results1={results}
                            results2={results2}
                            simState={simState}
                        />
                    </div>
                </div>

                {/* Results Panel */}
                {results && (
                    <ResultsPanel
                        results={results}
                        results2={results2}
                        avgVelocity={avgVelocity}
                    />
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
