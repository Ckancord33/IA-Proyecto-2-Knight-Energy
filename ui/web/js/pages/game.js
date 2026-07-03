export default {
    render() {
        return `
            <div class="placeholder-page">
                <div class="terminal-monitor glow-border">
                    <div class="terminal-header">
                        <span class="text-primary uppercase font-bold tracking-wide">TABLERO DE SIMULACIÓN TÁCTICA</span>
                        <span class="text-secondary text-mono-data">[ESTADO: DESCONECTADO]</span>
                    </div>
                    <div class="terminal-text">
                        <p class="terminal-log-line text-primary">> INICIANDO COMUNICACIÓN CON EL PROTOCOLO MAINFRAME...</p>
                        <p class="terminal-log-line">> Cargando matriz de celdas y posiciones de juego...</p>
                        <p class="terminal-log-line">> ADVERTENCIA: La conexión con la lógica del juego no está activa.</p>
                        <p class="terminal-log-line">> Próximamente se renderizará el tablero de 8x8 con las piezas blanca y negra (morada).</p>
                        <p class="terminal-log-line"><span class="text-primary">></span> <span class="cursor-blink">_</span></p>
                    </div>
                </div>
                
                <button class="terminal-back-btn" id="game-back-btn">
                    <span class="material-symbols-outlined">logout</span>
                    <span>VOLVER AL MENÚ</span>
                </button>
            </div>
        `;
    },
    
    init(navigate) {
        const backBtn = document.getElementById('game-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                navigate('/');
            });
        }
    }
};
