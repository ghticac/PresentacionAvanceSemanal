/* ─────────────────────────────────────────────────────────────
   CARD TRANSITIONS — View Transition API expand/collapse
   ───────────────────────────────────────────────────────────── */

/* Lucide icon SVG inner markup (viewBox 0 0 24 24, stroke) */
const ITEM_ICONS = {
    clipboard: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    server: '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    'bar-chart': '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    'file-edit': '<path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10.4 12.6a2 2 0 0 0-3 3L12 21l4.5-1.5Z"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>'
};

function createItemIconSVG(iconName) {
    const markup = ITEM_ICONS[iconName];
    if (!markup) return null;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.classList.add('cd-item-icon');
    svg.innerHTML = markup;
    return svg;
}

/**
 * Pick the "hero" item — the one with most content (subitems weigh heavily).
 * Returns the index of the hero item.
 */
function getHeroIndex(items) {
    let maxScore = 0;
    let heroIdx = 0;
    items.forEach((item, idx) => {
        const text = typeof item === 'string' ? item : item.text;
        const subCount = item.subitems ? item.subitems.length : 0;
        const score = text.length + subCount * 100;
        if (score > maxScore) {
            maxScore = score;
            heroIdx = idx;
        }
    });
    return heroIdx;
}

class CardTransitions {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.activeDetail = null;
        this.isTransitioning = false;

        // Navigation state: circular sequence overview→card0→overview→card1→...
        this.cardOrder = ['primary', 'tertiary', 'info', 'amber'];
        this.navPosition = 0; // even=overview, odd=expanded card

