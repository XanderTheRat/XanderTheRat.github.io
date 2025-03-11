let upperCase = false;
let letter = "";
let boolNumber = false;
let boolRed = false;
let boolGreen = false;
let boolBlue = false;
let redValue = 0;
let greenValue = 0;
let blueValue = 0;
let sizeOfText = 300;
const exeption = ["Alt", "ContextMenu", "Control", "Home", "Shift", "End","Tab", "PageDown","PageUp","F10", "Meta","F9","F8","F7","F6","F5", "F4", "F3", "F2", "F1"]
const conteneur = document.getElementById("mainDiv");
const guide = document.getElementById("consoleDiv");

function setText() {
    /**
    * Procédure permettant de changer le texte de la div principale.
    */
    conteneur.textContent = letter;
}
function resetText() {
    /**
    * Fonction permettant de reset le texte de la div principale à 0
    */
    letter = "";
    setText();
}


document.addEventListener("keydown", function(event){
    if (!document.getElementById("mainDiv").classList.contains("actif")) return;
    else {


        //Afficher/cacher console
        if (conteneur.classList.contains("consoleDiv")) {

            if (letter.toLowerCase().includes("console.quit()")) {
                conteneur.classList.remove("consoleDiv");
                resetText();
            } else if (letter.toLowerCase().includes("console.home()")) {
                window.location.href = "index.html";
            }
            // Afficher/cacher le footer
            else if (letter.toLowerCase().includes("showfooter(") && event.key.toLowerCase() === ")") {
                document.getElementById("footerUselessThing").style.display = "flex";
            } else if (letter.toLowerCase().includes("hidefooter(") && event.key.toLowerCase() === ")") {
                document.getElementById("footerUselessThing").style.display = "none";
            }
            // Afficher/cacher le header
            else if (letter.toLowerCase().includes("showheader(") && event.key.toLowerCase() === ")") {
                document.getElementById("headerUselessThing").style.display = "flex";
            } else if (letter.toLowerCase().includes("hideheader(") && event.key.toLowerCase() === ")") {
                document.getElementById("headerUselessThing").style.display = "none";
            }
            // Paramétrer les couleurs
            else if (letter.toLowerCase().includes("resetred()")) {
                redValue = redValue - redValue;
                conteneur.textContent = "> Done.";
                letter = "";
            } else if (letter.toLowerCase().includes("resetgreen()")) {
                greenValue = greenValue - greenValue;
                conteneur.textContent = "> Done.";
                letter = "";
            } else if (letter.toLowerCase().includes("resetblue()")) {
                blueValue = blueValue - blueValue;
                conteneur.textContent = "> Done.";
                letter = "";
            } else if (letter.toLowerCase().includes("resetcolor()")) {
                redValue = redValue - redValue;
                greenValue = greenValue - greenValue;
                blueValue = blueValue - blueValue;
                conteneur.textContent = "> Done.";
                letter = "";
            } else if (letter.toLowerCase().includes("setred()")) {
                boolRed = true;
                resetText();
            } else if (letter.toLowerCase().includes("setgreen()")) {
                boolGreen = true;
                resetText();
            } else if (letter.toLowerCase().includes("setblue()")) {
                boolBlue = true;
                resetText();
            } else if (boolRed) {
                if ((event.key <= 9 || event.key >= 0) && redValue <= 255) {
                    redValue += event.key;
                    conteneur.textContent += redValue;
                } else if (event.key === "Enter") {
                    boolRed = false;
                    resetText();
                } else if (event.key === "Backspace") {
                    redValue = redValue.substring(0, sizeOfText.length - 1);
                    conteneur.textContent += redValue;
                } else if (event.key === "Delete") {
                    redValue = 0;
                    conteneur.textContent = redValue;
                }
            } else if (boolGreen) {
                if ((event.key <= 9 || event.key >= 0) && redValue <= 255) {
                    greenValue += event.key;
                    conteneur.textContent += greenValue;
                } else if (event.key === "Enter") {
                    boolGreen = false;
                    resetText();
                } else if (event.key === "Backspace") {
                    greenValue = redValue.substring(0, sizeOfText.length - 1);
                    conteneur.textContent += greenValue;
                } else if (event.key === "Delete") {
                    greenValue = 0;
                    conteneur.textContent = greenValue;
                }
            } else if (boolBlue) {
                if ((event.key <= 9 || event.key >= 0) && redValue <= 255) {
                    blueValue += event.key;
                    conteneur.textContent += blueValue;
                } else if (event.key === "Enter") {
                    boolBlue = false;
                    resetText();
                } else if (event.key === "Backspace") {
                    blueValue = redValue.substring(0, sizeOfText.length - 1);
                    conteneur.textContent += blueValue;
                } else if (event.key === "Delete") {
                    blueValue = 0;
                    conteneur.textContent = blueValue;
                }
            } else if (letter.toLowerCase().includes("getred()")) {
                if (redValue.length > 1) {
                    letter = redValue.substring(1, redValue.length);
                } else {
                    letter = redValue;
                }
                setText();
                letter = "";
            } else if (letter.toLowerCase().includes("getgreen()")) {
                if (greenValue.length > 1) {
                    letter = greenValue.substring(1, greenValue.length);
                } else {
                    letter = greenValue;
                }
                setText();
                letter = "";
            } else if (letter.toLowerCase().includes("getblue()")) {
                if (blueValue.length > 1) {
                    letter = blueValue.substring(1, blueValue.length);
                } else {
                    letter = blueValue;
                }
                setText();
                letter = "";
            } else if (letter.toLowerCase().includes("setbodycolor()")) {
                document.documentElement.style.setProperty("--radial-background", "rgb(" + redValue + "," + greenValue + "," + blueValue + ")");
                document.documentElement.style.setProperty("background", "var(--radial-background)");
                letter = "";
                setText();
            } else if (letter.toLowerCase().includes("settextcolor()")) {
                document.getElementById("mainDiv").style.setProperty("color", "rgb(" + redValue + "," + greenValue + "," + blueValue + ")");
                letter = "";
                setText();
            }

        } else {
            if (event.key === "ContextMenu") {
                conteneur.classList.add("consoleDiv");
                letter = "";
                setText();
            }
        }


        //Corps du script
        if (boolNumber) {
            if (event.key <= 9 || event.key >= 0) {
                sizeOfText += event.key;
            } else if (event.key === "Enter") {
                boolNumber = false;
                // On change la taille du texte saisie
                document.documentElement.style.setProperty('--sizeOfText', sizeOfText + "px");
                boolNumber = false;
            } else if (event.key === "Backspace") {
                sizeOfText = sizeOfText.substring(0, sizeOfText.length - 1);
                conteneur.textContent = letter;
            } else if (event.key === "Delete") {
                sizeOfText = 0;
                conteneur.textContent = letter;
            }
        }
        // Si ce n'est pas un chiffre à rentrer
        else {
            if (event.key === "CapsLock") {
                if (upperCase) {
                    upperCase = false
                    letter += event.key.toUpperCase();
                } else {
                    upperCase = true;
                    letter += event.key.toLowerCase();
                }
                letter = letter.substring(0, letter.length - 8);
            } else if (event.key === "Backspace") {
                letter = letter.substring(0, letter.length - 1);
                conteneur.textContent = letter;
            } else if (event.key === "Delete") {
                letter = "";
                conteneur.textContent = letter;
            } else if (event.key === "Enter") {
                letter += "";
            } else if (event.key === "Dead") {
                letter += "";
            } else if (event.key === "Insert") {
                sizeOfText = 0;
                boolNumber = true;
            } else if (exeption.includes(event.key)) {
                letter += "";
            } else {
                if (letter.length > 49) {
                    letter[1] = event.key;
                } else {
                    letter += event.key;
                    conteneur.textContent = letter;
                }
            }
        }
        if (letter.toLowerCase().includes("stryker")) {
            document.getElementById("easterEgg").textContent = "Yo bro.";
        } else {
            document.getElementById("easterEgg").textContent = "";
        }
    }
});


function showGuide() {
    /**
    * Fonction permettant d'afficher le guide d'utilisation
    */
    if (document.getElementById("mainDiv").classList.contains("actif")) {
        resetText();
        conteneur.classList.remove("actif");
        guide.style.setProperty("display", "flex");
        document.getElementById("showAdvice").style.setProperty("display", "none");
        document.getElementById("adviceOn").style.setProperty("display", "flex");
    }
    else {
        resetText();
        conteneur.classList.add("actif");
        guide.style.setProperty("display", "none");
    }
}
