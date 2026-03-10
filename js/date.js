/* ─────────────────────────────────────────────────────────────
   DATE MANAGEMENT
   ───────────────────────────────────────────────────────────── */

class DateManager {
    constructor() {
        this.months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        this.badgeElement = document.getElementById('fecha-badge');
        this.init();
    }

    init() {
        this.updateDate();
    }

    updateDate() {
        const today = new Date();
        const day = today.getDate();
        const month = this.months[today.getMonth()];
        this.badgeElement.textContent = `${day} de ${month}`;
    }

    getFormattedDate() {
        const today = new Date();
        const day = today.getDate();
        const month = this.months[today.getMonth()];
        return `${day} de ${month}`;
    }
}

export default DateManager;
