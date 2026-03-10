/* ─────────────────────────────────────────────────────────────
   CARD SPOTLIGHT EFFECT
   ───────────────────────────────────────────────────────────── */

class SpotlightEffect {
    constructor() {
        this.spotlightColors = {
            'c-primary':  'rgba(74, 108, 247, 0.08)',
            'c-tertiary': 'rgba(106, 191, 75, 0.08)',
            'c-info':     'rgba(196, 41, 125, 0.08)',
            'c-amber':    'rgba(245, 166, 35, 0.08)',
        };

        this.init();
    }

    init() {
        this.attachSpotlights();
    }

    attachSpotlights() {
        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            const colorKey = this.getColorClass(card);
            const color = this.spotlightColors[colorKey] || 'rgba(255,255,255,0.06)';
            const spotlight = card.querySelector('.card-spotlight');

            if (!spotlight) return;

            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card, spotlight, color));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(spotlight));
        });
    }

    getColorClass(element) {
        const classes = Array.from(element.classList);
        return classes.find(c => c.startsWith('c-')) || 'c-primary';
    }

    handleMouseMove(event, card, spotlight, color) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        spotlight.style.background =
            `radial-gradient(circle 130px at ${x}px ${y}px, ${color} 0%, transparent 70%)`;
    }

    handleMouseLeave(spotlight) {
        spotlight.style.background = 'none';
    }
}

export default SpotlightEffect;
