// AudioManager for Knight Energy SPA
let currentVolume = parseFloat(localStorage.getItem('ke_volume') ?? '0.5');

const titleAudio = new Audio('/audio/Música_Titulo.mpeg');
titleAudio.loop = true;

const gameAudio = new Audio('/audio/Música_in_game.mpeg');
gameAudio.loop = true;

let activeTrack = null; // 'title' | 'game' | null
let fadeInterval = null;

// Apply volume helper
function applyVolume() {
    titleAudio.volume = currentVolume;
    gameAudio.volume = currentVolume;
}
applyVolume();

export const AudioManager = {
    getVolume() {
        return currentVolume;
    },

    setVolume(vol) {
        currentVolume = Math.max(0, Math.min(1, vol));
        localStorage.setItem('ke_volume', String(currentVolume));
        applyVolume();
    },

    playTitle() {
        if (activeTrack === 'title') return;
        
        // Stop any fading/active track
        clearInterval(fadeInterval);
        gameAudio.pause();
        gameAudio.currentTime = 0;

        activeTrack = 'title';
        titleAudio.volume = currentVolume;
        titleAudio.play().catch(err => {
            console.warn("Audio playback delayed until user interaction:", err);
        });
    },

    fadeTitle(duration = 1500) {
        if (activeTrack !== 'title') return;
        
        clearInterval(fadeInterval);
        const steps = 30;
        const stepTime = duration / steps;
        let currentStep = 0;
        const startVol = titleAudio.volume;

        fadeInterval = setInterval(() => {
            currentStep++;
            const ratio = 1 - (currentStep / steps);
            titleAudio.volume = Math.max(0, startVol * ratio);

            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                titleAudio.pause();
                titleAudio.currentTime = 0;
                titleAudio.volume = currentVolume; // Reset volume back for next play
                activeTrack = null;
            }
        }, stepTime);
    },

    playGame() {
        if (activeTrack === 'game') return;

        clearInterval(fadeInterval);
        titleAudio.pause();
        titleAudio.currentTime = 0;

        activeTrack = 'game';
        gameAudio.volume = currentVolume;
        gameAudio.play().catch(err => {
            console.warn("Audio playback delayed until user interaction:", err);
        });
    },

    stopGame() {
        if (activeTrack === 'game') {
            gameAudio.pause();
            gameAudio.currentTime = 0;
            activeTrack = null;
        }
    },

    initAutoplay() {
        const startOnInteraction = () => {
            if (activeTrack === 'title' && titleAudio.paused) {
                titleAudio.play().catch(() => {});
            } else if (activeTrack === 'game' && gameAudio.paused) {
                gameAudio.play().catch(() => {});
            }
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('keydown', startOnInteraction);
        };
        document.addEventListener('click', startOnInteraction);
        document.addEventListener('keydown', startOnInteraction);
    }
};

// Initialize autoplay listeners
AudioManager.initAutoplay();
