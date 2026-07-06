/**
 * Cyber-Tactical Knight Jump Animations
 * Handles 3D-like parabolic curves for moving knights.
 */

export function animateKnightJump(type, startPos, endPos, playerColor, currentTurn, onComplete) {
    const startCell = document.querySelector(`[data-r="${startPos.r}"][data-c="${startPos.c}"]`);
    const endCell = document.querySelector(`[data-r="${endPos.r}"][data-c="${endPos.c}"]`);
    
    if (!startCell || !endCell) return;
    
    // Find the knight symbol (span) inside the destination cell to hide it during flight
    const endSymbol = endCell.querySelector('span');
    if (endSymbol) {
        endSymbol.style.visibility = 'hidden';
    } else {
        // Fallback: hide entire cell if span not found
        endCell.style.visibility = 'hidden';
    }
    
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
    
    // Determine color and glow styles for the floating knight symbol
    const isPlayerWhite = playerColor === 'white';
    const isPlayer = type === 'player';
    const colorClass = isPlayer 
        ? (isPlayerWhite ? 'player' : 'machine') 
        : (isPlayerWhite ? 'machine' : 'player');
    
    const color = (colorClass === 'player') ? '#ffffff' : 'var(--color-primary)';
    const textShadow = (colorClass === 'player')
        ? '0 0 8px rgba(255, 255, 255, 0.8)' 
        : '0 0 8px rgba(221, 183, 255, 0.8)';
    
    // Create the floating symbol clone (just the horse icon, no border/background square)
    const clone = document.createElement('div');
    clone.style.position = 'fixed';
    clone.style.width = `${startRect.width}px`;
    clone.style.height = `${startRect.height}px`;
    clone.style.zIndex = '1000';
    clone.style.pointerEvents = 'none';
    clone.style.margin = '0';
    clone.style.display = 'flex';
    clone.style.alignItems = 'center';
    clone.style.justifyContent = 'center';
    clone.style.fontSize = '24px';
    clone.style.fontFamily = 'inherit';
    clone.style.color = color;
    clone.style.textShadow = textShadow;
    clone.style.background = 'transparent';
    clone.style.border = 'none';
    clone.style.boxShadow = 'none';
    clone.innerHTML = '♘';
    
    document.body.appendChild(clone);
    
    const p0 = { x: startRect.left, y: startRect.top };
    const p2 = { x: endRect.left, y: endRect.top };
    
    // Corner control point for L-shaped path (curved L-shape)
    let p1;
    if (Math.abs(p2.x - p0.x) > Math.abs(p2.y - p0.y)) {
        p1 = { x: p2.x, y: p0.y };
    } else {
        p1 = { x: p0.x, y: p2.y };
    }
    
    const duration = 600; // ms
    const startTime = performance.now();
    const jumpHeight = 75; // Peak height of the hop
    const maxRotation = 25; // max rotation degrees for wobble
    const dir = Math.sign(p2.x - p0.x) || 1;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-in-out progress
        const t = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        // Bezier position
        const term0 = (1 - t) * (1 - t);
        const term1 = 2 * (1 - t) * t;
        const term2 = t * t;
        const x = term0 * p0.x + term1 * p1.x + term2 * p2.x;
        const y = term0 * p0.y + term1 * p1.y + term2 * p2.y;
        
        // Parabolic height offset
        const arc = Math.sin(progress * Math.PI);
        const currentY = y - jumpHeight * arc;
        
        // Scale dynamically (peaks in the middle)
        const scale = 1 + 0.35 * arc;
        
        // Pitch rotation
        const rotation = dir * maxRotation * Math.sin(progress * Math.PI * 2);
        
        clone.style.left = `${x}px`;
        clone.style.top = `${currentY}px`;
        clone.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            clone.remove();
            if (endSymbol) {
                endSymbol.style.visibility = 'visible';
            } else {
                endCell.style.visibility = 'visible';
            }
            if (typeof onComplete === 'function') {
                onComplete();
            }
        }
    }
    
    requestAnimationFrame(update);
}

