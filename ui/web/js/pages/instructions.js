export default {
    render() {
        // Build mock chessboard cells HTML matching the user's active game board screenshot
        const size = 8;
        const exampleGrid = Array(size).fill(null).map(() => Array(size).fill(null));
        
        // Rows from 0 to 7 correspond to chess ranks 8 to 1.
        // Columns from 0 to 7 correspond to chess files A to H.
        
        // Row 1 (Chess rank 7)
        exampleGrid[1][1] = { type: 'point', val: 2 };
        exampleGrid[1][6] = { type: 'point', val: 3 };
        
        // Row 2 (Chess rank 6)
        exampleGrid[2][3] = { type: 'point', val: 8 };
        
        // Row 3 (Chess rank 5) - Valid moves for white knight
        exampleGrid[3][1] = { type: 'valid_move' };
        exampleGrid[3][3] = { type: 'valid_move' };
        
        // Row 4 (Chess rank 4)
        exampleGrid[4][0] = { type: 'valid_move' };
        exampleGrid[4][3] = { type: 'point', val: 6 };
        exampleGrid[4][4] = { type: 'valid_move' };
        exampleGrid[4][5] = { type: 'white_knight' }; // Player (Jugador)
        
        // Row 5 (Chess rank 3)
        exampleGrid[5][2] = { type: 'black_knight' }; // Machine (Máquina)
        exampleGrid[5][3] = { type: 'energy', val: 5 };
        exampleGrid[5][7] = { type: 'point', val: 4 };
        
        // Row 6 (Chess rank 2)
        exampleGrid[6][4] = { type: 'point', val: 5 };
        
        // Row 7 (Chess rank 1)
        exampleGrid[7][0] = { type: 'energy', val: 4 };
        exampleGrid[7][1] = { type: 'valid_move' };
        exampleGrid[7][3] = { type: 'valid_move' };
        exampleGrid[7][5] = { type: 'energy', val: 2 };
        exampleGrid[7][7] = { type: 'point', val: 9 };

        let cellsHTML = '';
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const cell = exampleGrid[r][c];
                if (!cell) {
                    cellsHTML += `
                        <div class="board-cell cell-empty" style="pointer-events: none;">
                            <span class="dot-marker">.</span>
                        </div>
                    `;
                } else if (cell.type === 'valid_move') {
                    cellsHTML += `
                        <div class="board-cell cell-empty cell-valid-move" style="pointer-events: none;">
                            <span class="dot-marker">.</span>
                        </div>
                    `;
                } else if (cell.type === 'point') {
                    cellsHTML += `
                        <div class="board-cell cell-point" style="pointer-events: none;">
                            <span class="material-symbols-outlined pt-icon" style="font-size: 14px;">star</span>
                            <span class="pt-amount">+${cell.val}</span>
                        </div>
                    `;
                } else if (cell.type === 'energy') {
                    cellsHTML += `
                        <div class="board-cell cell-energy" style="pointer-events: none;">
                            <span class="material-symbols-outlined nrg-icon" style="font-size: 14px;">bolt</span>
                            <span class="nrg-amount">+${cell.val}</span>
                        </div>
                    `;
                } else if (cell.type === 'white_knight') {
                    cellsHTML += `
                        <div class="board-cell cell-knight player" style="pointer-events: none; color: #ffffff; border-color: #ffffff; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                            <span>♘</span>
                        </div>
                    `;
                } else if (cell.type === 'black_knight') {
                    cellsHTML += `
                        <div class="board-cell cell-knight machine" style="pointer-events: none; color: var(--color-primary); border-color: var(--color-primary); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                            <span>♘</span>
                        </div>
                    `;
                }
            }
        }

        return `
            <div class="home-page" style="padding-top: 40px; padding-bottom: 40px; display: flex; flex-direction: column; align-items: center;">
                <!-- Back Navigation Button on Top Left -->
                <div class="back-navigation-container">
                    <button class="tactical-back-btn" id="instructions-back-btn">
                        <span class="material-symbols-outlined">chevron_left</span>
                        <span>VOLVER AL MENÚ</span>
                    </button>
                </div>

                <!-- Hero Header Section -->
                <section class="hero-section">
                    <div class="hero-main">
                        <span class="material-symbols-outlined hero-icon left glow-text-white">menu_book</span>
                        <div class="hero-text-container">
                            <h2 class="hero-title">
                                <span class="glow-text-white">MANUAL</span>
                                <span class="glow-text-purple">DE JUEGO</span>
                            </h2>
                            <p class="hero-subtitle">CÓMO JUGAR A KNIGHT ENERGY</p>
                        </div>
                        <span class="material-symbols-outlined hero-icon right glow-text-purple">bolt</span>
                    </div>
                </section>

                <!-- Instructions Container -->
                <div class="home-menu-box config-container-box" style="max-width: 1080px; width: 90%; padding: 40px; margin-top: 20px;">
                    <div class="instructions-layout" style="display: flex; gap: 40px; flex-wrap: wrap;">
                        
                        <!-- Left column: The operational rules -->
                        <div class="instructions-text" style="flex: 1.2; min-width: 320px; font-family: 'JetBrains Mono', monospace; color: var(--color-on-surface-variant); text-align: left;">
                            
                            <p class="text-primary" style="font-weight: bold; font-size: 16px; margin-bottom: 16px; border-bottom: 1px solid rgba(221, 183, 255, 0.2); padding-bottom: 8px;">
                                > GUÍA RÁPIDA PARA EMPEZAR
                            </p>
                            
                            <p style="margin-bottom: 16px; line-height: 1.6;">
                                <strong class="text-primary">Knight Energy</strong> es un juego de estrategia por turnos para dos jugadores. Cada jugador controla un <strong>caballo</strong> de ajedrez en el tablero: el caballo del jugador es de color blanco y el caballo de la máquina es morado. El objetivo es conseguir la mayor cantidad de puntos de datos antes de que termine la partida.
                            </p>

                            <p class="text-primary" style="font-weight: bold; margin-top: 24px; margin-bottom: 8px;">
                                [1] MOVIMIENTO DEL CABALLO
                            </p>
                            <ul style="list-style-type: none; padding-left: 0; margin-bottom: 20px; line-height: 1.6;">
                                <li style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
                                    <span class="text-primary">></span>
                                    <span>Los caballos se mueven en forma de <strong>"L"</strong> (dos casillas en una dirección y una casilla a un lado).</span>
                                </li>
                                <li style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
                                    <span class="text-primary">></span>
                                    <span>Cada movimiento que realices consume exactamente <strong>1 punto de energía</strong>.</span>
                                </li>
                                <li style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
                                    <span class="text-primary">></span>
                                    <span>Ambos caballos comienzan la partida con <strong>7 puntos de energía</strong> (o 10 en partidas personalizadas).</span>
                                </li>
                            </ul>

                            <p class="text-primary" style="font-weight: bold; margin-top: 24px; margin-bottom: 8px;">
                                [2] LAS CASILLAS DEL TABLERO
                            </p>
                            <ul style="list-style-type: none; padding-left: 0; margin-bottom: 20px; line-height: 1.6;">
                                <li style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
                                    <span style="color:#4ade80;">⭐</span>
                                    <span><strong>Estrellas (Puntos):</strong> Tienen valores de <strong>2, 3, 4, 5, 6, 8 y 9</strong>. Al mover tu caballo a una estrella, sumas esos puntos a tu marcador y la estrella desaparece del tablero.</span>
                                </li>
                                <li style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
                                    <span style="color:var(--color-primary);">⚡</span>
                                    <span><strong>Rayos (Energía):</strong> Tienen valores de <strong>2, 3, 4 y 5</strong>. Al mover tu caballo a un rayo, recargas tu nivel de energía actual con ese valor. Se consumen tras su uso.</span>
                                </li>
                                <li style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
                                    <span style="color:var(--color-primary);">🟣</span>
                                    <span><strong>Casillas Punteadas:</strong> Indican las posiciones válidas del tablero a las que tu caballo puede saltar en este turno.</span>
                                </li>
                            </ul>

                            <p class="text-primary" style="font-weight: bold; margin-top: 24px; margin-bottom: 8px;">
                                [3] QUEDARSE SIN ENERGÍA (TURNO PERDIDO)
                            </p>
                            <p style="margin-bottom: 16px; line-height: 1.6; padding-left: 10px; border-left: 2px solid #ff5555;">
                                Si inicias tu turno con <strong>0 puntos de energía</strong> (o no tienes suficiente energía para moverte a ninguna casilla válida), tu caballo se apaga: <strong>pierdes el turno</strong> y sufres una penalización de <strong>-3 puntos</strong>.
                            </p>

                            <p class="text-primary" style="font-weight: bold; margin-top: 24px; margin-bottom: 8px;">
                                [4] NIVELES DE DIFICULTAD
                            </p>
                            <p style="margin-bottom: 16px; line-height: 1.6;">
                                Puedes configurar qué tan difícil juega tu oponente en tres niveles de inteligencia:
                            </p>
                            <ul style="list-style-type: none; padding-left: 0; margin-bottom: 20px; line-height: 1.6;">
                                <li style="margin-bottom: 6px;">> <strong>Fácil:</strong> La máquina calcula pocas jugadas a futuro, ideal para principiantes.</li>
                                <li style="margin-bottom: 6px;">> <strong>Normal:</strong> La máquina analiza con un balance medio de tiempo y estrategia.</li>
                                <li style="margin-bottom: 6px;">> <strong>Difícil:</strong> La máquina calcula múltiples turnos a futuro para jugar de forma óptima.</li>
                            </ul>

                            <p class="text-primary" style="font-weight: bold; margin-top: 24px; margin-bottom: 8px;">
                                [5] ¿CÓMO GANAR LA PARTIDA?
                            </p>
                            <p style="margin-bottom: 16px; line-height: 1.6;">
                                La partida finaliza de inmediato cuando ocurre cualquiera de estos casos:
                            </p>
                            <ul style="list-style-type: none; padding-left: 0; margin-bottom: 20px; line-height: 1.6;">
                                <li style="margin-bottom: 6px;">> Se agotan todas las casillas con <strong>estrellas (puntos)</strong> en el tablero.</li>
                                <li style="margin-bottom: 6px;">> Ninguno de los dos caballos puede realizar movimientos legales (por ejemplo, ambos acorralados o sin energía).</li>
                            </ul>
                            <p style="margin-bottom: 16px; line-height: 1.6;">
                                Al finalizar la partida, <strong>¡el jugador que haya acumulado más puntos gana la partida!</strong>
                            </p>

                        </div>

                        <!-- Right column: Example layout board representation -->
                        <div class="instructions-visual" style="flex: 1; min-width: 480px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 20px;">
                            <span class="text-primary" style="font-size: 11px; margin-bottom: 16px; font-weight: 700; letter-spacing: 0.2em; font-family: 'JetBrains Mono', monospace;">
                                SIMULACIÓN DE CASILLAS Y MOVIMIENTOS
                            </span>
                            
                            <!-- Board Wrapper -->
                            <div class="board-wrapper" style="width: 504px; height: 504px; border: 1px solid var(--color-outline-variant); padding: 12px; background: rgba(19, 19, 19, 0.9); box-shadow: 0 0 15px rgba(221, 183, 255, 0.1); border-radius: 4px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; z-index: 10;">
                                <div class="coordinate-layout" style="grid-template-columns: 32px 448px; grid-template-rows: 32px 448px; margin-top: 0; width: 480px; height: 480px; --board-size: 8; justify-content: center; align-items: center;">
                                    
                                    <!-- Top-left corner -->
                                    <div class="coord-corner"></div>
                                    
                                    <!-- Columns Header (A, B, C...) -->
                                    <div class="coord-cols-header" style="--board-size: 8;">
                                        <div class="coord-col-label">A</div>
                                        <div class="coord-col-label">B</div>
                                        <div class="coord-col-label">C</div>
                                        <div class="coord-col-label">D</div>
                                        <div class="coord-col-label">E</div>
                                        <div class="coord-col-label">F</div>
                                        <div class="coord-col-label">G</div>
                                        <div class="coord-col-label">H</div>
                                    </div>
                                    
                                    <!-- Rows Header (8, 7, 6...) -->
                                    <div class="coord-rows-header" style="--board-size: 8;">
                                        <div class="coord-row-label">8</div>
                                        <div class="coord-row-label">7</div>
                                        <div class="coord-row-label">6</div>
                                        <div class="coord-row-label">5</div>
                                        <div class="coord-row-label">4</div>
                                        <div class="coord-row-label">3</div>
                                        <div class="coord-row-label">2</div>
                                        <div class="coord-row-label">1</div>
                                    </div>
                                    
                                    <!-- The Board Grid -->
                                    <div class="board-grid" style="--board-size: 8; width: 100%; height: 100%;">
                                        ${cellsHTML}
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Legend for cells -->
                            <div class="board-legend" style="margin-top: 20px; width: 100%; max-width: 504px; flex-wrap: wrap; justify-content: center; gap: 16px; font-family: 'JetBrains Mono', monospace;">
                                <div class="legend-item">
                                    <span class="legend-box legend-empty">.</span>
                                    <span class="legend-text uppercase" style="font-size: 9px;">VACÍA</span>
                                </div>
                                <div class="legend-item">
                                    <span class="legend-box legend-point"><span class="material-symbols-outlined" style="font-size: 11px; text-shadow: 0 0 4px rgba(74, 222, 128, 0.5);">star</span></span>
                                    <span class="legend-text uppercase" style="font-size: 9px;">PUNTOS</span>
                                </div>
                                <div class="legend-item">
                                    <span class="legend-box legend-energy"><span class="material-symbols-outlined" style="font-size: 11px;">bolt</span></span>
                                    <span class="legend-text uppercase" style="font-size: 9px;">ENERGÍA</span>
                                </div>
                                <div class="legend-item">
                                    <span class="legend-box legend-avatar machine" style="border-color: var(--color-primary); color: var(--color-primary);">♘</span>
                                    <span class="legend-text uppercase" style="font-size: 9px;">MÁQUINA</span>
                                </div>
                                <div class="legend-item">
                                    <span class="legend-box legend-avatar player" style="border-color: #ffffff; color: #ffffff;">♘</span>
                                    <span class="legend-text uppercase" style="font-size: 9px;">JUGADOR</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;
    },

    init(navigate) {
        const backBtn = document.getElementById('instructions-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                navigate('/');
            });
        }
    }
};
