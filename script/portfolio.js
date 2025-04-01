// Liens Python
const lienDemineur = "https://raw.githubusercontent.com/XanderTheRat/BUT1/portfolio/Python/Demineur_upgrade.py";
const lienChronometre = "https://raw.githubusercontent.com/XanderTheRat/BUT1/portfolio/Python/Chronometre_amélioré.py";
//Lien HTML/CSS/JS
const lienHalloweenIndex = "https://raw.githubusercontent.com/XanderTheRat/BUT1/portfolio/web/Halloween/index.html";
const lienHalloweenCSS = "https://raw.githubusercontent.com/XanderTheRat/BUT1/portfolio/web/Halloween/style/style.css";
const lienHalloweenJS = "https://raw.githubusercontent.com/XanderTheRat/BUT1/portfolio/web/Halloween/script/script.js";

const lienXanderTheRatIndex = "https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/portfolio/index.html";
const lienXanderTheRatPortfolio = "https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/portfolio/portfolio.html";
const lienXanderTheRatAfficherTexte = "https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/portfolio/afficherText.html";
const lienXanderTheRatResetCSS = "https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/portfolio/style/cssReset.css";
const lienXanderTheRatMainCSS = "https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/portfolio/style/main.css";
const lienXanderTheRatHorloge = "https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/portfolio/script/horloge.js";
const lienXanderTheRatPortfolioJS = "https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/portfolio/script/portfolio.js";
const lienXanderTheRatShowText = "https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/portfolio/script/showText.js";
//Lien Bash

// Liens SQL : VGSales
const lienBDD1ACreation = "https://raw.githubusercontent.com/XanderTheRat/BUT1/portfolio/SQL/BDD.sql";
const lienBBD1AExos = "https://raw.githubusercontent.com/XanderTheRat/BUT1/portfolio/SQL/Exos.sql";
const lienInsertionVGSales = "https://raw.githubusercontent.com/XanderTheRat/BUT1/portfolio/SQL/Requete.sql";
const lienBDDRemplirVGSales = "https://raw.githubusercontent.com/XanderTheRat/BUT1/portfolio/SQL/remplissage.sql";
const lienBDD1ACreationTablesVGSales = "https://raw.githubusercontent.com/XanderTheRat/BUT1/portfolio/SQL/tables.sql";
//Lien Java : SAÉ Java FX

//Liens C
const lienTP1C = "https://raw.githubusercontent.com/XanderTheRat/BUT1/portfolio/C/R2.04/TP1/TP1.c";
const lienTP2C = "https://raw.githubusercontent.com/XanderTheRat/BUT1/portfolio/C/R2.04/TP2/tp2.c";
const lienTP3C = "https://raw.githubusercontent.com/XanderTheRat/BUT1/portfolio/C/R2.04/TP3/TP3.c";
//Liens PostGre SQL

// Autres variables
let lienActif = lienDemineur;

// Fonctions Python
function setLienDemineur() {
    lienActif = lienDemineur;
    afficherCode("python");
}
function setLienChronometre() {
    lienActif = lienChronometre;
    afficherCode("python");
}

// Fonction HTML/CSS/JS
function setLienIndexHalloween() {
    lienActif = lienHalloweenIndex;
    afficherCode("html");
}
function setLienCSSHalloween() {
    lienActif = lienHalloweenCSS;
    afficherCode("css");
}
function setLienJSHalloween() {
    lienActif = lienHalloweenJS;
    afficherCode("javascript");
}

function setLienIndexXanderTheRat() {
    lienActif = lienXanderTheRatIndex;
    afficherCode("html");
}
function setLienPortfolioXanderTheRat() {
    lienActif = lienXanderTheRatPortfolio;
    afficherCode("html");
}
function setLienAfficherTexte() {
    lienActif = lienXanderTheRatAfficherTexte;
    afficherCode("html");
}
function setLienResetCSS() {
    lienActif = lienXanderTheRatResetCSS;
    afficherCode("css");
}
function setLienMainCSS() {
    lienActif = lienXanderTheRatMainCSS;
    afficherCode("css");
}
function setLienHorloge() {
    lienActif = lienXanderTheRatHorloge;
    afficherCode("css");
}
function setLienPortfolioJS() {
    lienActif = lienXanderTheRatPortfolioJS;
    afficherCode("javascript");
}
function setLienShowText() {
    lienActif = lienXanderTheRatShowText;
    afficherCode("javascript");
}
//Fonctions SQL
function setLienBDD1ACreation() {
    lienActif = lienBDD1ACreation;
    afficherCode("sql");
}
function setLienBDD1AExos() {
    lienActif = lienBBD1AExos;
    afficherCode("sql");
}
function setLienInsertionVGSales() {
    lienActif = lienInsertionVGSales;
    afficherCode("sql");
}
function setLienBDDRemplirVGSales() {
    lienActif = lienBDDRemplirVGSales;
    afficherCode("sql");
}
function setLienBDD1ACreationTablesVGSales() {
    lienActif = lienBDD1ACreationTablesVGSales;
    afficherCode("sql");
}

//Fonctions C
function setLienTP1C() {
    lienActif = lienTP1C;
    afficherCode("c");
}
function setLienTP2C() {
    lienActif = lienTP2C;
    afficherCode("c");
}
function setLienTP3C() {
    lienActif = lienTP3C;
    afficherCode("c");
}



document.addEventListener("keydown", function(event){
    if (event.key.toLowerCase() === "r") {
        document.getElementById("showProgramme").innerHTML = "> ...";
    }
});

function afficherCode(lang) {
    fetch(lienActif)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de chargement');
            }
            return response.text();
        })
        .then(data => {
            document.querySelector(".commande").innerHTML = `<pre><code class="language-${lang}">${escapeHtml(data)}</code></pre>`;
            document.querySelector(".commande").classList.add(`language-${lang}`);
            hljs.highlightElement(document.querySelector(".commande pre code"));
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    document.querySelector(".commande").classList.add(`language-${lang}`);
    hljs.highlightElement(document.querySelector(".commande pre code"));


}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function collapsible(id) {
    if (document.getElementById(id).style.display === "block") {
        document.getElementById(id).style.display = "none";
        document.getElementById(id + "Collapsible").classList.remove("collapsibleMinus")
    }else{
        document.getElementById(id).style.display = "block";
        document.getElementById(id + "Collapsible").classList.add("collapsibleMinus")
    }
}