const exeption = ["Alt", "Control", "Home", "Shift", "End","PageDown","PageUp","F10", "Meta","F9","F8","F7","F6","F5", "F4", "F3", "F2", "F1"]
const conteneur = document.getElementById("mainDiv");
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

function setText() {
    conteneur.textContent = letter;
}
function resetText() {
    letter = "";
    setText();
}

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("keydown", function(event){
        //Afficher/cacher console
        if (conteneur.classList.contains("consoleDiv")) {

            if (letter.toLowerCase().includes("console.quit()")) {
                conteneur.classList.remove("consoleDiv");
                letter = "";
                setText();
            }
            // Afficher/cacher le footer
            else if (letter.toLowerCase().includes("showfooter(") && event.key.toLowerCase() === ")") {
                document.getElementById("footerUselessThing").style.display = "flex";
            }else if (letter.toLowerCase().includes("hidefooter(") && event.key.toLowerCase() === ")") {
                document.getElementById("footerUselessThing").style.display = "none";
            }
            // Afficher/cacher le header
            else if (letter.toLowerCase().includes("showheader(") && event.key.toLowerCase() === ")") {
                document.getElementById("headerUselessThing").style.display = "flex";
            }else if (letter.toLowerCase().includes("hideheader(") && event.key.toLowerCase() === ")") {
                document.getElementById("headerUselessThing").style.display = "none";
            }
            // Paramétrer les couleurs
            else if (letter.toLowerCase().includes("resetred()")) {
                redValue = redValue - redValue;
                conteneur.textContent = "> Done.";
                letter = "";
            }
            else if (letter.toLowerCase().includes("resetgreen()")) {
                greenValue = greenValue - greenValue;
                conteneur.textContent = "> Done.";
                letter = "";
            }
            else if (letter.toLowerCase().includes("resetblue()")) {
                blueValue = blueValue - blueValue;
                conteneur.textContent = "> Done.";
                letter = "";
            }
            else if (letter.toLowerCase().includes("resetcolor()")) {
                redValue = redValue - redValue;
                greenValue = greenValue - greenValue;
                blueValue = blueValue - blueValue;
                conteneur.textContent = "> Done.";
                letter = "";
            }
            else if (letter.toLowerCase().includes("setred()")) {
                boolRed = true;
                resetText();
            }
            else if (letter.toLowerCase().includes("setgreen()")) {
                boolGreen = true;
                resetText();
            }
            else if (letter.toLowerCase().includes("setblue()")) {
                boolBlue = true;
                resetText();
            }

            else if (boolRed) {
                if ((event.key <=9 || event.key >= 0) && redValue <= 255) {
                    redValue += event.key;
                    conteneur.textContent += redValue;
                }
                else if (event.key === "Enter") {
                    boolRed = false;
                    resetText();
                }
                else if (event.key === "Backspace"){
                    redValue = redValue.substring(0, sizeOfText.length - 1);
                    conteneur.textContent += redValue;
                }
                else if (event.key === "Delete") {
                    redValue = 0;
                    conteneur.textContent = redValue;
                }
            }
            else if (boolGreen) {
                if ((event.key <=9 || event.key >= 0) && redValue <= 255) {
                    greenValue += event.key;
                    conteneur.textContent += greenValue;
                }
                else if (event.key === "Enter") {
                    boolGreen = false;
                    resetText();
                }
                else if (event.key === "Backspace"){
                    greenValue = redValue.substring(0, sizeOfText.length - 1);
                    conteneur.textContent += greenValue;
                }
                else if (event.key === "Delete") {
                    greenValue = 0;
                    conteneur.textContent = greenValue;
                }
            }
            else if (boolBlue) {
                if ((event.key <=9 || event.key >= 0) && redValue <= 255) {
                    blueValue += event.key;
                    conteneur.textContent += blueValue;
                }
                else if (event.key === "Enter") {
                    boolBlue = false;
                    resetText();
                }
                else if (event.key === "Backspace"){
                    blueValue = redValue.substring(0, sizeOfText.length - 1);
                    conteneur.textContent += blueValue;
                }
                else if (event.key === "Delete") {
                    blueValue = 0;
                    conteneur.textContent = blueValue;
                }
            }else if (letter.toLowerCase().includes("getred()")) {
                if (redValue.length > 1) {
                    letter = redValue.substring(1,redValue.length);
                }
                else {
                    letter = redValue;
                }
                setText();
                letter = "";
            }else if (letter.toLowerCase().includes("getgreen()")) {
                if (greenValue.length > 1) {
                    letter = greenValue.substring(1,greenValue.length);
                }else {
                    letter = greenValue;
                }
                setText();
                letter = "";
            }else if (letter.toLowerCase().includes("getblue()")) {
                if (blueValue.length > 1) {
                    letter = blueValue.substring(1, blueValue.length);
                }else {
                    letter = blueValue;
                }
                setText();
                letter = "";
            }
            else if (letter.toLowerCase().includes("setbodycolor()")) {
                document.documentElement.style.setProperty("--radial-background", "rgb(" + redValue + "," + greenValue + "," + blueValue + ")");
                document.documentElement.style.setProperty("background", "var(--radial-background)");
                letter = "";
                setText();
            }
            else if (letter.toLowerCase().includes("settextcolor()")) {
                document.getElementById("mainDiv").style.setProperty("color", "rgb(" + redValue + "," + greenValue + "," + blueValue + ")");
                letter = "";
                setText();
            }

        }
        else {
            if (event.key === "ContextMenu") {
                conteneur.classList.add("consoleDiv");
                letter = "";
                setText();
            }
        }



        //Corps du script
        if (boolNumber) {
            if (event.key <=9 || event.key >= 0) {
                sizeOfText += event.key;
            }
            else if (event.key === "Enter") {
                boolNumber = false;
                // On change la taille du texte saisie
                document.documentElement.style.setProperty('--sizeOfText', sizeOfText + "px");
                boolNumber = false;
            }
            else if (event.key === "Backspace"){
                sizeOfText = sizeOfText.substring(0, sizeOfText.length - 1);
                setText();
            }
            else if (event.key === "Delete") {
                sizeOfText = 0;
                setText();
            }
        }
        // Si ce n'est pas un chiffre à rentrer
        else {
            if (event.key === "CapsLock") {
                if (upperCase) {
                    upperCase = false
                    letter += event.key.toUpperCase();
                }else{
                    upperCase = true;
                    letter += event.key.toLowerCase();
                }
                letter = letter.substring(0, letter.length - 8);
            }
            else if (event.key === "Backspace"){
                letter = letter.substring(0, letter.length - 1);
                setText();
            }
            else if (event.key === "Delete") {
                letter = "";
                setText()
            }
            else if (event.key === "Enter" || event.key === "Tab") {
                letter += "";
            }
            else if (event.key == "Dead") {
                letter += "";
            }
            else if (event.key === "Insert") {
                sizeOfText = 0;
                boolNumber = true;
            }
            else if (exeption.includes(event.key)) {
                letter += "";
            }
            else {
                if (letter.length > 49) {
                    letter[1] = event.key;
                }else {
                    letter += event.key;
                    setText()
                }
            }
        }
        if (letter.toLowerCase().includes("stryker")) {
            document.getElementById("ForStryker").textContent = "Yo bro. N";
        }else {
            document.getElementById("ForStryker").textContent = "";
        }

    })
});