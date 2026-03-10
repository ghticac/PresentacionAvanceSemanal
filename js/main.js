/* ─────────────────────────────────────────────────────────────
   MAIN APPLICATION ENTRY POINT
   ───────────────────────────────────────────────────────────── */

import ThemeManager from './theme.js';
import DateManager from './date.js';
import SpotlightEffect from './spotlight.js';

/**
 * Initialize Application
 * Sets up all modules when DOM is ready
 */
function initializeApp() {
    // Initialize theme management
    new ThemeManager();

    // Initialize date management
    new DateManager();

    // Initialize spotlight effects
    new SpotlightEffect();

    console.log('Application initialized successfully');
}

// Wait for DOM to be fully loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
