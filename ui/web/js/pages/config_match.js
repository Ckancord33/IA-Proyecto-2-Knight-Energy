export default {
    render() {
        const mode = window.gameMode || 'pvc';

        let difficultyHTML = '';
        if (mode !== 'pvp') {
            difficultyHTML = `
                <!-- Section 1: Difficulty Select (Required) -->
                <div class="config-section">
                    <div class="config-label uppercase font-bold tracking-wide">DIFICULTAD DE LA IA</div>
                    <div class="tactical-chips-container">
                        <button class="tactical-chip diff-select-chip" data-difficulty="facil">Fácil</button>
                        <button class="tactical-chip diff-select-chip active" data-difficulty="normal">Normal</button>
                        <button class="tactical-chip diff-select-chip" data-difficulty="dificil">Difícil</button>
                    </div>
                </div>
            `;
        }

        let colorLabel = 'COLOR DE TU CABALLO';
        let opt1Text = 'BLANCAS (IA: Negras)';
        let opt2Text = 'NEGRAS (IA: Blancas)';
        if (mode === 'pvp') {
            colorLabel = 'COLOR DEL JUGADOR 1';
            opt1Text = 'BLANCAS (J2: Negras)';
            opt2Text = 'NEGRAS (J2: Blancas)';
        } else if (mode === 'cvc') {
            colorLabel = 'COLOR DE LA MÁQUINA 1';
            opt1Text = 'BLANCAS (M2: Negras)';
            opt2Text = 'NEGRAS (M2: Blancas)';
        }

        let heuristicHTML = '';
        if (mode === 'pvc') {
            heuristicHTML = `
                <!-- Section: Heuristic Select -->
                <div class="config-section">
                    <div class="config-label uppercase font-bold tracking-wide">HEURÍSTICA DE LA IA</div>
                    <div class="tactical-chips-container">
                        <button class="tactical-chip heur-select-chip active" data-heur="complex">Compleja</button>
                        <button class="tactical-chip heur-select-chip" data-heur="simple">Simple</button>
                    </div>
                </div>
            `;
        } else if (mode === 'cvc') {
            heuristicHTML = `
                <!-- Section: Heuristic Select for Machine 1 -->
                <div class="config-section">
                    <div class="config-label uppercase font-bold tracking-wide">HEURÍSTICA MÁQUINA 1 (W)</div>
                    <div class="tactical-chips-container">
                        <button class="tactical-chip heur1-select-chip active" data-heur="complex">Compleja</button>
                        <button class="tactical-chip heur1-select-chip" data-heur="simple">Simple</button>
                    </div>
                </div>
                <!-- Section: Heuristic Select for Machine 2 -->
                <div class="config-section">
                    <div class="config-label uppercase font-bold tracking-wide">HEURÍSTICA MÁQUINA 2 (B)</div>
                    <div class="tactical-chips-container">
                        <button class="tactical-chip heur2-select-chip active" data-heur="complex">Compleja</button>
                        <button class="tactical-chip heur2-select-chip" data-heur="simple">Simple</button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="home-page">
                <!-- Back Navigation Button on Top Left -->
                <div class="back-navigation-container">
                    <button class="tactical-back-btn" id="config-back-btn">
                        <span class="material-symbols-outlined">chevron_left</span>
                        <span>MODOS DE JUEGO</span>
                    </button>
                </div>

                <!-- Hero Header Section -->
                <section class="hero-section">
                    <div class="hero-main">
                        <div class="hero-icon left glow-text-white">♘</div>
                        <div class="hero-text-container">
                            <h2 class="hero-title">
                                <span class="glow-text-white">KNIGHT</span>
                                <span class="glow-text-purple">ENERGY</span>
                            </h2>
                            <p class="hero-subtitle">CONFIGURACIÓN DE PROTOCOLO DE PARTIDA</p>
                        </div>
                        <span class="material-symbols-outlined hero-icon right glow-text-purple">bolt</span>
                    </div>
                </section>

                <!-- Configuration Menu Container -->
                <div class="home-menu-box config-container-box">
                    
                    ${difficultyHTML}

                    <!-- Section: Horse Color Select -->
                    <div class="config-section">
                        <div class="config-label uppercase font-bold tracking-wide">${colorLabel}</div>
                        <div class="tactical-chips-container">
                            <button class="tactical-chip color-select-chip" data-color="white">${opt1Text}</button>
                            <button class="tactical-chip color-select-chip active" data-color="black">${opt2Text}</button>
                        </div>
                    </div>

                    ${heuristicHTML}

                    <!-- Section 2: Parameters Toggle Button -->
                    <div class="config-section center-align">
                        <button class="parameters-toggle-btn" id="advanced-toggle-btn">
                            <span class="material-symbols-outlined" id="toggle-icon">expand_more</span>
                            <span>PARÁMETROS AVANZADOS</span>
                        </button>
                    </div>

                    <!-- Section 3: Expandable Advanced Parameters -->
                    <div class="advanced-params-panel" id="advanced-panel">
                        
                        <!-- Board Size (NxN) -->
                        <div class="config-row-param">
                            <div class="param-info-col">
                                <span class="param-title">TAMAÑO DEL TABLERO (N x N)</span>
                                <span class="param-subtitle">Dimensiones de la cuadrícula táctica (min: 6, max: 12)</span>
                            </div>
                            <div class="board-size-control">
                                <button class="board-size-btn" id="size-dec-btn">
                                    <span class="material-symbols-outlined">chevron_left</span>
                                </button>
                                <div class="board-size-val" id="size-val-display">8 x 8</div>
                                <button class="board-size-btn" id="size-inc-btn">
                                    <span class="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>

                        <!-- Energy Array Input -->
                        <div class="config-row-param">
                            <div class="param-info-col">
                                <span class="param-title">VALORES DE ENERGÍA (ARREGLO)</span>
                                <span class="param-subtitle">Unidades que recargan las celdas de energía</span>
                            </div>
                            <div class="prompt-input-wrapper">
                                <span class="prompt-arrow text-primary">&gt;</span>
                                <input type="text" class="prompt-input" id="energy-array-input" value="2, 3, 4, 5" placeholder="Valores separados por comas">
                            </div>
                        </div>

                        <!-- Starting Energy Input -->
                        <div class="config-row-param">
                            <div class="param-info-col">
                                <span class="param-title">ENERGÍA INICIAL</span>
                                <span class="param-subtitle">Cantidad de energía al inicio (mínimo 3)</span>
                            </div>
                            <div class="prompt-input-wrapper">
                                <span class="prompt-arrow text-primary">&gt;</span>
                                <input type="number" class="prompt-input" id="starting-energy-input" value="7" min="3">
                            </div>
                        </div>

                        <!-- Points Array Input -->
                        <div class="config-row-param">
                            <div class="param-info-col">
                                <span class="param-title">VALORES DE PUNTOS (ARREGLO)</span>
                                <span class="param-subtitle">Puntos que otorgan las celdas de recursos</span>
                            </div>
                            <div class="prompt-input-wrapper">
                                <span class="prompt-arrow text-primary">&gt;</span>
                                <input type="text" class="prompt-input" id="points-array-input" value="2, 3, 4, 5, 6, 8, 9" placeholder="Valores separados por comas">
                            </div>
                        </div>

                        <!-- Reset Defaults Button -->
                        <div class="config-row-param" style="justify-content: center; margin-top: 10px; border-bottom: none;">
                            <button class="tactical-btn secondary-btn" id="reset-defaults-btn" style="padding: 8px 16px; font-size: 0.85rem; display: flex; align-items: center; gap: 8px;">
                                <span class="material-symbols-outlined" style="font-size: 1.1rem;">restart_alt</span>
                                <span>RESTABLECER VALORES POR DEFECTO</span>
                            </button>
                        </div>

                    </div>

                    <!-- Start Match Button -->
                    <div class="config-actions">
                        <button class="tactical-btn" id="start-match-btn" style="width: 100%;">
                            <span class="material-symbols-outlined">play_circle</span>
                            <span>INICIAR PROTOCOLO DE JUEGO</span>
                            <div class="btn-overlay"></div>
                        </button>
                    </div>

                </div>
            </div>
        `;
    },

    init(navigate) {
        const mode = window.gameMode || 'pvc';

        // Back to Mode Selection Page
        const backBtn = document.getElementById('config-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                navigate('/mode');
            });
        }

        // Difficulty Chips selection logic
        const diffChips = document.querySelectorAll('.diff-select-chip');
        let selectedDifficulty = 'normal';
        diffChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                diffChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                selectedDifficulty = chip.getAttribute('data-difficulty');
                console.log(`Dificultad seleccionada: ${selectedDifficulty}`);
            });
        });

        // Color Chips selection logic
        const colorChips = document.querySelectorAll('.color-select-chip');
        let selectedColor = 'black';
        colorChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                colorChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                selectedColor = chip.getAttribute('data-color');
                console.log(`Color del jugador seleccionado: ${selectedColor}`);
            });
        });

        // Heuristic selection logic
        let selectedHeur1 = 'complex';
        let selectedHeur2 = 'complex';

        const heurIAChips = document.querySelectorAll('.heur-select-chip');
        heurIAChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                heurIAChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                selectedHeur1 = chip.getAttribute('data-heur');
                console.log(`Heurística IA seleccionada: ${selectedHeur1}`);
            });
        });

        const heurM1Chips = document.querySelectorAll('.heur1-select-chip');
        heurM1Chips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                heurM1Chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                selectedHeur1 = chip.getAttribute('data-heur');
                console.log(`Heurística M1 seleccionada: ${selectedHeur1}`);
            });
        });

        const heurM2Chips = document.querySelectorAll('.heur2-select-chip');
        heurM2Chips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                heurM2Chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                selectedHeur2 = chip.getAttribute('data-heur');
                console.log(`Heurística M2 seleccionada: ${selectedHeur2}`);
            });
        });

        // Toggle Advanced Parameters Panel
        const toggleBtn = document.getElementById('advanced-toggle-btn');
        const panel = document.getElementById('advanced-panel');
        const toggleIcon = document.getElementById('toggle-icon');
        let panelOpen = false;

        if (toggleBtn && panel) {
            toggleBtn.addEventListener('click', () => {
                panelOpen = !panelOpen;
                if (panelOpen) {
                    panel.classList.add('open');
                    toggleIcon.textContent = 'expand_less';
                } else {
                    panel.classList.remove('open');
                    toggleIcon.textContent = 'expand_more';
                }
            });
        }

        // Board Size Adjustment Logic
        let boardSize = 8;
        const sizeDisplay = document.getElementById('size-val-display');
        const decBtn = document.getElementById('size-dec-btn');
        const incBtn = document.getElementById('size-inc-btn');

        const updateSize = (newSize) => {
            boardSize = Math.max(6, Math.min(12, newSize));
            if (sizeDisplay) {
                sizeDisplay.textContent = `${boardSize} x ${boardSize}`;
            }
        };

        if (decBtn) {
            decBtn.addEventListener('click', () => updateSize(boardSize - 1));
        }
        if (incBtn) {
            incBtn.addEventListener('click', () => updateSize(boardSize + 1));
        }

        // Reset Defaults Event
        const resetBtn = document.getElementById('reset-defaults-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const energyInput = document.getElementById('energy-array-input');
                const startingEnergyInput = document.getElementById('starting-energy-input');
                const pointsInput = document.getElementById('points-array-input');

                if (energyInput) energyInput.value = '2, 3, 4, 5';
                if (startingEnergyInput) startingEnergyInput.value = '7';
                if (pointsInput) pointsInput.value = '2, 3, 4, 5, 6, 8, 9';

                updateSize(8);
            });
        }

        // Start Match Button Event
        const startBtn = document.getElementById('start-match-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                // Read configuration values (to be passed to python later)
                const energyInput = document.getElementById('energy-array-input').value;
                const pointsInput = document.getElementById('points-array-input').value;
                const startingEnergyInput = parseInt(document.getElementById('starting-energy-input')?.value || "7");

                if (isNaN(startingEnergyInput) || startingEnergyInput < 3) {
                    alert("La energía inicial debe ser un número válido mayor o igual a 3.");
                    return;
                }

                const rawEnergies = energyInput.split(',').map(n => n.trim()).filter(n => n !== '');
                if (rawEnergies.length === 0) {
                    alert("La lista de valores de energía no puede estar vacía.");
                    return;
                }
                const energies = rawEnergies.map(n => parseInt(n)).filter(n => !isNaN(n));
                if (energies.length !== rawEnergies.length) {
                    alert("La lista de valores de energía contiene valores inválidos. Solo se permiten números enteros separados por comas.");
                    return;
                }

                const rawPoints = pointsInput.split(',').map(n => n.trim()).filter(n => n !== '');
                if (rawPoints.length === 0) {
                    alert("La lista de valores de puntos no puede estar vacía.");
                    return;
                }
                const points = rawPoints.map(n => parseInt(n)).filter(n => !isNaN(n));
                if (points.length !== rawPoints.length) {
                    alert("La lista de valores de puntos contiene valores inválidos. Solo se permiten números enteros separados por comas.");
                    return;
                }

                let whiteHeur = 'complex';
                let blackHeur = 'complex';

                if (mode === 'pvc') {
                    if (selectedColor === 'white') {
                        blackHeur = selectedHeur1;
                    } else {
                        whiteHeur = selectedHeur1;
                    }
                } else if (mode === 'cvc') {
                    whiteHeur = selectedHeur1;
                    blackHeur = selectedHeur2;
                }

                // Save config to shared state
                window.gameState = {
                    gameMode: mode,
                    difficulty: selectedDifficulty,
                    playerColor: selectedColor,
                    boardSize: boardSize,
                    startingEnergy: startingEnergyInput,
                    energies: energies,
                    points: points,
                    whiteHeur: whiteHeur,
                    blackHeur: blackHeur
                };

                console.log(`Iniciando juego con Dificultad: ${selectedDifficulty}, Color: ${selectedColor}, Tablero: ${boardSize}x${boardSize}, Energias: [${energies}], Puntos: [${points}], WhiteHeur: ${whiteHeur}, BlackHeur: ${blackHeur}`);

                // Navigate to game board
                navigate('/game');
            });
        }
    }
};