export function triggerEnergyEffects(type, endPos, value, onComplete) {
    const endCell = document.querySelector(`[data-r="${endPos.r}"][data-c="${endPos.c}"]`);
    if (!endCell) {
        if (typeof onComplete === 'function') onComplete();
        return;
    }

    // 1. Add class to flash cell and knight border neon yellow instantly
    endCell.classList.add('energy-flash-yellow');

    // 2. Hold the bright flash for 80ms, then trigger the 1s smooth fade transition back
    setTimeout(() => {
        endCell.classList.remove('energy-flash-yellow');
        endCell.classList.add('energy-flash-fade');
        
        // 3. Remove the fade class after transition completes
        setTimeout(() => {
            endCell.classList.remove('energy-flash-fade');
        }, 1000);
    }, 80);

    // 4. Add floating number animation flying to the energy stat value in sidebar
    const targetElementId = type === 'player' ? 'player-energy-val' : 'machine-energy-val';
    animateEnergyFly(endCell, targetElementId, value, onComplete);
}

function animateEnergyFly(startCell, targetElementId, value, onComplete) {
    const targetElement = document.getElementById(targetElementId);
    if (!startCell || !targetElement) {
        if (typeof onComplete === 'function') onComplete();
        return;
    }

    const startRect = startCell.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    // Create a floating span for "+value" styled with cyberpunk yellow glow
    const floater = document.createElement('div');
    floater.style.position = 'fixed';
    floater.style.zIndex = '2000';
    floater.style.pointerEvents = 'none';
    floater.style.fontFamily = "'JetBrains Mono', monospace";
    floater.style.fontWeight = '800';
    floater.style.fontSize = '20px';
    floater.style.color = '#ffeb3b';
    floater.style.textShadow = '0 0 8px rgba(255, 235, 59, 0.8)';
    floater.innerHTML = `+${value}`;

    document.body.appendChild(floater);

    // Start coordinates (center of the board cell)
    const p0 = { 
        x: startRect.left + startRect.width / 2, 
        y: startRect.top + startRect.height / 2 
    };
    
    // Target coordinates (destination in the sidebar)
    const p2 = { 
        x: targetRect.left, 
        y: targetRect.top 
    };

    // Control point to arc upwards as it moves to the sidebar
    const p1 = {
        x: p0.x + (p2.x - p0.x) * 0.4,
        y: Math.min(p0.y, p2.y) - 90
    };

    const duration = 800; // ms
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Cubic ease-out
        const t = 1 - Math.pow(1 - progress, 3);

        // Quadratic Bezier calculation
        const term0 = (1 - t) * (1 - t);
        const term1 = 2 * (1 - t) * t;
        const term2 = t * t;
        const x = term0 * p0.x + term1 * p1.x + term2 * p2.x;
        const y = term0 * p0.y + term1 * p1.y + term2 * p2.y;

        // Fade out slightly towards the end
        const opacity = progress > 0.8 ? (1 - progress) / 0.2 : 1;

        floater.style.left = `${x}px`;
        floater.style.top = `${y}px`;
        floater.style.opacity = opacity;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            floater.remove();

            // Fire pop first, then update the text at the peak of the flash
            popStat(targetElement, '#ffeb3b', onComplete);
        }
    }

    requestAnimationFrame(update);
}

/**
 * Triggers visual effects when a knight collects points:
 * 1. Cell and knight borders glow white/silver for 1 second.
 * 2. Floating "+number" flies from the landing cell to the points stat value in the sidebar.
 */
