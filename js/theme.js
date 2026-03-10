/* ─────────────────────────────────────────────────────────────
   THEME MANAGEMENT
   ───────────────────────────────────────────────────────────── */

class ThemeManager {
    constructor() {
        this.STORAGE_KEY = 'theme';
        this.LIGHT_MODE = 'light';
        this.DARK_MODE = 'dark';
        this.themeToggle = document.getElementById('theme-toggle');
        this.sunIcon = document.getElementById('sun-icon');
        this.moonIcon = document.getElementById('moon-icon');
        this.body = document.body;

        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.attachEventListeners();
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem(this.STORAGE_KEY) || this.LIGHT_MODE;
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        if (theme === this.DARK_MODE) {
            this.body.classList.remove('light-mode');
            this.body.classList.add('dark-mode');
            this.updateIcons(true);
        } else {
            this.body.classList.add('light-mode');
            this.body.classList.remove('dark-mode');
            this.updateIcons(false);
        }

        localStorage.setItem(this.STORAGE_KEY, theme);
    }

    toggleTheme() {
        const isDarkMode = this.body.classList.contains('dark-mode');
        const newTheme = isDarkMode ? this.LIGHT_MODE : this.DARK_MODE;
        this.setTheme(newTheme);
    }

    updateIcons(isDarkMode) {
        if (isDarkMode) {
            this.sunIcon.style.display = 'none';
            this.moonIcon.style.display = 'block';
        } else {
            this.sunIcon.style.display = 'block';
            this.moonIcon.style.display = 'none';
        }
    }

    attachEventListeners() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
}

export default ThemeManager;
