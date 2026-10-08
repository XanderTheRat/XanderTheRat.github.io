window.FedoraPanel = (function() {
    function init() {
        const clockEl = document.getElementById('panel-clock');
        function updateClock() {
            if (!clockEl) return;
            const now = new Date();
            const options = {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            };
            const timeStr = now.toLocaleDateString('fr-FR', options);
            clockEl.textContent = timeStr.replace(/\./g, '');
        }

        updateClock();
        setInterval(updateClock, 1000);

        const activitiesBtn = document.getElementById('panel-activities-btn');
        if (activitiesBtn) {
            activitiesBtn.addEventListener('click', () => {
                const overlay = document.getElementById('tree-window-overlay');
                if (overlay && !overlay.classList.contains('hidden')) {
                    if (window.TreeWindow && typeof window.TreeWindow.close === 'function') {
                        window.TreeWindow.close();
                    }
                } else if (window.TreeWindow && typeof window.TreeWindow.open === 'function') {
                    const currentPath = window.ShellState ? window.ShellState.getCurrentPath() : '/home/martin/github';
                    window.TreeWindow.open(currentPath);
                }
            });
        }
    }

    return {
        init
    };
})();