        document.addEventListener('cardsRendered', () => {
            requestAnimationFrame(() => this.checkOverflows());
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); this.navigateNext(); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); this.navigatePrev(); }
        });
    }

    navigateNext() {
        if (this.isTransitioning) return;
        const total = this.cardOrder.length * 2;
        this.navPosition = (this.navPosition + 1) % total;
        this.applyNavState();
    }

    navigatePrev() {
        if (this.isTransitioning) return;
        const total = this.cardOrder.length * 2;
        this.navPosition = (this.navPosition - 1 + total) % total;
        this.applyNavState();
    }

    applyNavState() {
        const isExpanded = this.navPosition % 2 === 1;

        if (isExpanded) {
            const cardIdx = Math.floor(this.navPosition / 2);
            const cardId = this.cardOrder[cardIdx];
            const card = document.querySelector(`[data-card-id="${cardId}"]`);
            const cardData = this.dataManager.getCardData(cardId);
            if (!card || !cardData) return;

            if (this.activeDetail) {
                // Close current, then open next after transition
                this.isTransitioning = true;
                this.closeDetailAsync().then(() => {
                    this.expandCard(card, cardData);
                    this.isTransitioning = false;
                });
            } else {
                this.expandCard(card, cardData);
            }
        } else {
            if (this.activeDetail) {
                this.isTransitioning = true;
                this.closeDetail(false);
            }
        }
    }

    /** Returns a promise that resolves when the close transition finishes */
    closeDetailAsync(syncNav = false) {
        return new Promise(resolve => {
            if (!this.activeDetail) { resolve(); return; }
            const { overlay, sourceCard } = this.activeDetail;
            const panel = overlay.querySelector('.card-detail-panel');

            if (syncNav) {
                const cardIdx = this.cardOrder.indexOf(sourceCard.dataset.cardId);
                if (cardIdx >= 0) this.navPosition = cardIdx * 2;
            }

            if (!document.startViewTransition) {
                overlay.remove();
                this.activeDetail = null;
                resolve();
                return;
            }

            panel.style.viewTransitionName = 'card-expanding';
            const transition = document.startViewTransition(() => {
                panel.style.viewTransitionName = '';
                sourceCard.style.viewTransitionName = 'card-expanding';
                overlay.remove();
            });
            transition.finished.then(() => {
                sourceCard.style.viewTransitionName = '';
                this.activeDetail = null;
                resolve();
            });
        });
    }

    checkOverflows() {
        document.querySelectorAll('.card').forEach(card => {
            const inner = card.querySelector('.card-inner');
            if (!inner) return;

            const cardId = card.dataset.cardId;
            const cardData = this.dataManager.getCardData(cardId);
            if (!cardData) return;

            if (inner.scrollHeight > inner.clientHeight + 2) {
                card.classList.add('card--has-more');
            }

            this.makeExpandable(card, cardData);
        });
    }

    makeExpandable(card, cardData) {
        card.classList.add('card--expandable');
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Ver detalle: ${cardData.title}`);

        const btn = document.createElement('button');
        btn.className = 'card-expand-btn';
        btn.setAttribute('aria-hidden', 'true');
        btn.setAttribute('tabindex', '-1');
        btn.textContent = 'Ver todo ↗';
        card.querySelector('.card-inner').appendChild(btn);

        card.addEventListener('click', () => {
            if (this.activeDetail) return;
            this.expandCard(card, cardData);
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (this.activeDetail) return;
                this.expandCard(card, cardData);
            }
        });
    }

    expandCard(card, cardData) {
        const overlay = this.createOverlay(card, cardData);
        const panel = overlay.querySelector('.card-detail-panel');

        this.activeDetail = { overlay, sourceCard: card };

        // Sync nav position with manual click
        const cardIdx = this.cardOrder.indexOf(cardData.id);
        if (cardIdx >= 0) this.navPosition = cardIdx * 2 + 1;

        const slide = document.querySelector('.slide');

        if (!document.startViewTransition) {
            slide.appendChild(overlay);
            overlay.querySelector('.card-detail-close')?.focus();
            return;
        }

        card.style.viewTransitionName = 'card-expanding';

        const transition = document.startViewTransition(() => {
            card.style.viewTransitionName = '';
            panel.style.viewTransitionName = 'card-expanding';
            slide.appendChild(overlay);
        });

        transition.finished.then(() => {
            panel.style.viewTransitionName = '';
            overlay.querySelector('.card-detail-close')?.focus();
        });
    }

    createOverlay(sourceCard, cardData) {
        const overlay = document.createElement('div');
        overlay.className = 'card-detail-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', cardData.title);

        const backdrop = document.createElement('div');
        backdrop.className = 'card-detail-backdrop';
        backdrop.addEventListener('click', () => this.closeDetail());

        const panel = document.createElement('div');
        panel.className = `card-detail-panel ${cardData.colorClass}`;

        // 1. Top accent bar
        const accentBar = document.createElement('div');
        accentBar.className = 'cd-accent-bar';

        // 2. Header
        const header = document.createElement('div');
        header.className = 'cd-header';

        const headerLeft = document.createElement('div');
        headerLeft.className = 'cd-header-left';

        const iconClone = sourceCard.querySelector('.icon-box').cloneNode(true);
        iconClone.classList.add('cd-icon');

        const titleGroup = document.createElement('div');
        titleGroup.className = 'cd-title-group';

        const titleEl = document.createElement('div');
        titleEl.className = 'cd-title';
        titleEl.textContent = cardData.title;

        const weekEl = document.createElement('div');
        weekEl.className = 'cd-week';
        weekEl.textContent = this.dataManager.data?.metadata?.subtitle || '';

        titleGroup.appendChild(titleEl);
        titleGroup.appendChild(weekEl);
        headerLeft.appendChild(iconClone);
        headerLeft.appendChild(titleGroup);
        header.appendChild(headerLeft);

        // 3. Bento grid — hero item (most content) takes left full-height
        const grid = document.createElement('div');
        grid.className = 'cd-items-grid';

        const items = cardData.items;
        const heroIdx = items.length === 3 ? getHeroIndex(items) : -1;

        // Build ordered list: hero first (for grid placement), then rest
        const ordered = [];
        if (heroIdx >= 0) {
            ordered.push({ data: items[heroIdx], origIdx: heroIdx, isHero: true });
            items.forEach((item, i) => {
                if (i !== heroIdx) ordered.push({ data: item, origIdx: i, isHero: false });
            });
        } else {
            items.forEach((item, i) => ordered.push({ data: item, origIdx: i, isHero: false }));
            // For non-3 items: simple equal columns
            const cols = items.length <= 2 ? items.length : items.length === 4 ? 2 : 3;
            grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        }

        ordered.forEach(({ data: itemData, origIdx, isHero }, displayIdx) => {
            const itemText = typeof itemData === 'string' ? itemData : itemData.text;
            const subitems = typeof itemData === 'object' && itemData.subitems ? itemData.subitems : null;
            const iconName = typeof itemData === 'object' ? itemData.itemIcon : null;

            const miniCard = document.createElement('div');
            miniCard.className = 'cd-item-card';
            if (isHero) miniCard.classList.add('cd-hero');

            // Small number pill badge (absolute positioned)
            const badge = document.createElement('div');
            badge.className = 'cd-item-badge';
            badge.textContent = String(origIdx + 1).padStart(2, '0');

            // Body: large icon → title → desc → subitems
            const body = document.createElement('div');
            body.className = 'cd-item-body';

            // Large contextual icon
            if (iconName) {
                const iconSvg = createItemIconSVG(iconName);
                if (iconSvg) {
                    iconSvg.classList.add('cd-item-icon-lg');
                    body.appendChild(iconSvg);
                }
            }

            // Title (explicit or fallback to text)
            const titleText = typeof itemData === 'object' && itemData.title ? itemData.title : itemText;
            const titleEl = document.createElement('div');
            titleEl.className = 'cd-item-title';
            titleEl.textContent = titleText;
            body.appendChild(titleEl);

            // Description (only if title exists, text becomes desc)
            if (typeof itemData === 'object' && itemData.title) {
                const descEl = document.createElement('div');
                descEl.className = 'cd-item-desc';
                descEl.textContent = itemText;
                body.appendChild(descEl);
            }

            // Subitems
            if (subitems && subitems.length) {
                const ul = document.createElement('ul');
                ul.className = 'cd-subitems';
                subitems.forEach(sub => {
                    const li = document.createElement('li');
                    li.textContent = sub;
                    ul.appendChild(li);
                });
                body.appendChild(ul);
            }

            miniCard.appendChild(badge);
            miniCard.appendChild(body);
            grid.appendChild(miniCard);
        });

        // 4. Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'card-detail-close';
        closeBtn.setAttribute('aria-label', 'Cerrar');
        closeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
        closeBtn.addEventListener('click', () => this.closeDetail());

        // Inyectar fondo animado: clonar bg-beams, bg-blobs y glows del slide
        const beams = document.querySelector('.bg-beams');
        if (beams) {
            const clone = beams.cloneNode(true);
            clone.classList.remove('bg-beams');
            clone.classList.add('cd-bg-beams');
            panel.appendChild(clone);
        }
        const blobs = document.querySelector('.bg-blobs');
        if (blobs) {
            const clone = blobs.cloneNode(true);
            clone.classList.remove('bg-blobs');
            clone.classList.add('cd-bg-blobs');
            panel.appendChild(clone);
        }
        document.querySelectorAll('.glow-1, .glow-2, .glow-3, .glow-4').forEach(g => {
            const clone = g.cloneNode(true);
            clone.classList.add('cd-bg-glow');
            panel.appendChild(clone);
        });

        // Footer de colores (igual al del slide principal)
        const cdFooter = document.createElement('div');
        cdFooter.className = 'cd-footer-bar';
        ['cd-bar-1', 'cd-bar-2', 'cd-bar-3'].forEach(cls => {
            const bar = document.createElement('div');
            bar.className = cls;
            cdFooter.appendChild(bar);
        });

        panel.appendChild(accentBar);
        panel.appendChild(header);
        panel.appendChild(grid);
        panel.appendChild(cdFooter);
        panel.appendChild(closeBtn);

        overlay.appendChild(backdrop);
        overlay.appendChild(panel);

        overlay.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeDetail();
        });

        return overlay;
    }

    closeDetail(syncNav = true) {
        if (!this.activeDetail) return;
        const { overlay, sourceCard } = this.activeDetail;
        const panel = overlay.querySelector('.card-detail-panel');

        if (syncNav) {
            const cardIdx = this.cardOrder.indexOf(sourceCard.dataset.cardId);
            if (cardIdx >= 0) this.navPosition = cardIdx * 2;
        }

        if (!document.startViewTransition) {
            overlay.remove();
            this.activeDetail = null;
            this.isTransitioning = false;
            return;
        }

        panel.style.viewTransitionName = 'card-expanding';

        const transition = document.startViewTransition(() => {
            panel.style.viewTransitionName = '';
            sourceCard.style.viewTransitionName = 'card-expanding';
            overlay.remove();
        });

        transition.finished.then(() => {
            sourceCard.style.viewTransitionName = '';
            this.activeDetail = null;
            this.isTransitioning = false;
        });
    }
}

export default CardTransitions;
