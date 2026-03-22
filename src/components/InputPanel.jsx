import React, { useMemo } from 'react';
import './InputPanel.css';
import { calculatePhysicsResult } from '../utils/physicsSolver';

const InputPanel = ({ inputs, inputs2, simCount, handleInputChange, handleInputChange2, handleSimulate, handleReset, isSimulating, error, error2, results, results2, simState }) => {

    const isSim2Active = simState?.includes('2');

    // Real-time interpretations for each sim
    const liveInterpreted1 = useMemo(() => {
        const res = calculatePhysicsResult(inputs.height, inputs.mass, inputs.time);
        return res.interpreted;
    }, [inputs]);

    const liveInterpreted2 = useMemo(() => {
        if (simCount < 2) return null;
        const res = calculatePhysicsResult(inputs2.height, inputs2.mass, inputs2.time);
        return res.interpreted;
    }, [inputs2, simCount]);

    const interpreted1 = results?.interpreted || liveInterpreted1;
    const interpreted2 = results2?.interpreted || liveInterpreted2;
    const interpreted = simCount === 1 ? interpreted1 : (isSim2Active ? interpreted2 : interpreted1);

    const RulerIcon = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.3 15.3l-3.4-3.4c-.7-.7-1.9-.7-2.6 0l-3.4 3.4c-.7.7-.7 1.9 0 2.6l3.4 3.4c.7.7 1.9.7 2.6 0l3.4-3.4c.7-.7.7-1.9 0-2.6z" />
            <path d="m3.5 11 3.5 3.5h0" /><path d="m5 12.5 1.5 1.5" /><path d="m8.2 6.3 3.5 3.5" /><path d="m9.8 7.8 1.5 1.5" /><path d="M12.9 1.4l3.5 3.5" /><path d="m14.5 2.9 1.5 1.5" />
        </svg>
    );

    const WeightIcon = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="3" /><path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.9-2.5l-2.495-9.04A2 2 0 0 0 17.5 8Z" />
        </svg>
    );

    const ClockIcon = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
    );

    const LightbulbIcon = () => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" /><path d="M10 22h4" />
        </svg>
    );

    const PlayIcon = () => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
    );

    const ResetIcon = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
        </svg>
    );

    const renderInputGroup = (id, name, label, icon, value, onChange, placeholder = "0", disabled = false, errorMsg = null) => (
        <div className="input-row">
            <label className="input-label" htmlFor={id}>
                {icon} {label}
            </label>
            <input
                id={id} name={name} type="number" step="0.01" min="0.01"
                placeholder={placeholder}
                className="input-field compact-input"
                value={value} onChange={onChange} disabled={disabled}
            />
            {errorMsg && <div className="input-error-inline">{errorMsg}</div>}
        </div>
    );

    const renderInterpretedInline = (interpData) => {
        if (!interpData) return null;
        return (
            <div className="interpreted-inline">
                <LightbulbIcon />
                <span className="interpreted-badge-sm">AUTO</span>
                <span className="interpreted-label">{interpData.name}:</span>
                <span className="interpreted-val">{interpData.value}</span>
            </div>
        );
    };

    // Dynamically show scrollbar only when needed to strictly match user request
    const showScrollbar = simCount === 2 && (interpreted1 || interpreted2 || error || error2);

    return (
        <div className={`card input-panel-card ${showScrollbar ? 'show-scroll' : 'hide-scroll'}`}>
            <div className="design-blob"></div>

            <div className="panel-header">
                <h3 className="panel-title">Parameters</h3>
                {simCount === 2 && <span className="sim-count-badge">2 Jumps</span>}
            </div>

            <div className="sims-container">
                {/* Simulation 1 */}
                <div className="sim-block sim-1">
                    <div className="sim-header">
                        <div className="sim-num sim-num-1">1</div>
                        <span className="sim-label">{simCount === 1 ? 'Jump Settings' : 'Jump 1'}</span>
                    </div>
                    <div className="sim-inputs">
                        {renderInputGroup('height', 'height', 'H (m)', <RulerIcon />, inputs.height, handleInputChange, '0', isSimulating, error)}
                        {renderInputGroup('mass', 'mass', 'M (kg)', <WeightIcon />, inputs.mass, handleInputChange, '0', isSimulating)}
                        {renderInputGroup('time', 'time', 'T (s)', <ClockIcon />, inputs.time, handleInputChange, '0', isSimulating)}
                    </div>
                    {renderInterpretedInline(interpreted1)}
                </div>

                {/* Simulation 2 */}
                {simCount === 2 && (
                    <div className="sim-block sim-2">
                        <div className="sim-header">
                            <div className="sim-num sim-num-2">2</div>
                            <span className="sim-label">Jump 2</span>
                        </div>
                        <div className="sim-inputs">
                            {renderInputGroup('height2', 'height', 'H (m)', <RulerIcon />, inputs2.height, handleInputChange2, '0', isSimulating, error2)}
                            {renderInputGroup('mass2', 'mass', 'M (kg)', <WeightIcon />, inputs2.mass, handleInputChange2, '0', isSimulating)}
                            {renderInputGroup('time2', 'time', 'T (s)', <ClockIcon />, inputs2.time, handleInputChange2, '0', isSimulating)}
                        </div>
                        {renderInterpretedInline(interpreted2)}
                    </div>
                )}
            </div>

            {/* Single-sim interpretation */}
            {/* {simCount === 1 && interpreted && (
                <div className="tip-box interpretation-active">
                    <div className="tip-icon-container"><LightbulbIcon /></div>
                    <div className="tip-content">
                        <div className="interpretation-layout">
                            <span className="interpretation-badge">Auto-filled</span>
                            <p className="tip-text interpretation-text">
                                {interpreted.name}: <span className="interpretation-value">{interpreted.value}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )} */}

            {simCount === 1 && !interpreted && (
                <div className="tip-box">
                    <div className="tip-icon-container"><LightbulbIcon /></div>
                    <div className="tip-content">
                        <p className="tip-text"><strong>Tip:</strong> Any two values solve for the 3rd.</p>
                    </div>
                </div>
            )}

            <div className="btn-container">
                <button className="btn btn-primary btn-simulate" onClick={handleSimulate} disabled={isSimulating}>
                    {isSimulating ? 'Simulating...' : <><PlayIcon /> Simulate</>}
                </button>
                <button className="btn btn-secondary btn-reset" onClick={handleReset} disabled={isSimulating}>
                    <ResetIcon /> Reset
                </button>
            </div>
        </div>
    );
};

export default InputPanel;
