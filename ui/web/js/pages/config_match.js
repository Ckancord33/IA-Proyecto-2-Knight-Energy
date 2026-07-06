export default {
    render() {
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
                    
                    <!-- Section 1: Difficulty Select (Required) -->
                    <div class="config-section">
                        <div class="config-label uppercase font-bold tracking-wide">DIFICULTAD DE LA IA</div>
                        <div class="tactical-chips-container">
                            <button class="tactical-chip diff-select-chip" data-difficulty="facil">Fácil</button>
                            <button class="tactical-chip diff-select-chip active" data-difficulty="normal">Normal</button>
                            <button class="tactical-chip diff-select-chip" data-difficulty="dificil">Difícil</button>
                        </div>
                    </div>

                    <!-- Section: Horse Color Select -->
                    <div class="config-section">
                        <div class="config-label uppercase font-bold tracking-wide">COLOR DE TU CABALLO</div>
                        <div class="tactical-chips-container">
                            <button class="tactical-chip color-select-chip" data-color="white">BLANCAS (IA: Negras)</button>
                            <button class="tactical-chip color-select-chip active" data-color="black">NEGRAS (IA: Blancas)</button>
                        </div>
                    </div>

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

        // Start Match Button Event
        const startBtn = document.getElementById('start-match-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                // Read configuration values (to be passed to python later)
                const energyInput = document.getElementById('energy-array-input').value;
                const pointsInput = document.getElementById('points-array-input').value;
                
                const energies = energyInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                const points = pointsInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));

                // Save config to shared state
                window.gameState = {
                    difficulty: selectedDifficulty,
                    playerColor: selectedColor,
                    boardSize: boardSize,
                    energies: energies.length > 0 ? energies : [2, 3, 4, 5],
                    points: points.length > 0 ? points : [2, 3, 4, 5, 6, 8, 9]
                };

                console.log(`Iniciando juego con Dificultad: ${selectedDifficulty}, Color: ${selectedColor}, Tablero: ${boardSize}x${boardSize}, Energias: [${energies}], Puntos: [${points}]`);
                
                // Navigate to game board
                navigate('/game');
            });
        }
    }
};
