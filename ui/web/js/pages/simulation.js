export default {
    state: {
        total: 0,
        current: 0,
        finished: false,
        results: null
    },

    render() {
        if (this.state.finished && this.state.results) {
            return this.renderResults();
        }
        return this.renderProgress();
    },

    renderProgress() {
        const percent = this.state.total > 0 ? Math.round((this.state.current / this.state.total) * 100) : 0;
        return `
            <div class="home-page" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
                <div class="hero-text-container" style="text-align: center; margin-bottom: 40px;">
                    <h2 class="hero-title">
                        <span class="glow-text-white">SIMULACIÓN</span>
                        <span class="glow-text-purple">EN PROCESO</span>
                    </h2>
                    <p class="hero-subtitle">MÁQUINA VS MÁQUINA</p>
                </div>
                
                <div style="width: 80%; max-width: 600px; background: rgba(19, 19, 19, 0.9); border: 1px solid var(--color-primary); border-radius: 4px; padding: 30px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-family: 'JetBrains Mono', monospace;">
                        <span class="text-primary">PROGRESO:</span>
                        <span>${this.state.current} / ${this.state.total} (${percent}%)</span>
                    </div>
                    <div style="width: 100%; height: 20px; background: #000; border: 1px solid #333; border-radius: 2px; overflow: hidden;">
                        <div style="width: ${percent}%; height: 100%; background: var(--color-primary); box-shadow: 0 0 10px var(--color-primary); transition: width 0.1s linear;"></div>
                    </div>
                </div>
            </div>
        `;
    },

    renderResults() {
        const res = this.state.results;
        const total = res.white + res.black + res.draw;
        
        let m1Wins = res.white;
        let m2Wins = res.black;
        let m1ColorName = "Blancas";
        let m2ColorName = "Negras";
        let m1Heur = window.gameState?.whiteHeur === 'simple' ? 'Simple' : 'Compleja';
        let m2Heur = window.gameState?.blackHeur === 'simple' ? 'Simple' : 'Compleja';

        // Si la máquina 1 juega con las negras, invertimos el mapeo visual
        if (window.gameState?.playerColor === 'black') {
            m1Wins = res.black;
            m2Wins = res.white;
            m1ColorName = "Negras";
            m2ColorName = "Blancas";
            m1Heur = window.gameState?.blackHeur === 'simple' ? 'Simple' : 'Compleja';
            m2Heur = window.gameState?.whiteHeur === 'simple' ? 'Simple' : 'Compleja';
        }

        const pctM1 = total > 0 ? ((m1Wins / total) * 100).toFixed(1) : 0;
        const pctM2 = total > 0 ? ((m2Wins / total) * 100).toFixed(1) : 0;
        const pctDraw = total > 0 ? ((res.draw / total) * 100).toFixed(1) : 0;

        return `
            <div class="home-page" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
                <div class="hero-text-container" style="text-align: center; margin-bottom: 40px;">
                    <h2 class="hero-title">
                        <span class="glow-text-white">RESULTADOS</span>
                        <span class="glow-text-purple">SIMULACIÓN</span>
                    </h2>
                    <p class="hero-subtitle">PARTIDAS TOTALES: ${total}</p>
                </div>
                
                <div style="width: 80%; max-width: 600px; background: rgba(19, 19, 19, 0.9); border: 1px solid var(--color-primary); border-radius: 4px; padding: 30px; font-family: 'JetBrains Mono', monospace;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #333;">
                        <div style="display: flex; flex-direction: column;">
                            <span class="text-white">MÁQUINA 1 (${m1ColorName})</span>
                            <span style="font-size: 0.75rem; color: #888;">HEURÍSTICA: ${m1Heur.toUpperCase()}</span>
                        </div>
                        <span class="text-primary" style="font-weight: bold; font-size: 1.2rem;">${m1Wins} (${pctM1}%)</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #333;">
                        <div style="display: flex; flex-direction: column;">
                            <span class="text-white">MÁQUINA 2 (${m2ColorName})</span>
                            <span style="font-size: 0.75rem; color: #888;">HEURÍSTICA: ${m2Heur.toUpperCase()}</span>
                        </div>
                        <span class="text-primary" style="font-weight: bold; font-size: 1.2rem;">${m2Wins} (${pctM2}%)</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 15px;">
                        <span class="text-white">EMPATES:</span>
                        <span style="color: #aaa; font-weight: bold; font-size: 1.2rem;">${res.draw} (${pctDraw}%)</span>
                    </div>
                </div>

                <div style="margin-top: 40px; display: flex; gap: 20px;">
                    <button class="tactical-btn secondary-btn" id="sim-back-btn">
                        <span class="material-symbols-outlined">settings</span>
                        <span>NUEVA SIMULACIÓN</span>
                    </button>
                    <button class="tactical-btn" id="sim-home-btn">
                        <span class="material-symbols-outlined">home</span>
                        <span>INICIO</span>
                    </button>
                </div>
            </div>
        `;
    },

    init(navigate) {
        this.state = {
            total: window.gameState?.simulationCount || 1,
            current: 0,
            finished: false,
            results: null
        };

        const _this = this;

        // Expose eel functions
        window.eel.expose(update_simulation_progress_js, 'update_simulation_progress_js');
        function update_simulation_progress_js(current, total) {
            _this.state.current = current;
            _this.state.total = total;
            _this.refreshUI();
        }

        window.eel.expose(simulation_finished_js, 'simulation_finished_js');
        function simulation_finished_js(results) {
            _this.state.finished = true;
            _this.state.results = results;
            _this.refreshUI();
            _this.bindResultButtons(navigate);
        }

        // Start backend simulation
        const config = window.gameState || {};
        if (window.eel) {
            window.eel.start_simulation_backend(
                config.simulationCount || 1,
                config.boardSize || 8,
                config.difficulty || 'normal',
                config.energies || [2,3,4,5],
                config.points || [2,3,4,5,6,8,9],
                config.startingEnergy || 7,
                config.whiteHeur || 'complex',
                config.blackHeur || 'complex'
            )();
        } else {
            // Mock simulation for offline
            let curr = 0;
            const iv = setInterval(() => {
                curr += 1;
                update_simulation_progress_js(curr, _this.state.total);
                if (curr >= _this.state.total) {
                    clearInterval(iv);
                    simulation_finished_js({ white: Math.floor(_this.state.total * 0.4), black: Math.floor(_this.state.total * 0.5), draw: Math.floor(_this.state.total * 0.1) });
                }
            }, 100);
        }
    },

    refreshUI() {
        const container = document.getElementById('app-container');
        if (container) {
            container.innerHTML = this.render();
        }
    },

    bindResultButtons(navigate) {
        const backBtn = document.getElementById('sim-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                navigate('/config');
            });
        }
        const homeBtn = document.getElementById('sim-home-btn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                navigate('/');
            });
        }
    }
};
