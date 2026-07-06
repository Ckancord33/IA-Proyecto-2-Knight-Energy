import { initRouter, navigate } from './router.js';
import { initMatrixRain } from './matrix.js';

import { AudioManager } from './audio.js';

// Expose navigate globally so any page module can call window.navigate(path)
window.navigate = navigate;

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
    const dropdown = document.getElementById('settings-dropdown');
    const volumeSlider = document.getElementById('volume-slider');
    const volumePct = document.getElementById('volume-pct');

    if (settingsBtn && dropdown) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        // Initialize slider values
        const currentVol = AudioManager.getVolume();
        volumeSlider.value = currentVol;
        volumePct.textContent = `${Math.round(currentVol * 100)}%`;

        // Handle volume change
        volumeSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            AudioManager.setVolume(val);
            volumePct.textContent = `${Math.round(val * 100)}%`;
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !settingsBtn.contains(e.target)) {
                dropdown.classList.remove('active');
            }
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