export function triggerPointEffects(type, endPos, value, onComplete) {
    const endCell = document.querySelector(`[data-r="${endPos.r}"][data-c="${endPos.c}"]`);
    if (!endCell) {
        if (typeof onComplete === 'function') onComplete();
        return;
    }

    // 1. Add class to flash cell and knight border white instantly
    endCell.classList.add('points-flash-white');

    // 2. Hold the bright flash for 80ms, then trigger the 1s smooth fade transition back
    setTimeout(() => {
        endCell.classList.remove('points-flash-white');
        endCell.classList.add('points-flash-fade');
        
        // Remove the fade class after transition completes
        setTimeout(() => {
            endCell.classList.remove('points-flash-fade');
        }, 1000);
    }, 80);

    // 3. Add floating number animation flying to the points stat value in sidebar
    const targetElementId = type === 'player' ? 'player-points-val' : 'machine-points-val';
    animatePointsFly(endCell, targetElementId, value, onComplete);
}

function animatePointsFly(startCell, targetElementId, value, onComplete) {
    const targetElement = document.getElementById(targetElementId);
    if (!startCell || !targetElement) {
        if (typeof onComplete === 'function') onComplete();
        return;
    }

    const startRect = startCell.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    // Create a floating span for "+value" styled with cyberpunk white glow
    const floater = document.createElement('div');
    floater.style.position = 'fixed';
    floater.style.zIndex = '2000';
    floater.style.pointerEvents = 'none';
    floater.style.fontFamily = "'JetBrains Mono', monospace";
    floater.style.fontWeight = '800';
    floater.style.fontSize = '20px';
    floater.style.color = '#4ade80';
    floater.style.textShadow = '0 0 8px rgba(74, 222, 128, 0.8)';
    floater.innerHTML = `+${value}`;

    document.body.appendChild(floater);

    // Start coordinates (center of the board cell)
    const p0 = { 
        x: startRect.left + startRect.width / 2, 
        y: startRect.top + startRect.height / 2 
    };
    
    // Target coordinates (destination in the sidebar)
    const p2 = { 
        x: targetRect.left, 
        y: targetRect.top 
    };

    // Control point to arc upwards as it moves to the sidebar
    const p1 = {
        x: p0.x + (p2.x - p0.x) * 0.4,
        y: Math.min(p0.y, p2.y) - 90
    };

    const duration = 800; // ms
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Cubic ease-out
        const t = 1 - Math.pow(1 - progress, 3);

        // Quadratic Bezier calculation
        const term0 = (1 - t) * (1 - t);
        const term1 = 2 * (1 - t) * t;
        const term2 = t * t;
        const x = term0 * p0.x + term1 * p1.x + term2 * p2.x;
        const y = term0 * p0.y + term1 * p1.y + term2 * p2.y;

        // Fade out slightly towards the end
        const opacity = progress > 0.8 ? (1 - progress) / 0.2 : 1;

        floater.style.left = `${x}px`;
        floater.style.top = `${y}px`;
        floater.style.opacity = opacity;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            floater.remove();

            // Fire pop first, then update the text at the peak of the flash
            popStat(targetElement, '#4ade80', onComplete);
        }
    }

    requestAnimationFrame(update);
}

/**
 * Animates a stat element with a color flash and scale-up pop using inline styles,
 * bypassing CSS specificity conflicts from parent selectors.
 * onComplete is called at the peak of the pop so the text update happens
 * while the element is already enlarged and glowing.
 */
function popStat(element, color, onComplete) {
    const glowLarge = `0 0 16px ${color}, 0 0 24px ${color}`;

    // Phase 1: instant flash — bright color, scale up
    element.style.transition = 'none';
    element.style.transform = 'scale(1.35)';
    element.style.color = color;
    element.style.textShadow = glowLarge;

    // Call onComplete now — the element is big + colored so the new number looks great
    if (typeof onComplete === 'function') {
        onComplete();
    }

    // Phase 2: after two frames (let the browser paint the flash), transition back
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            element.style.transition = 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.5s ease-out, text-shadow 0.5s ease-out';
            element.style.transform = 'scale(1)';
            element.style.color = '';
            element.style.textShadow = '';

            // Phase 3: clean up inline styles after transition finishes
            setTimeout(() => {
                element.style.transition = '';
                element.style.transform = '';
                element.style.color = '';
                element.style.textShadow = '';
            }, 550);
        });
    });
}
