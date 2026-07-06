import { AudioManager } from '../audio.js';

export default {
    render() {
        return `
            <div class="home-page">
                <!-- Hero Header Section -->
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

                <!-- Tactical Action Menu -->
                <div class="home-menu-box">
                    <div class="menu-options">
                        <button class="tactical-btn" id="play-btn">
                            <span class="material-symbols-outlined">play_arrow</span>
                            <span>INICIAR PROTOCOLO JUGAR</span>
                            <div class="btn-overlay"></div>
                        </button>
                        <button class="tactical-btn" id="instructions-btn">
                            <span class="material-symbols-outlined">menu_book</span>
                            <span>INSTRUCCIONES DE PROTOCOLO</span>
                            <div class="btn-overlay"></div>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    init(navigate) {
        // Play title music when home page is initialized
        AudioManager.playTitle();

        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                AudioManager.fadeTitle(1500);
                navigate('/mode');
            });
        }

        const instructionsBtn = document.getElementById('instructions-btn');
        if (instructionsBtn) {
            instructionsBtn.addEventListener('click', () => {
                navigate('/instructions');
            });
        }
        
    }
};
