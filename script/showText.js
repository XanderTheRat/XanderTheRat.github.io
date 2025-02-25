const exeption = ["Alt", "Control", "Home", "Shift", "End","PageDown","PageUp","F10", "Meta","F9","F8","F7","F6","F5", "F4", "F3", "F2", "F1"]
const conteneur = document.getElementById("mainDiv");
let upperCase = false;
let letter = "";
let boolNumber = false
let sizeOfText = 300;

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
                setText();
            }
            // Afficher/cacher le footer
            else if (letter.toLowerCase().includes("showfooter(") && event.key.toLowerCase() === ")") {
                document.getElementById("footerUselessThing").style.display = "flex";
            }else if (letter.toLowerCase().includes("hidefooter(") && event.key.toLowerCase() === ")") {
                document.getElementById("footerUselessThing").style.display = "none";
            }
        }else {
            if (letter.toLowerCase().includes("console.add()")) {
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