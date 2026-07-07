import { animateKnightJump, triggerEnergyEffects, triggerPointEffects } from '../animations.js';
import { AudioManager } from '../audio.js';

/**
 * Updates only the visible numeric text inside a stat element (e.g. player-energy-val),
 * preserving any child elements like the bolt icon.
 */
function setStatText(elementId, value) {
    const el = document.getElementById(elementId);
    if (!el) return;
    // Replace the first text node only, leaving child spans (icons) intact
    for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = ` ${value} `;
            return;
        }
    }
    // Fallback: prepend a text node if none found
    el.insertBefore(document.createTextNode(` ${value} `), el.firstChild);
}

/**
 * Renders a full-screen game-over overlay with cyberpunk styling.
 * result: 'win' | 'lose' | 'draw'
 */
function showGameOverOverlay(result, state) {
    // Remove any existing overlay
    document.getElementById('game-over-overlay')?.remove();

    if (result === 'win') {
        AudioManager.playSFX('sfx_win');
    } else if (result === 'lose') {
        AudioManager.playSFX('sfx_lose');
    }

    const isWin  = result === 'win';
    const isDraw = result === 'draw';

    const mode = state?.gameMode || 'pvc';
    let p1Label = 'JUGADOR';
    let p2Label = 'MÁQUINA';
    if (mode === 'pvp') {
        p1Label = 'JUGADOR 1';
        p2Label = 'JUGADOR 2';
    } else if (mode === 'cvc') {
        p1Label = 'MÁQUINA 1';
        p2Label = 'MÁQUINA 2';
    }

    let headline = '';
    let subline = '';
    let glowColor = '';
    let borderColor = '';
    let icon = '';

    if (isDraw) {
        headline = 'EMPATE';
        subline = 'EQUILIBRIO TÁCTICO · SIN VENCEDOR';
        glowColor = '#ffeb3b';
        borderColor = 'rgba(255,235,59,0.4)';
        icon = '⚖';
    } else {
        if (mode === 'pvp') {
            headline = isWin ? 'VICTORIA J1' : 'VICTORIA J2';
            subline = isWin ? 'EL JUGADOR 1 HA CONQUISTADO EL TABLERO' : 'EL JUGADOR 2 HA CONQUISTADO EL TABLERO';
            glowColor = isWin ? '#ffffff' : 'var(--color-primary)';
            borderColor = isWin ? 'rgba(255,255,255,0.4)' : 'rgba(221,183,255,0.4)';
            icon = '♚';
        } else if (mode === 'cvc') {
            headline = isWin ? 'GANÓ IA 1' : 'GANÓ IA 2';
            subline = isWin ? 'SIMULACIÓN COMPLETADA · GANADOR MÁQUINA 1' : 'SIMULACIÓN COMPLETADA · GANADOR MÁQUINA 2';
            glowColor = 'var(--color-primary)';
            borderColor = 'rgba(221,183,255,0.4)';
            icon = '⚙';
        } else {
            headline = isWin ? 'GANASTE' : 'PERDISTE';
            subline = isWin ? 'MISIÓN COMPLETADA · OBJETIVO ELIMINADO' : 'SISTEMA COMPROMETIDO · OBJETIVO PERDIDO';
            glowColor = isWin ? '#4ade80' : '#f87171';
            borderColor = isWin ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)';
            icon = isWin ? '♚' : '♟';
        }
    }

    const playerPts  = state?.playerPoints  ?? 0;
    const machinePts = state?.machinePoints ?? 0;
    const playerNrg  = state?.playerEnergy  ?? 0;
    const machineNrg = state?.machineEnergy ?? 0;

    const overlay = document.createElement('div');
    overlay.id = 'game-over-overlay';
    overlay.innerHTML = `
        <div class="go-backdrop"></div>
        <div class="go-panel" style="--go-color:${glowColor}; --go-border:${borderColor};">
            <div class="go-corner go-tl">+</div>
            <div class="go-corner go-tr">+</div>
            <div class="go-corner go-bl">+</div>
            <div class="go-corner go-br">+</div>

            <div class="go-icon" style="color:${glowColor}; text-shadow:0 0 30px ${glowColor};">${icon}</div>
            <div class="go-tag">// PARTIDA_FINALIZADA</div>
            <h1 class="go-headline" style="color:${glowColor}; text-shadow:0 0 40px ${glowColor}, 0 0 80px ${glowColor};">${headline}</h1>
            <p class="go-subline">${subline}</p>

            <div class="go-divider" style="background:${glowColor};"></div>

            <div class="go-stats">
                <div class="go-stat-block">
                    <span class="go-stat-label">${p1Label}</span>
                    <span class="go-stat-value" style="color:${glowColor};">${playerPts} <span style="font-size:14px;opacity:0.6;">pts</span></span>
                    <span class="go-stat-sub">${playerNrg} energía restante</span>
                </div>
                <div class="go-stat-sep">vs</div>
                <div class="go-stat-block">
                    <span class="go-stat-label">${p2Label}</span>
                    <span class="go-stat-value" style="color:var(--color-primary);">${machinePts} <span style="font-size:14px;opacity:0.6;">pts</span></span>
                    <span class="go-stat-sub">${machineNrg} energía restante</span>
                </div>
            </div>

            <div class="go-divider" style="background:${glowColor};"></div>

            <div class="go-actions">
                <button class="go-btn go-btn-primary" id="go-replay-btn" style="--go-color:${glowColor}; border-color:${glowColor}; color:${glowColor};">
                    <span class="material-symbols-outlined" style="font-size:18px;">home</span>
                    MENÚ PRINCIPAL
                </button>
            </div>

            <div class="go-scanline"></div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => {
        overlay.classList.add('go-visible');
    });

    // Replay button → go back to menu
    document.getElementById('go-replay-btn').addEventListener('click', () => {
        overlay.classList.remove('go-visible');
        setTimeout(() => {
            overlay.remove();
            // Navigate to the main menu
            if (window.navigate) window.navigate('/');
            else if (window.navigateTo) window.navigateTo('/');
        }, 400);
    });
}

// Track current active page instance to allow global callbacks from Eel to resolve safely
let activePageInstance = null;

if (window.eel) {
    window.eel.expose(updateGameStateFromBackend, "update_game_state_js");
    window.eel.expose(gameOverFromBackend, "game_over_js");
}

function updateGameStateFromBackend(pythonState, pythonValidMoves) {
    if (activePageInstance) {
        activePageInstance.handleStateUpdate(pythonState, pythonValidMoves);
    }
}

function gameOverFromBackend(winnerColor) {
    if (activePageInstance) {
        activePageInstance.handleGameOver(winnerColor);
    }
}

export default {
    state: null,
    logs: [],

    initGameState() {
        const config = window.gameState || {
            gameMode: 'pvc',
            difficulty: 'normal',
            playerColor: 'black',
            boardSize: 8,
            energies: [2, 3, 4, 5],
            points: [2, 3, 4, 5, 6, 8, 9]
        };

        const size = config.boardSize;
        const mid = Math.floor(size / 2);

        this.state = {
            size: size,
            gameMode: config.gameMode || 'pvc',
            difficulty: config.difficulty,
            playerColor: config.playerColor || 'black',
            p1Pos: { r: mid, c: mid - 1 },     
            p2Pos: { r: mid - 1, c: mid + 1 }, 
            currentTurn: 'player',
            playerPoints: 0,
            playerEnergy: config.startingEnergy || 7,
            machinePoints: 0,
            machineEnergy: config.startingEnergy || 7,
            maxEnergy: 15,
            boardCells: {},
            validMoves: []
        };
        
        this.logs = [
            `[${this.getLogTime()}] PROTOCOLO_INICIADO`,
            `[${this.getLogTime()}] ESCANEANDO_TABLERO_${size}x${size}...`
        ];
    },

    initLocalMockState() {
        const config = window.gameState || {
            gameMode: 'pvc',
            difficulty: 'normal',
            playerColor: 'black',
            boardSize: 8,
            energies: [2, 3, 4, 5],
            points: [2, 3, 4, 5, 6, 8, 9]
        };
        const size = config.boardSize;
        const mid = Math.floor(size / 2);
        
        this.logs = [
            `[${this.getLogTime()}] OFFLINE_MODE: MOCK_STATE_LOADED`,
            `[${this.getLogTime()}] CONEXIÓN BACKEND EEL OFFLINE`
        ];

        this.state = {
            size: size,
            gameMode: config.gameMode || 'pvc',
            playerColor: config.playerColor,
            p1Pos: { r: mid, c: mid - 1 },
            p2Pos: { r: mid - 1, c: mid + 1 },
            currentTurn: 'player',
            playerPoints: 0,
            playerEnergy: config.startingEnergy || 7,
            machinePoints: 0,
            machineEnergy: config.startingEnergy || 7,
            maxEnergy: 15,
            boardCells: {},
            validMoves: []
        };
        
        // Seed mockup cells
        this.state.boardCells[`${mid - 2},${mid}`] = { type: 'point', value: 5 };
        this.state.boardCells[`${mid - 1},${mid - 1}`] = { type: 'energy', value: 4 };
    },

    getLogTime() {
        const now = new Date();
        return now.toTimeString().split(' ')[0];
    },

    handleStateUpdate(pythonState, pythonValidMoves) {
        const playerColor = this.state?.playerColor || pythonState.playerColor || window.gameState?.playerColor || 'black';
        const isPlayerWhite = playerColor === 'white';
        const mode = this.state?.gameMode || window.gameState?.gameMode || 'pvc';
        
        // Pos indices array [r, c] from Python to {r, c}
        const p1Pos = isPlayerWhite 
            ? { r: pythonState.knights.white.position[0], c: pythonState.knights.white.position[1] }
            : { r: pythonState.knights.black.position[0], c: pythonState.knights.black.position[1] };
            
        const p2Pos = isPlayerWhite 
            ? { r: pythonState.knights.black.position[0], c: pythonState.knights.black.position[1] }
            : { r: pythonState.knights.white.position[0], c: pythonState.knights.white.position[1] };

        // Parse point and energy cells
        const boardCells = {};
        for (const [key, val] of Object.entries(pythonState.points)) {
            boardCells[key] = { type: 'point', value: val };
        }
        for (const [key, val] of Object.entries(pythonState.energies)) {
            boardCells[key] = { type: 'energy', value: val };
        }

        // Track movement animations
        let moveAnim = null;

        let p1LogName = 'JUGADOR';
        let p2LogName = 'MÁQUINA';
        if (mode === 'pvp') {
            p1LogName = 'JUGADOR 1';
            p2LogName = 'JUGADOR 2';
        } else if (mode === 'cvc') {
            p1LogName = 'MÁQUINA 1';
            p2LogName = 'MÁQUINA 2';
        }

        // Compile logs dynamically based on movement changes
        if (this.state) {
            const cols = ['A','B','C','D','E','F','G','H','I','J','K','L'];
            
            // Check if player moved
            const prevP1 = this.state.p1Pos;
            if (prevP1 && (prevP1.r !== p1Pos.r || prevP1.c !== p1Pos.c)) {
                const targetLabel = `${cols[p1Pos.c]}${pythonState.n - p1Pos.r}`;
                this.logs.push(`[${this.getLogTime()}] MOVIMIENTO ${p1LogName} A ${targetLabel}`);
                
                // Did player land on resource
                const prevCell = this.state.boardCells[`${p1Pos.r},${p1Pos.c}`];
                let capture = null;
                if (prevCell) {
                    capture = { type: prevCell.type, value: prevCell.value };
                    if (prevCell.type === 'point') this.logs.push(`[${this.getLogTime()}] ${p1LogName} CAPTURÓ +${prevCell.value} PUNTOS`);
                    if (prevCell.type === 'energy') this.logs.push(`[${this.getLogTime()}] ${p1LogName} RECARGÓ +${prevCell.value} ENERGÍA`);
                }

                moveAnim = {
                    type: 'player',
                    start: { r: prevP1.r, c: prevP1.c },
                    end: { r: p1Pos.r, c: p1Pos.c },
                    capture: capture
                };
            }
            
            // Check if machine moved
            const prevP2 = this.state.p2Pos;
            if (prevP2 && (prevP2.r !== p2Pos.r || prevP2.c !== p2Pos.c)) {
                const targetLabel = `${cols[p2Pos.c]}${pythonState.n - p2Pos.r}`;
                this.logs.push(`[${this.getLogTime()}] MOVIMIENTO ${p2LogName} A ${targetLabel}`);
                
                const prevCell = this.state.boardCells[`${p2Pos.r},${p2Pos.c}`];
                let capture = null;
                if (prevCell) {
                    capture = { type: prevCell.type, value: prevCell.value };
                    if (prevCell.type === 'point') this.logs.push(`[${this.getLogTime()}] ${p2LogName} CAPTURÓ +${prevCell.value} PUNTOS`);
                    if (prevCell.type === 'energy') this.logs.push(`[${this.getLogTime()}] ${p2LogName} RECARGÓ +${prevCell.value} ENERGÍA`);
                }

                moveAnim = {
                    type: 'machine',
                    start: { r: prevP2.r, c: prevP2.c },
                    end: { r: p2Pos.r, c: p2Pos.c },
                    capture: capture
                };
            }

            // Check if a turn skip occurred (must skip energy lack)
            const prevTurn = this.state.playerColor; // check color turns
            const playerEnergyDiff = (isPlayerWhite ? pythonState.knights.white.energy : pythonState.knights.black.energy) - this.state.playerEnergy;
            const machineEnergyDiff = (isPlayerWhite ? pythonState.knights.black.energy : pythonState.knights.white.energy) - this.state.machineEnergy;
            
            // Check if skip points loss occurred
            const playerPointsDiff = (isPlayerWhite ? pythonState.knights.white.points : pythonState.knights.black.points) - this.state.playerPoints;
            const machinePointsDiff = (isPlayerWhite ? pythonState.knights.black.points : pythonState.knights.white.points) - this.state.machinePoints;

            if (playerPointsDiff === -3 && playerEnergyDiff === 0) {
                this.logs.push(`[${this.getLogTime()}] ${p1LogName} PERDIÓ TURNO (FALTA DE ENERGÍA): -3 PUNTOS`);
                AudioManager.playSFX('sfx_penalty');
            }
            if (machinePointsDiff === -3 && machineEnergyDiff === 0) {
                this.logs.push(`[${this.getLogTime()}] ${p2LogName} PERDIÓ TURNO (FALTA DE ENERGÍA): -3 PUNTOS`);
                AudioManager.playSFX('sfx_penalty');
            }
        }

        const isPlayerTurn = pythonState.turn === playerColor;

        // Save old stats BEFORE updating state (for delayed display update)
        const prevPlayerEnergy = this.state?.playerEnergy ?? null;
        const prevPlayerPoints = this.state?.playerPoints ?? null;
        const prevMachineEnergy = this.state?.machineEnergy ?? null;
        const prevMachinePoints = this.state?.machinePoints ?? null;

        const newPlayerEnergy = isPlayerWhite ? pythonState.knights.white.energy : pythonState.knights.black.energy;
        const newPlayerPoints = isPlayerWhite ? pythonState.knights.white.points : pythonState.knights.black.points;
        const newMachineEnergy = isPlayerWhite ? pythonState.knights.black.energy : pythonState.knights.white.energy;
        const newMachinePoints = isPlayerWhite ? pythonState.knights.black.points : pythonState.knights.white.points;

        this.state = {
            size: pythonState.n,
            gameMode: mode,
            playerColor: playerColor,
            p1Pos: p1Pos,
            p2Pos: p2Pos,
            currentTurn: isPlayerTurn ? 'player' : 'machine',
            playerPoints: newPlayerPoints,
            playerEnergy: newPlayerEnergy,
            machinePoints: newMachinePoints,
            machineEnergy: newMachineEnergy,
            maxEnergy: 15,
            boardCells: boardCells,
            validMoves: pythonValidMoves || []
        };

        this.refreshUI();

        // If a capture happened, freeze the stat display to old value — it will update after animation
        if (moveAnim && moveAnim.capture) {
            const c = moveAnim.capture;
            if (moveAnim.type === 'player') {
                if (c.type === 'energy' && prevPlayerEnergy !== null) setStatText('player-energy-val', prevPlayerEnergy);
                if (c.type === 'point'  && prevPlayerPoints !== null) setStatText('player-points-val', prevPlayerPoints);
            } else {
                if (c.type === 'energy' && prevMachineEnergy !== null) setStatText('machine-energy-val', prevMachineEnergy);
                if (c.type === 'point'  && prevMachinePoints !== null) setStatText('machine-points-val', prevMachinePoints);
            }
        }

        if (moveAnim) {
            AudioManager.playSFX('sfx_move');
            animateKnightJump(moveAnim.type, moveAnim.start, moveAnim.end, playerColor, this.state.currentTurn, () => {
                if (moveAnim.capture && moveAnim.capture.type === 'energy') {
                    const targetId = moveAnim.type === 'player' ? 'player-energy-val' : 'machine-energy-val';
                    const newVal   = moveAnim.type === 'player' ? newPlayerEnergy : newMachineEnergy;
                    AudioManager.playSFX('sfx_energy');
                    triggerEnergyEffects(moveAnim.type, moveAnim.end, moveAnim.capture.value, () => {
                        setStatText(targetId, newVal);
                    });
                } else if (moveAnim.capture && moveAnim.capture.type === 'point') {
                    const targetId = moveAnim.type === 'player' ? 'player-points-val' : 'machine-points-val';
                    const newVal   = moveAnim.type === 'player' ? newPlayerPoints : newMachinePoints;
                    AudioManager.playSFX('sfx_point');
                    triggerPointEffects(moveAnim.type, moveAnim.end, moveAnim.capture.value, () => {
                        setStatText(targetId, newVal);
                    });
                }
            });
        }
    },

    handleGameOver(winnerColor) {
        const playerColor = this.state?.playerColor || 'black';
        let result = 'draw';
        let msg = '';
        if (!winnerColor) {
            result = 'draw';
            msg = '¡EL JUEGO TERMINÓ EN EMPATE!';
        } else if (winnerColor === playerColor) {
            result = 'win';
            msg = '¡VICTORIA! HAS GANADO LA PARTIDA';
        } else {
            result = 'lose';
            msg = '¡DERROTA! LA MÁQUINA HA GANADO LA PARTIDA';
        }
        
        this.logs.push(`[${this.getLogTime()}] ${msg}`);
        this.refreshUI();
        
        setTimeout(() => {
            showGameOverOverlay(result, this.state);
        }, 400);
    },

    getHTML() {
        const size = this.state.size;

        // Generate columns labels (A, B, C...)
        const allCols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        const cols = allCols.slice(0, size);

        // Generate rows labels (size down to 1)
        const rows = [];
        for (let i = size; i >= 1; i--) {
            rows.push(i);
        }

        // Filter valid moves
        const playerValidMoves = this.state.validMoves || [];

        // Build Board cells HTML
        let cellsHTML = '';
        const isPlayerWhite = this.state.playerColor === 'white';

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const isPlayer = r === this.state.p1Pos.r && c === this.state.p1Pos.c;
                const isMachine = r === this.state.p2Pos.r && c === this.state.p2Pos.c;
                const isValidMove = playerValidMoves.some(m => m[0] === r && m[1] === c);

                if (isPlayer) {
                    const colorClass = isPlayerWhite ? 'player' : 'machine';
                    const activeTurnClass = this.state.currentTurn === 'player' ? 'active-turn' : '';
                    cellsHTML += `
                        <div class="board-cell cell-knight ${colorClass} ${activeTurnClass}" data-r="${r}" data-c="${c}">
                            <span>♘</span>
                        </div>
                    `;
                } else if (isMachine) {
                    const colorClass = isPlayerWhite ? 'machine' : 'player';
                    const activeTurnClass = this.state.currentTurn === 'machine' ? 'active-turn' : '';
                    cellsHTML += `
                        <div class="board-cell cell-knight ${colorClass} ${activeTurnClass}" data-r="${r}" data-c="${c}">
                            <span>♘</span>
                        </div>
                    `;
                } else {
                    const cellData = this.state.boardCells[`${r},${c}`] || { type: 'empty', value: 0 };
                    const validClass = isValidMove ? 'cell-valid-move' : '';

                    if (cellData.type === 'point') {
                        cellsHTML += `
                            <div class="board-cell cell-point ${validClass}" data-r="${r}" data-c="${c}">
                                <span class="material-symbols-outlined pt-icon">star</span>
                                <span class="pt-amount">+${cellData.value}</span>
                            </div>
                        `;
                    } else if (cellData.type === 'energy') {
                        cellsHTML += `
                            <div class="board-cell cell-energy ${validClass}" data-r="${r}" data-c="${c}">
                                <span class="material-symbols-outlined nrg-icon">bolt</span>
                                <span class="nrg-amount">+${cellData.value}</span>
                            </div>
                        `;
                    } else {
                        cellsHTML += `
                            <div class="board-cell cell-empty ${validClass}" data-r="${r}" data-c="${c}">
                                <span class="dot-marker">.</span>
                            </div>
                        `;
                    }
                }
            }
        }

        const mode = this.state.gameMode || 'pvc';

        let p1Name = 'JUGADOR';
        let p1Sub = 'OPERADOR_01';
        let p2Name = 'MÁQUINA';
        let p2Sub = 'CPU_LOGIC [INT]';

        if (mode === 'pvp') {
            p1Name = 'JUGADOR 1';
            p1Sub = 'OPERADOR_01';
            p2Name = 'JUGADOR 2';
            p2Sub = 'OPERADOR_02';
        } else if (mode === 'cvc') {
            p1Name = 'MÁQUINA 1';
            p1Sub = 'CPU_LOGIC_01';
            p2Name = 'MÁQUINA 2';
            p2Sub = 'CPU_LOGIC_02';
        }

        const isActivePlayer = this.state.currentTurn === 'player';
        let turnOperatorLabel = isActivePlayer ? p1Name : p2Name;
        
        let turnActionLabel = '';
        if (mode === 'pvp') {
            turnActionLabel = 'Su turno...';
        } else if (mode === 'cvc') {
            turnActionLabel = 'Pensando movimiento...';
        } else { // pvc
            turnActionLabel = isActivePlayer ? 'Tu turno...' : 'Pensando movimiento...';
        }
        
        let turnAvatarClass = '';
        if (isActivePlayer) {
            turnAvatarClass = isPlayerWhite ? 'glow-text-white' : 'glow-text-purple';
        } else {
            turnAvatarClass = isPlayerWhite ? 'glow-text-purple' : 'glow-text-white';
        }

        const playerAvatarClass = isPlayerWhite ? 'player-avatar' : 'machine-avatar';
        const playerPointsGlowClass = isPlayerWhite ? 'glow-text-white' : 'glow-text-purple';

        const machineAvatarClass = isPlayerWhite ? 'machine-avatar' : 'player-avatar';
        const machinePointsGlowClass = isPlayerWhite ? 'glow-text-purple' : 'glow-text-white';

        const playerPointsStr = String(this.state.playerPoints).padStart(2, '0');
        const machinePointsStr = String(this.state.machinePoints).padStart(2, '0');

        return `
            <div class="game-layout">
                <!-- Left Sidebar: Stats, Turn, Logs -->
                <aside class="game-sidebar">
                    
                    <!-- Player Panel -->
                    <div class="operator-panel operator-player">
                        <div class="operator-header">
                            <div class="operator-avatar ${playerAvatarClass}">♘</div>
                            <div class="operator-meta">
                                <span class="operator-id uppercase font-bold">${p1Name}</span>
                                <span class="operator-title text-secondary">${p1Sub}</span>
                            </div>
                        </div>
                        <div class="operator-stats">
                            <div class="stat-row">
                                <span class="stat-label">PUNTOS</span>
                                <span id="player-points-val" class="stat-val ${playerPointsGlowClass}" style="display: flex; align-items: center;">
                                    ${playerPointsStr}
                                    <span class="material-symbols-outlined" style="font-size: 14px; margin-left: 4px; color: #4ade80; text-shadow: 0 0 4px rgba(74, 222, 128, 0.5);">star</span>
                                </span>
                            </div>
                            <div class="stat-row" style="align-items: center;">
                                <span class="stat-label">ENERGÍA</span>
                                <span id="player-energy-val" class="stat-val text-primary" style="display: flex; align-items: center;">
                                    ${this.state.playerEnergy}
                                    <span class="material-symbols-outlined" style="font-size: 16px; margin-left: 4px; text-shadow: 0 0 4px rgba(221, 183, 255, 0.5);">bolt</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Machine Panel -->
                    <div class="operator-panel operator-machine">
                        <div class="operator-header">
                            <div class="operator-avatar ${machineAvatarClass}">♘</div>
                            <div class="operator-meta">
                                <span class="operator-id uppercase font-bold text-primary">${p2Name}</span>
                                <span class="operator-title text-secondary">${p2Sub}</span>
                            </div>
                        </div>
                        <div class="operator-stats">
                            <div class="stat-row">
                                <span class="stat-label">PUNTOS</span>
                                <span id="machine-points-val" class="stat-val ${machinePointsGlowClass}" style="display: flex; align-items: center;">
                                    ${machinePointsStr}
                                    <span class="material-symbols-outlined" style="font-size: 14px; margin-left: 4px; color: #4ade80; text-shadow: 0 0 4px rgba(74, 222, 128, 0.5);">star</span>
                                </span>
                            </div>
                            <div class="stat-row" style="align-items: center;">
                                <span class="stat-label">ENERGÍA</span>
                                <span id="machine-energy-val" class="stat-val text-primary" style="display: flex; align-items: center;">
                                    ${this.state.machineEnergy}
                                    <span class="material-symbols-outlined" style="font-size: 16px; margin-left: 4px; text-shadow: 0 0 4px rgba(221, 183, 255, 0.5);">bolt</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Active Turn Indicator -->
                    <div class="tactical-container turn-indicator-box">
                        <div class="menu-header-tag uppercase">TURNO ACTUAL</div>
                        <div class="corner tl">+</div>
                        <div class="corner tr">+</div>
                        <div class="corner bl">+</div>
                        <div class="corner br">+</div>
                        <div class="turn-content">
                            <span class="material-symbols-outlined turn-icon cursor-blink">hourglass_empty</span>
                            <div class="turn-info">
                                <div class="active-operator font-bold uppercase ${turnAvatarClass}">${turnOperatorLabel}</div>
                                <div class="turn-action text-secondary text-mono-data">${turnActionLabel}</div>
                            </div>
                        </div>
                    </div>


                    <!-- Terminal System Logs -->
                    <div class="system-logs-container">
                        <div class="logs-header uppercase">LOG DE SISTEMA</div>
                        <div class="logs-console" id="log-console-box">
                            ${this.logs.map(log => `<div class="log-entry">${log}</div>`).join('')}
                        </div>
                    </div>

                </aside>

                <!-- Right Main Panel: Tactical Board Grid -->
                <main class="game-main-area">
                    
                    <!-- Coordinate Grid Layout -->
                    <div class="coordinate-layout" style="--board-size: ${size};">
                        
                        <!-- Top-left corner -->
                        <div class="coord-corner"></div>
                        
                        <!-- Columns Header (A, B, C...) -->
                        <div class="coord-cols-header" style="--board-size: ${size};">
                            ${cols.map(c => `<div class="coord-col-label">${c}</div>`).join('')}
                        </div>
                        
                        <!-- Rows Header (8, 7, 6...) -->
                        <div class="coord-rows-header" style="--board-size: ${size};">
                            ${rows.map(r => `<div class="coord-row-label">${r}</div>`).join('')}
                        </div>
                        
                        <!-- The Board Grid -->
                        <div class="board-grid" style="--board-size: ${size};">
                            ${cellsHTML}
                        </div>
                    </div>

                    <!-- Grid Legend Section -->
                    <div class="board-legend">
                        <div class="legend-item">
                            <span class="legend-box legend-empty">.</span>
                            <span class="legend-text uppercase">VACÍA</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-box legend-point"><span class="material-symbols-outlined" style="font-size: 12px; text-shadow: 0 0 4px rgba(74, 222, 128, 0.5);">star</span></span>
                            <span class="legend-text uppercase">PUNTOS</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-box legend-energy"><span class="material-symbols-outlined" style="font-size: 14px;">bolt</span></span>
                            <span class="legend-text uppercase">ENERGÍA</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-box legend-avatar machine">♘</span>
                            <span class="legend-text uppercase">MÁQUINA</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-box legend-avatar player">♘</span>
                            <span class="legend-text uppercase">JUGADOR</span>
                        </div>
                    </div>

                </main>
            </div>
        `;
    },

    render() {
        if (!this.state) {
            this.initGameState();
        }
        return this.getHTML();
    },

    init(navigate) {
        this.navigate = navigate;
        activePageInstance = this;
        
        // Start in-game music
        AudioManager.playGame();
        
        // Reset state so each entry does a clean startup
        this.state = null;

        const config = window.gameState || {
            gameMode: 'pvc',
            difficulty: 'normal',
            playerColor: 'black',
            boardSize: 8,
            energies: [2, 3, 4, 5],
            points: [2, 3, 4, 5, 6, 8, 9]
        };

        if (window.eel) {
            window.eel.start_game_backend(
                config.boardSize,
                config.difficulty,
                config.playerColor,
                config.energies,
                config.points,
                config.gameMode,
                config.startingEnergy || 7,
                config.whiteHeur || 'complex',
                config.blackHeur || 'complex'
            )();
        } else {
            this.initLocalMockState();
            this.refreshUI();
        }
    },

    attachListeners() {
        const validCells = document.querySelectorAll('.cell-valid-move');
        validCells.forEach(cell => {
            cell.addEventListener('click', () => {
                const r = parseInt(cell.getAttribute('data-r'));
                const c = parseInt(cell.getAttribute('data-c'));
                if (window.eel) {
                    window.eel.play_human_move_backend(r, c)();
                }
            });
        });

        // Auto Scroll logs console
        const consoleBox = document.getElementById('log-console-box');
        if (consoleBox) {
            consoleBox.scrollTop = consoleBox.scrollHeight;
        }
    },

    refreshUI() {
        const container = document.getElementById('app-container');
        if (container) {
            container.innerHTML = this.getHTML();
            this.attachListeners();
        }
    }
};
