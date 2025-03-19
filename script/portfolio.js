const lienTest = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/C/R2.04/TP3/TP3.c";



function testClick() {
    fetch(lienTest)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de chargement');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("showProgramme").innerHTML = `<pre>${escapeHtml(data)}</pre>`;
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}