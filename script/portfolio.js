let lienActif;
const lienDemineur = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/Python/Demineur_upgrade.py";
const lienChronometre = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/Python/Chronometre_amélioré.py";
const lienBDD1ACreation = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/SQL/BDD.sql";
const lienBBD1AExos = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/SQL/Exos.sql";
const lienInsertionVGSales = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/SQL/Requetes.sql";
const lienBDDRemplirVGSales = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/SQL/remplissage.sql";
const lienBDD1ACreationTablesVGSales = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/SQL/tables.sql";

function setLienDemineur() {
    lienActif = lienDemineur;
    afficherCode();
}
function setLienChronometre() {
    lienActif = lienChronometre;
    afficherCode();
}


function setLienBDD1ACreation() {
    lienActif = lienBDD1ACreation;
    afficherCode();
}
function setLienBDD1AExos() {
    lienActif = lienBBD1AExos;
    afficherCode();
}
function setLienInsertionVGSales() {
    lienActif = lienInsertionVGSales;
    afficherCode();
}
function setLienBDDRemplirVGSales() {
    lienActif = lienBDDRemplirVGSales;
    afficherCode();
}
function setLienBDD1ACreationTablesVGSales() {
    lienActif = lienBDD1ACreationTablesVGSales;
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