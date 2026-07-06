// Centralized audio manager for Knight Energy
const SOUND_PATHS = {
    // Background Musics (BGM)
    bgm_menu: '/audio/Música_Titulo.mpeg',
    bgm_game: '/audio/Música_in_game.mpeg',
    
    // Sound Effects (SFX)
    sfx_select: '/audio/select.wav',
    sfx_move: '/audio/move.mp3',
    sfx_energy: '/audio/energy.mp3',
    sfx_point: '/audio/point.wav',
    sfx_penalty: '/audio/penalty.wav',
    sfx_win: '/audio/win.wav',
    sfx_lose: '/audio/lose.wav',
    sfx_hover: '/audio/hover.wav',
    sfx_click: '/audio/click.wav'
};

class AudioManager {
    constructor() {
        this.unlocked = false;
        this.currentBgmKey = null;
        /** @type {HTMLAudioElement|null} */
        this.currentBgmAudio = null;
        this.bgmVolume = parseFloat(localStorage.getItem('ke_volume') ?? '0.5');
        this.sfxVolume = parseFloat(localStorage.getItem('ke_volume') ?? '0.5');
        this.fadeInterval = null;

        // Auto-initialize browser autoplay and global interaction listeners
        this.initAutoplay();
        this.initInteractionListeners();
    }

    getVolume() {
        return this.bgmVolume;
    }

    setVolume(vol) {
        this.bgmVolume = Math.max(0, Math.min(1, vol));
        this.sfxVolume = this.bgmVolume; // Match BGM volume
        localStorage.setItem('ke_volume', String(this.bgmVolume));
        if (this.currentBgmAudio) {
            this.currentBgmAudio.volume = this.bgmVolume;
        }
    }

    /**
     * Unlocks the audio system on user interaction to satisfy browser autoplay policies.
     */
    unlock() {
        if (this.unlocked) return;
        this.unlocked = true;
        console.log("Audio system unlocked via user interaction.");
        
        // If there was a pending BGM to be played, start it
        if (this.currentBgmKey) {
            this.playBGM(this.currentBgmKey, true);
        }
    }

    playBGM(key, force = false) {
        if (!SOUND_PATHS[key]) {
            console.error(`BGM key "${key}" not found.`);
            return;
        }

        // If it's already playing, do nothing
        if (this.currentBgmKey === key && this.currentBgmAudio && !this.currentBgmAudio.paused) {
            return;
        }

        // Save intent to play
        this.currentBgmKey = key;

        // Stop current BGM / clear any active fades
        clearInterval(this.fadeInterval);
        this.stopBGM();

        // Load and play new BGM
        try {
            const audio = new Audio(SOUND_PATHS[key]);
            audio.loop = true;
            audio.volume = this.bgmVolume;
            this.currentBgmAudio = audio;
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.unlocked = true;
                }).catch(error => {
                    console.warn(`Autoplay blocked BGM "${key}" playback:`, error);
                });
            }
        } catch (e) {
            console.error(`Failed to play BGM "${key}":`, e);
        }
    }

    /**
     * Stops the currently playing background music.
     */
    stopBGM() {
        if (this.currentBgmAudio) {
            this.currentBgmAudio.pause();
            this.currentBgmAudio = null;
        }
    }

    /**
     * Fades out the current BGM music.
     */
    fadeBGM(duration = 1500) {
        if (!this.currentBgmAudio) return;
        clearInterval(this.fadeInterval);
        
        const steps = 30;
        const stepTime = duration / steps;
        let currentStep = 0;
        const startVol = this.currentBgmAudio.volume;
        const audio = this.currentBgmAudio;

        this.fadeInterval = setInterval(() => {
            currentStep++;
            const ratio = 1 - (currentStep / steps);
            audio.volume = Math.max(0, startVol * ratio);

            if (currentStep >= steps) {
                clearInterval(this.fadeInterval);
                audio.pause();
                audio.currentTime = 0;
                audio.volume = this.bgmVolume; // reset back
                if (this.currentBgmAudio === audio) {
                    this.currentBgmAudio = null;
                    this.currentBgmKey = null;
                }
            }
        }, stepTime);
    }

    /**
     * Plays a single sound effect. Can overlap.
     * @param {string} key - Key of the SFX from SOUND_PATHS
     */
    playSFX(key) {
        if (!SOUND_PATHS[key]) {
            console.error(`SFX key "${key}" not found.`);
            return;
        }

        try {
            const audio = new Audio(SOUND_PATHS[key]);
            audio.volume = this.sfxVolume;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.unlocked = true;
                }).catch(error => {
                    console.warn(`Failed to play SFX "${key}":`, error);
                });
            }
        } catch (e) {
            console.error(`Failed to play SFX "${key}":`, e);
        }
    }

    /**
     * Helper to play hover sound effect.
     */
    playHover() {
        this.playSFX('sfx_hover');
    }

    /**
     * Helper to play click sound effect.
     */
    playClick() {
        this.playSFX('sfx_click');
    }

    // --- Backward compatibility methods for audio.js ---

    playTitle() {
        this.playBGM('bgm_menu');
    }

    fadeTitle(duration = 1500) {
        this.fadeBGM(duration);
    }

    playGame() {
        this.playBGM('bgm_game');
    }

    stopGame() {
        this.stopBGM();
    }

    initAutoplay() {
        const startOnInteraction = () => {
            this.unlock();
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('keydown', startOnInteraction);
        };
        document.addEventListener('click', startOnInteraction);
        document.addEventListener('keydown', startOnInteraction);
    }

    initInteractionListeners() {
        // Listen for hover
        let lastHoveredElement = null;
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('button, .mode-row-btn, .tactical-chip, .board-size-btn, #header-logo-btn');
            if (target) {
                if (lastHoveredElement !== target) {
                    lastHoveredElement = target;
                    this.playHover();
                }
            } else {
                lastHoveredElement = null;
            }
        });

        // Listen for click
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, .mode-row-btn, .tactical-chip, .board-size-btn, #header-logo-btn');
            if (target) {
                this.playClick();
            }
        });
    }
}

// Single instance to use across pages
const audioManager = new AudioManager();
export default audioManager;
