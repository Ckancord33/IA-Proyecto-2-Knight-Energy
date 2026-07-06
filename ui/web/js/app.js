import { initRouter, navigate } from './router.js';
import { initMatrixRain } from './matrix.js';
import audioManager from './audioManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // Start background Matrix rain effect
    initMatrixRain();
    
    // Initialize the SPA router
    initRouter();
    
    // Setup audio unlock on first user interaction
    const unlockAudio = () => {
        audioManager.unlock();
        // Remove listeners after first interaction
        ['click', 'keydown', 'touchstart'].forEach(type => {
            window.removeEventListener(type, unlockAudio);
        });
    };
    ['click', 'keydown', 'touchstart'].forEach(type => {
        window.addEventListener(type, unlockAudio);
    });
    
    // Bind static header navigation buttons
    const logoBtn = document.getElementById('header-logo-btn');
    if (logoBtn) {
        logoBtn.addEventListener('click', () => {
            navigate('/');
        });
    }
    
    const settingsBtn = document.getElementById('settings-view-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            navigate('/settings');
        });
    }
    
    const terminalBtn = document.getElementById('terminal-view-btn');
    if (terminalBtn) {
        terminalBtn.addEventListener('click', () => {
            console.log("Terminal debug view requested.");
            // Optional: Show an overlay or visual notification
        });
    }
    
    // Play click/hover sound on buttons globally
    document.addEventListener('click', (e) => {
        const target = e.target.closest('button, .tactical-chip, .board-size-btn, .parameters-toggle-btn, #header-logo-btn, #settings-view-btn, .mode-row-btn, .tactical-back-btn');
        if (target) {
            // Avoid double sound on valid moves which play select sound
            if (!target.classList.contains('cell-valid-move')) {
                audioManager.playClick();
            }
        }
    });

    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('button, .tactical-chip, .board-size-btn, .parameters-toggle-btn, #header-logo-btn, #settings-view-btn, .mode-row-btn, .tactical-back-btn');
        if (target) {
            // Prevent repeated hover sounds during same focus
            if (target.dataset.soundHovered !== 'true') {
                target.dataset.soundHovered = 'true';
                audioManager.playHover();
                target.addEventListener('mouseleave', () => {
                    target.dataset.soundHovered = 'false';
                }, { once: true });
            }
        }
    });

    // Verify connection to the Python backend
    if (window.eel) {
        console.log("Eel instance detected. Testing connection...");
        window.eel.ping()((response) => {
            console.log("Eel connection test output:", response);
        });
    } else {
        console.warn("Eel library is offline. Running in browser-only mode.");
    }
});
