const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const sousTabs = document.querySelectorAll('.sousTab');
const sousTabContents = document.querySelectorAll('.sousTab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

sousTabs.forEach(sousTab => {
    sousTab.addEventListener('click', (event) => {
        const isActive = sousTab.classList.contains('sousTabActive');

        if (isActive) {
            sousTab.classList.remove('sousTabActive');
            event.target.classList.remove('sousTabActive');
        } else {
            sousTab.classList.add('sousTabActive');
            document.getElementById(event.target.id).classList.add('sousTabActive');
        }
    });
});
