window.WaybarPanel = (function() {
    function init() {
        const clockEl = document.getElementById('custom-clock');
        const dateEl = document.getElementById('custom-date');

        function updateClockAndDate() {
            const now = new Date();
            if (clockEl) {
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                clockEl.textContent = hours + ':' + minutes + ':' + seconds;
            }
            if (dateEl) {
                const dateOptions = { weekday: 'short', day: '2-digit', month: 'short' };
                const dateStr = now.toLocaleDateString('fr-FR', dateOptions);
                dateEl.textContent = dateStr.replace(/\./g, '');
            }
        }

        updateClockAndDate();
        setInterval(updateClockAndDate, 1000);

        const workspaceButtons = document.querySelectorAll('#workspaces button');
        workspaceButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                workspaceButtons.forEach(b => b.classList.remove('active', 'focused'));
                btn.classList.add('active', 'focused');
            });
        });
    }

    return {
        init
    };
})();
window.FedoraPanel = window.WaybarPanel;
