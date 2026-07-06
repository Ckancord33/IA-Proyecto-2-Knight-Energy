import { initRouter, navigate } from './router.js';
import { initMatrixRain } from './matrix.js';

document.addEventListener('DOMContentLoaded', () => {
    // Start background Matrix rain effect
    initMatrixRain();
    
    // Initialize the SPA router
    initRouter();
    
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
