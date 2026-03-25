/* ─────────────────────────────────────────────────────────────
   MAIN APPLICATION ENTRY POINT
   ───────────────────────────────────────────────────────────── */

import ThemeManager from './theme.js';
import DateManager from './date.js';
import DataManager from './data-manager.js';
import CardTransitions from './card-transitions.js';

/**
 * Initialize Application
 * Sets up all modules when DOM is ready
 */
function initializeApp() {
    // Initialize data loading (must be first — fires 'cardsRendered' when done)
    const dataManager = new DataManager();

    // Initialize theme management
    new ThemeManager();

    // Initialize date management
    new DateManager();

    // CardTransitions listens for 'cardsRendered'
    new CardTransitions(dataManager);

    console.log('Application initialized successfully');
}

// Wait for DOM to be fully loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
