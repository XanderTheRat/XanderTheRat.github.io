const tabs = document.querySelectorAll('.sousTab');
const tabContents = document.querySelectorAll('.tab-content');
const sousTabs = document.querySelectorAll('.sous-tabs');
const sousTabContents = document.querySelectorAll('.sous-tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

sousTabs.forEach(sousTab => {
    sousTab.addEventListener('click', () => {
        sousTabs.forEach(t => t.classList.remove('sousTabActive'));
        sousTabContents.forEach(content => content.classList.remove('sousTabActive'));

        sousTab.classList.add('sousTabActive');
        document.getElementById(sousTab.dataset.sousTab).classList.add('sousTabActive');
    });
});
