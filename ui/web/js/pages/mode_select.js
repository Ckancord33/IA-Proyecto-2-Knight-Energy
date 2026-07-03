export default {
    render() {
        return `
            <div class="home-page">
                <!-- Back Navigation Button on Top Left -->
                <div class="back-navigation-container">
                    <button class="tactical-back-btn" id="mode-back-btn">
                        <span class="material-symbols-outlined">chevron_left</span>
                        <span>VOLVER AL MENÚ</span>
                    </button>
                </div>

                <!-- Hero Header Section (Matching Home Page) -->
                <section class="hero-section">
                    <div class="hero-main">
                        <div class="hero-icon left glow-text-white">♘</div>
                        <div class="hero-text-container">
                            <h2 class="hero-title">
                                <span class="glow-text-white">KNIGHT</span>
                                <span class="glow-text-purple">ENERGY</span>
                            </h2>
                            <p class="hero-subtitle">ESTRATEGIA. MOVIMIENTO. ENERGÍA. VICTORIA.</p>
                        </div>
                        <span class="material-symbols-outlined hero-icon right glow-text-purple">bolt</span>
                    </div>
                </section>

                <!-- Game Mode Options (Horizontal rows matching screenshot spec) -->
                <div class="home-menu-box mode-options-box">
                    <div class="mode-options-list">
                        
                        <!-- Option 01: Player vs AI -->
                        <div class="mode-row-btn" id="mode-pvc-btn">
                            <div class="mode-num">01</div>
                            <div class="mode-info">
                                <div class="mode-title">MODO: JUGADOR VS MÁQUINA</div>
                                <div class="mode-desc">Desafía a la IA en un duelo táctico de posicionamiento.</div>
                            </div>
                            <span class="material-symbols-outlined mode-icon">play_arrow</span>
                        </div>

                        <!-- Option 02: Player vs Player -->
                        <div class="mode-row-btn" id="mode-pvp-btn">
                            <div class="mode-num">02</div>
                            <div class="mode-info">
                                <div class="mode-title">MODO: JUGADOR VS JUGADOR</div>
                                <div class="mode-desc">Combate local contra otro operador del sistema.</div>
                            </div>
                            <span class="material-symbols-outlined mode-icon">groups</span>
                        </div>

                        <!-- Option 03: AI vs AI -->
                        <div class="mode-row-btn" id="mode-cvc-btn">
                            <div class="mode-num">03</div>
                            <div class="mode-info">
                                <div class="mode-title">MODO: MÁQUINA VS MÁQUINA</div>
                                <div class="mode-desc">Simulación táctica automatizada para análisis de patrones.</div>
                            </div>
                            <span class="material-symbols-outlined mode-icon">smart_toy</span>
                        </div>

                    </div>
                </div>
            </div>
        `;
    },
    
    init(navigate) {
        // Back Button to Menu
        const backBtn = document.getElementById('mode-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                navigate('/');
            });
        }
        
        // Mode Selection triggers - PVC redirects to Config, others directly to Game
        const pvcBtn = document.getElementById('mode-pvc-btn');
        if (pvcBtn) {
            pvcBtn.addEventListener('click', () => {
                navigate('/config');
            });
        }

        const pvpBtn = document.getElementById('mode-pvp-btn');
        if (pvpBtn) {
            pvpBtn.addEventListener('click', () => {
                navigate('/game');
            });
        }

        const cvcBtn = document.getElementById('mode-cvc-btn');
        if (cvcBtn) {
            cvcBtn.addEventListener('click', () => {
                navigate('/game');
            });
        }
    }
};
