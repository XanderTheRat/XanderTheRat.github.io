let lienActif;
// Liens Python
const lienDemineur = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/Python/Demineur_upgrade.py";
const lienChronometre = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/Python/Chronometre_amélioré.py";
//Lien HTML/CSS/JS
const lienHalloweenIndex = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/web/Halloween/index.html";
const lienHalloweenCSS = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/web/Halloween/style/style.css";
const lienHalloweenJS = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/web/Halloween/script/script.js";

const lienXanderTheRatIndex = "https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/main/index.html";
const lienXanderTheRatPortfolio = "https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/main/portfolio.html";
const lienXanderTheRatAfficherTexte = "https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/main/afficherText.html";
const lienXanderTheRatResetCSS = "https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/main/style/cssReset.css";
const lienXanderTheRatMainCSS = "https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/main/style/main.css";
const lienXanderTheRatHorloge = "https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/main/script/horloge.js";
const lienXanderTheRatPortfolioJS = "https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/main/script/portfolio.js";
const lienXanderTheRatShowText = "https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/main/script/showText.js";
//Lien Bash

// Liens SQL : VGSales
const lienBDD1ACreation = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/SQL/BDD.sql";
const lienBBD1AExos = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/SQL/Exos.sql";
const lienInsertionVGSales = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/SQL/Requetes.sql";
const lienBDDRemplirVGSales = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/SQL/remplissage.sql";
const lienBDD1ACreationTablesVGSales = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/SQL/tables.sql";
//Lien Java : SAÉ Java FX

//Liens C
const lienTP1C = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/C/R2.04/TP1/TP1.c";
const lienTP2C = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/C/R2.04/TP2/tp2.c";
const lienTP3C = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main/C/R2.04/TP3/TP3.c";
//Liens PostGre SQL

// Autres variables

// Fonctions Python
function setLienDemineur() {
    lienActif = lienDemineur;
    afficherCode();
}
function setLienChronometre() {
    lienActif = lienChronometre;
    afficherCode();
}

// Fonction HTML/CSS/JS
function setLienIndexHalloween() {
    lienActif = lienHalloweenIndex;
    afficherCode();
}
function setLienCSSHalloween() {
    lienActif = lienHalloweenCSS;
    afficherCode();
}
function setLienJSHalloween() {
    lienActif = lienHalloweenJS;
    afficherCode();
}

function setLienIndexXanderTheRat() {
    lienActif = lienXanderTheRatIndex;
    afficherCode();
}
function setLienPortfolioXanderTheRat() {
    lienActif = lienXanderTheRatPortfolio;
    afficherCode();
}
function setLienAfficherTexte() {
    lienActif = lienXanderTheRatAfficherTexte;
    afficherCode();
}
function setLienResetCSS() {
    lienActif = lienXanderTheRatResetCSS;
    afficherCode();
}
function setLienMainCSS() {
    lienActif = lienXanderTheRatMainCSS;
    afficherCode();
}
function setLienHorloge() {
    lienActif = lienXanderTheRatHorloge;
    afficherCode();
}
function setLienPortfolioJS() {
    lienActif = lienXanderTheRatPortfolioJS;
    afficherCode();
}
function setLienShowText() {
    lienActif = lienXanderTheRatShowText;
    afficherCode();
}
//Fonctions SQL
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

//Fonctions C
function setLienTP1C() {
    lienActif = lienTP1C;
    afficherCode();
}
function setLienTP2C() {
    lienActif = lienTP2C;
    afficherCode();
}
function setLienTP3C() {
    lienActif = lienTP3C;
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

function collapsible(id) {
    if (document.getElementById(id).style.display === "none") {
        document.getElementById(id).style.display = "block";
        document.getElementById(id + "Collapsible").classList.add("collapsibleMinus")
    }else{
        document.getElementById(id).style.display = "none";
        document.getElementById(id + "Collapsible").classList.remove("collapsibleMinus")
    }
}