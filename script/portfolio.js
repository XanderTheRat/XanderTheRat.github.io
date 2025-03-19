let lienActif;
const lienDemineur = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/Python/Demineur_upgrade.py";
const lienChronometre = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/Python/Chronometre_amélioré.py";

function setLienDemineur() {
    lienActif = lienDemineur;
    afficherCode();
}
function setLienChronometre() {
    lienActif = lienChronometre;
    afficherCode();
}

document.addEventListener("keydown", function(event){
    if (event.key.toLowerCase() === "r") {
        document.getElementById("showProgramme").innerHTML = "> ...";
    }
});

function afficherCode() {
    fetch(lienActif)
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