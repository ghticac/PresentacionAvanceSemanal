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

    updateDate(dateOverride) {
        const d = dateOverride ? new Date(dateOverride + 'T12:00:00') : new Date();
        const day = d.getDate();
        const month = this.months[d.getMonth()];
        this.badgeElement.textContent = `${day} de ${month}`;
    }

    getFormattedDate(dateOverride) {
        const d = dateOverride ? new Date(dateOverride + 'T12:00:00') : new Date();
        const day = d.getDate();
        const month = this.months[d.getMonth()];
        return `${day} de ${month}`;
    }
}

export default DateManager;
