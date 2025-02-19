const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const sousTabs = document.querySelectorAll('.sousTab');

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
        const targetId = sousTab.getAttribute('data-tab');
        const targetDiv = document.querySelector(`.sousTab-content[id = "${targetId}"]`);

        if (isActive) {
            sousTab.classList.remove('sousTabActive');
            if (targetDiv) {
                targetDiv.classList.remove("sousTabActive");
            }
        }
        else {
            sousTab.classList.add('sousTabActive');
            if (targetDiv) {
                targetDiv.classList.add("sousTabActive");
            }
        }
    });
});
