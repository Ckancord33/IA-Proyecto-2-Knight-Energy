export default {
    render() {
        return `
            <div class="placeholder-page">
                <div class="terminal-monitor glow-border">
                    <div class="terminal-header">
                        <span class="text-primary uppercase font-bold tracking-wide">CONFIGURACIÓN DE PARÁMETROS</span>
                        <span class="text-secondary text-mono-data">[ESTADO: OFFLINE]</span>
                    </div>
                    <div class="terminal-text">
                        <p class="terminal-log-line text-primary">> ACCESANDO AL PROTOCOLO DE CONFIGURACIÓN...</p>
                        <p class="terminal-log-line">> Cargando variables del sistema...</p>
                        <p class="terminal-log-line">> ADVERTENCIA: La conexión con la lógica de negocio no está activa.</p>
                        <p class="terminal-log-line">> Próximamente se integrará aquí el panel táctico de personalización.</p>
                        <p class="terminal-log-line"><span class="text-primary">></span> <span class="cursor-blink">_</span></p>
                    </div>
                </div>
                
                <button class="terminal-back-btn" id="settings-back-btn">
                    <span class="material-symbols-outlined">logout</span>
                    <span>VOLVER AL MENÚ</span>
                </button>
            </div>
        `;
    },
    
    init(navigate) {
        const backBtn = document.getElementById('settings-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                navigate('/');
            });
        }
    }
};
