// Centralized audio manager for Knight Energy

const SOUND_PATHS = {
    // Background Musics (BGM)
    bgm_menu: 'assets/sounds/Caballero_de_silicio.mp3',
    bgm_game: 'assets/sounds/Clockwork_Siege.mp3',
    
    // Sound Effects (SFX)
    sfx_select: 'assets/sounds/select.wav',
    sfx_move: 'assets/sounds/move.mp3',
    sfx_energy: 'assets/sounds/energy.mp3',
    sfx_point: 'assets/sounds/point.wav',
    sfx_penalty: 'assets/sounds/penalty.wav',
    sfx_win: 'assets/sounds/win.wav',
    sfx_lose: 'assets/sounds/lose.wav',
    sfx_hover: 'assets/sounds/hover.wav',
    sfx_click: 'assets/sounds/click.wav'
};

class AudioManager {
    constructor() {
        this.unlocked = false;
        this.currentBgmKey = null;
        /** @type {HTMLAudioElement|null} */
        this.currentBgmAudio = null;
        this.bgmVolume = 0.4;
        this.sfxVolume = 0.6;
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

        // Stop current BGM
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
}

// Single instance to use across pages
const audioManager = new AudioManager();
export default audioManager;
