let upperCase = false;
let letter = "";


document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("keydown", function(event){
        if (event.key === "Backspace"){
            letter = letter.substring(0, letter.length - 1);
            document.getElementById("mainDiv").textContent = letter;
        }
        else if (event.key === "Delete") {
            letter = "";
            document.getElementById("mainDiv").textContent = letter;
        }
        else if (event.key === "CapsLock") {
                if (upperCase) {
                    upperCase = false
                }else{
                    upperCase = true;
                }
            }
        else if (event.key === "CapsLock") {
            if (upperCase) {
                letter += event.key.toUpperCase();
            } else {
                letter += event.key.toLowerCase();
            }

        }
        else if (event.key === "Enter") {
            letter += "\n";
        }
        else {
            letter += event.key;
        }
        if (letter.length > 255) {
                letter[1] = event.key;
        }
        document.getElementById("mainDiv").textContent = letter;
    })
});