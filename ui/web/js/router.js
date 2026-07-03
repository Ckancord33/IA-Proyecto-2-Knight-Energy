import Home from './pages/home.js';
import Settings from './pages/settings.js';
import Game from './pages/game.js';

const routes = {
    '/': Home,
    '/settings': Settings,
    '/game': Game
};

let container = null;

export function navigate(path) {
    if (!container) {
        container = document.getElementById('app-container');
    }
    
    const page = routes[path] || Home;
    
    // Update container content
    container.innerHTML = page.render();
    
    // Initialize page event listeners
    if (typeof page.init === 'function') {
        page.init(navigate);
    }
    
    // Update header active buttons states
    updateHeaderActiveState(path);
}

function updateHeaderActiveState(path) {
    const settingsBtn = document.getElementById('settings-view-btn');
    if (settingsBtn) {
        if (path === '/settings') {
            settingsBtn.classList.add('text-primary');
            settingsBtn.style.textShadow = '0 0 8px rgba(221, 183, 255, 0.8)';
        } else {
            settingsBtn.classList.remove('text-primary');
            settingsBtn.style.textShadow = 'none';
        }
    }
}

export function initRouter() {
    container = document.getElementById('app-container');
    // Load initial home page
    navigate('/');
}
