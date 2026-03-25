/* ─────────────────────────────────────────────────────────────
   DATA MANAGER - Loads and renders card data from JSON
   ───────────────────────────────────────────────────────────── */

class DataManager {
    constructor() {
        this.data = null;
        this.loadData();
    }

    /**
     * Load data from JSON file
     */
    async loadData() {
        const grid = document.querySelector('.grid');

        // Show skeleton placeholders while loading
        if (grid) this._showSkeleton(grid);

        try {
            const response = await fetch('./data/data.json');
            if (!response.ok) throw new Error(`Failed to load data: ${response.status}`);
            this.data = await response.json();
            this.renderCards();
            this.updateMetadata();
            console.log('Data loaded successfully', this.data);
        } catch (error) {
            console.error('Error loading data:', error);
            if (grid) this._showError(grid);
        }
    }

    /**
     * Show skeleton loading placeholders
     */
    _showSkeleton(grid) {
        grid.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'card card--skeleton';
            skeleton.style.animationDelay = `${0.05 + i * 0.1}s`;
            skeleton.innerHTML = `
                <div class="card-inner" style="pointer-events:none">
                    <div class="card-header">
                        <div class="skeleton-box" style="width:36px;height:36px;border-radius:8px"></div>
                        <div class="skeleton-box" style="width:60%;height:14px;border-radius:4px"></div>
                    </div>
                    <div class="items" style="gap:8px;margin-top:6px">
                        <div class="skeleton-box" style="width:90%;height:11px;border-radius:3px"></div>
                        <div class="skeleton-box" style="width:75%;height:11px;border-radius:3px"></div>
                        <div class="skeleton-box" style="width:80%;height:11px;border-radius:3px"></div>
                    </div>
                </div>
            `;
            grid.appendChild(skeleton);
        }
    }

    /**
     * Show error state when data fails to load
     */
    _showError(grid) {
        grid.innerHTML = '';
        const errorEl = document.createElement('div');
        errorEl.className = 'data-error';
        errorEl.setAttribute('role', 'alert');
        errorEl.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style="margin:8px 0 4px;font-size:14px;font-weight:600;color:var(--text-primary)">No se pudieron cargar los datos</p>
            <p style="font-size:12px;color:var(--text-muted);margin:0 0 12px">Verifica tu conexión o que el archivo data.json sea accesible.</p>
            <button class="data-error-retry" onclick="location.reload()">Reintentar</button>
        `;
        grid.appendChild(errorEl);
    }

    /**
     * Render all cards from data
     */
    renderCards() {
        if (!this.data || !this.data.cards) return;

        const grid = document.querySelector('.grid');
        if (!grid) return;

        // Clear existing cards
        grid.innerHTML = '';

        // Create card for each data entry
        this.data.cards.forEach((cardData, index) => {
            const card = this.createCard(cardData, index);
            grid.appendChild(card);
        });

        document.dispatchEvent(new CustomEvent('cardsRendered', { bubbles: true }));
    }

    /**
     * Create a card element from card data
     */
    createCard(cardData, index) {
        const card = document.createElement('div');
        card.className = `card ${cardData.colorClass}`;
        card.dataset.cardId = cardData.id;
        card.style.animationDelay = `${0.05 + index * 0.1}s`;

        // Card border
        const cardBorder = document.createElement('div');
        cardBorder.className = 'card-border';

        // Card inner
        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';
        cardInner.setAttribute('data-glow-color', cardData.glowColor);

        // Card header
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';

        // Icon box with SVG
        const iconBox = document.createElement('div');
        iconBox.className = 'icon-box';
        iconBox.appendChild(this.createSVG(cardData.icon, cardData.strokeColor));

        // Card title
        const cardTitle = document.createElement('div');
        cardTitle.className = 'card-title';
        cardTitle.textContent = cardData.title;

        cardHeader.appendChild(iconBox);
        cardHeader.appendChild(cardTitle);

        // Items container
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'items';

        cardData.items.forEach((itemData, idx) => {
            // Handle both string and object formats
            const itemText = typeof itemData === 'string' ? itemData : itemData.text;
            const subitems = typeof itemData === 'object' && itemData.subitems ? itemData.subitems : null;

            // Main item
            const item = document.createElement('div');
            item.className = 'item';

            const num = document.createElement('span');
            num.className = 'num';
            num.textContent = `${idx + 1}.`;

            const text = document.createElement('span');
            text.textContent = itemText;

            item.appendChild(num);
            item.appendChild(text);
            itemsContainer.appendChild(item);

            // Subitems if they exist
            if (subitems && Array.isArray(subitems)) {
                subitems.forEach((subitemText) => {
                    const subitem = document.createElement('div');
                    subitem.className = 'item subitem';

                    const bullet = document.createElement('span');
                    bullet.className = 'bullet';
                    bullet.textContent = '•';

                    const subtext = document.createElement('span');
                    subtext.textContent = subitemText;

                    subitem.appendChild(bullet);
                    subitem.appendChild(subtext);
                    itemsContainer.appendChild(subitem);
                });
            }
        });

        cardInner.appendChild(cardHeader);
        cardInner.appendChild(itemsContainer);

        card.appendChild(cardBorder);
        card.appendChild(cardInner);

        return card;
    }

    /**
     * Create SVG element from icon data
     */
    createSVG(iconData, strokeColor) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', iconData.viewBox);
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', strokeColor);
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');

        // Add paths
        if (iconData.paths) {
            iconData.paths.forEach(pathData => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', pathData);
                svg.appendChild(path);
            });
        }

        // Add rects (for infrastructure icon)
        if (iconData.rects) {
            iconData.rects.forEach(rectData => {
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                Object.entries(rectData).forEach(([key, value]) => {
                    rect.setAttribute(key, value);
                });
                svg.appendChild(rect);
            });
        }

        // Add circles (for infrastructure icon)
        if (iconData.circles) {
            iconData.circles.forEach(circleData => {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                Object.entries(circleData).forEach(([key, value]) => {
                    circle.setAttribute(key, value);
                });
                svg.appendChild(circle);
            });
        }

        // Add ellipse (for database icon)
        if (iconData.ellipse) {
            const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            Object.entries(iconData.ellipse).forEach(([key, value]) => {
                ellipse.setAttribute(key, value);
            });
            svg.appendChild(ellipse);
        }

        // Add polylines (for development icon)
        if (iconData.polylines) {
            iconData.polylines.forEach(polylineData => {
                const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
                polyline.setAttribute('points', polylineData);
                svg.appendChild(polyline);
            });
        }

        return svg;
    }

    /**
     * Update page metadata from data
     */
    updateMetadata() {
        if (!this.data || !this.data.metadata) return;

        // Update page title if needed
        if (this.data.metadata.title) {
            const titleElement = document.querySelector('.title');
            if (titleElement) {
                titleElement.textContent = this.data.metadata.title;
            }
        }
    }

    /**
     * Get card data by ID
     */
    getCardData(cardId) {
        if (!this.data || !this.data.cards) return null;
        return this.data.cards.find(card => card.id === cardId);
    }

    /**
     * Update card data
     */
    updateCardData(cardId, updates) {
        const card = this.getCardData(cardId);
        if (card) {
            Object.assign(card, updates);
            this.renderCards();
        }
    }
}

export default DataManager;
