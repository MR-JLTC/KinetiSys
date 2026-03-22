export const calculatePhysicsResult = (hStr, mStr, tStr) => {
    const g = 9.8; // User-specified gravity
    let h = parseFloat(hStr);
    let m = (mStr && parseFloat(mStr) > 0) ? parseFloat(mStr) : null;
    let t_total = parseFloat(tStr);

    let interpreted = null;

    // Solver Logic - Solve for the missing parameter
    // Priority: If both H and T are given, solve M. Otherwise solve whichever is missing.
    if (!isNaN(h) && h > 0 && !isNaN(t_total) && t_total > 0 && m === null) {
        // Case 3: Height + Airtime provided -> Solve Mass
        // Formula: M = 70 * (T_theoretical / T_actual)
        // Note: We round T_theoretical to 2 decimals to match manual step-by-step examples exactly.
        const t_theoretical_raw = 2 * Math.sqrt((2 * h) / g);
        const t_theoretical = Math.round(t_theoretical_raw * 100) / 100;
        const solvedM = 70 * (t_theoretical / t_total);
        interpreted = { name: 'Mass', value: solvedM.toFixed(1) + ' kg' };
        m = solvedM;
    } else if (!isNaN(h) && h > 0 && (isNaN(t_total) || t_total <= 0)) {
        // Case 1: Height provided, no Airtime -> Solve Airtime
        // Formula: T = 2 * sqrt(2H/g)
        t_total = 2 * Math.sqrt((2 * h) / g);
        interpreted = { name: 'Airtime', value: t_total.toFixed(2) + ' s' };
    } else if (!isNaN(t_total) && t_total > 0 && (isNaN(h) || h <= 0)) {
        // Case 2: Airtime provided, no Height -> Solve Height
        // Formula: H = (g * T²) / 8
        h = (g * Math.pow(t_total, 2)) / 8;
        interpreted = { name: 'Height', value: h.toFixed(2) + ' m' };
    }

    // Default mass if still null
    if (m === null) m = 70;

    // Calculate common physics values (use 0/defaults if h is invalid)
    const validH = (!isNaN(h) && h > 0);
    const v = validH ? Math.sqrt(2 * g * h) : 0;
    const t_up = validH ? v / g : 0;
    const t_total_final = validH ? 2 * t_up : (interpreted?.name === 'Airtime' ? parseFloat(interpreted.value) : 0);
    
    // If we interpreted airtime, T should be used
    const finalT = (interpreted?.name === 'Airtime') ? parseFloat(interpreted.value) : t_total_final;

    const w = m * g;
    const pe = validH ? m * g * h : 0;
    const ke = validH ? 0.5 * m * (v * v) : 0;
    const p = validH ? m * v : 0;
    const eqStr = validH ? `y(t) = ${v.toFixed(2)}t - ${(0.5 * g).toFixed(2)}t²` : "y(t) = 0";

    return {
        h: validH ? h : 0,
        v,
        t_up,
        t_total: finalT,
        pe,
        ke,
        p,
        w,
        eqStr,
        usedMass: m,
        isDefaultMass: (!mStr || parseFloat(mStr) <= 0),
        interpreted
    };
};
