let upperCase = false;
let letter = "";
let boolNumber = false
let sizeOfText = 300;
const exeption = ["Alt", "Control", "Home", "Shift", "End","PageDown","PageUp","F10","F9","F8","F7","F6","F5", "F4", "F3", "F2", "F1"]


document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("keydown", function(event){

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
                document.getElementById("mainDiv").textContent = letter;
            }
            else if (event.key === "Delete") {
                sizeOfText = 0;
                document.getElementById("mainDiv").textContent = letter;
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
                document.getElementById("mainDiv").textContent = letter;
            }
            else if (event.key === "Delete") {
                letter = "";
                document.getElementById("mainDiv").textContent = letter;
            }
            else if (event.key === "Enter") {
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
                letter += event.key;
                document.getElementById("mainDiv").textContent = letter;
            }
        }
        if (letter.length > 255) {
                letter[1] = event.key;
        }
        if (letter.toLowerCase().includes("stryker")) {
            document.getElementById("ForStryker").textContent = "Yo bro. N";
        }else {
            document.getElementById("ForStryker").textContent = "";
        }

    })
});