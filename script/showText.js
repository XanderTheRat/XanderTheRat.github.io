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
const exeption = ["Alt", "Control", "Home", "Shift", "End","Tab", "PageDown","PageUp","F10", "Meta","F9","F8","F7","F6","F5", "F4", "F3", "F2", "F1"]
const conteneur = document.getElementById("mainDiv");

function setText() {
    conteneur.textContent = letter;
}

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("keydown", function(event){
        //Afficher/cacher console
        if (conteneur.classList.contains("consoleDiv")) {
            if (letter.toLowerCase().includes("console.quit()")) {
                conteneur.classList.remove("consoleDiv");
                letter = "";
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
            else if (letter.substring(letter.lenght - 8, letter.lenght).includes("setred(") && event.key.toLowerCase() === ")") {
                boolRed = true;
            }
            else if (letter.substring(letter.lenght- 9, letter.lenght).includes("setgreen(") && event.key.toLowerCase() === ")") {
                boolGreen = true;
            }
            else if (letter.substring(letter.lenght - 8, letter.lenght).includes("setblue(") && event.key.toLowerCase() === ")") {
                boolBlue = true;
            }

            else if (boolRed) {
                if ((event.key <=9 || event.key >= 0) && redValue <= 255) {
                    redValue += event.key;
                    conteneur.textContent += redValue;
                }
                else if (event.key === "Enter") {
                    boolRed = false;
                }
                else if (event.key === "Backspace"){
                    redValue = redValue.substring(0, sizeOfText.length - 1);
                    conteneur.textContent += redValue;
                }
                else if (event.key === "Delete") {
                    redValue = 0;
                    conteneur.textContent += redValue;
                }
            }
            else if (boolGreen) {
                if ((event.key <=9 || event.key >= 0) && redValue <= 255) {
                    greenValue += event.key;
                    conteneur.textContent += greenValue;
                }
                else if (event.key === "Enter") {
                    boolGreen = false;
                }
                else if (event.key === "Backspace"){
                    greenValue = redValue.substring(0, sizeOfText.length - 1);
                    conteneur.textContent += greenValue;
                }
                else if (event.key === "Delete") {
                    greenValue = 0;
                    conteneur.textContent += greenValue;
                }
            }
            if (boolBlue) {
                if ((event.key <=9 || event.key >= 0) && redValue <= 255) {
                    blueValue += event.key;
                    conteneur.textContent += blueValue;
                }
                else if (event.key === "Enter") {
                    boolBlue = false;
                }
                else if (event.key === "Backspace"){
                    blueValue = redValue.substring(0, sizeOfText.length - 1);
                    conteneur.textContent += blueValue;
                }
                else if (event.key === "Delete") {
                    blueValue = 0;
                    conteneur.textContent += blueValue;
                }
            }else if (letter.toLowerCase().includes("getred()")) {
                letter = redValue;
                setText();
            }else if (letter.toLowerCase().includes("getgreen()")) {
                letter = greenValue;
                setText();
            }else if (letter.toLowerCase().includes("getblue()")) {
                letter = blueValue;
                setText();
            }

            else if (letter.toLowerCase().includes("setbodycolor()")) {
                document.documentElement.style.setProperty("--radialGradient", "radial-gradient(circle, rgba(" + redValue + ", " + greenValue + ", " + blueValue + ", 1) 0%, rgba(0, 0, 0, 1) 100%)");
                document.body.setAttribute("style", "background : auto")
                letter = "";
                setText();
            }

        }
        else {
            if (letter.toLowerCase().includes("console.add()")) {
                conteneur.classList.add("consoleDiv");
                letter = "";
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
                conteneur.textContent = letter;
            }
            else if (event.key === "Delete") {
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
                }else{
                    upperCase = true;
                    letter += event.key.toLowerCase();
                }
                letter = letter.substring(0, letter.length - 8);
            }
            else if (event.key === "Backspace"){
                letter = letter.substring(0, letter.length - 1);
                conteneur.textContent = letter;
            }
            else if (event.key === "Delete") {
                letter = "";
                conteneur.textContent = letter;
            }
            else if (event.key === "Enter") {
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
                    conteneur.textContent = letter;
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