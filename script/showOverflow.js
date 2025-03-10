let caracters = "";

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("keydown", function(event){
        if (caracters.length > 50) {
            caracters.substring(caracters.length - 10, caracters.length);
        }
        caracters += event.key;
        if (caracters.toLowerCase().includes("shift") && caracters.toLowerCase().includes("alt")) {
            document.documentElement.style.setProperty("--overflow", "hidden");
            caracters = "";
        }
        else if (caracters.toLowerCase().includes("alt") && caracters.toLowerCase().includes("control")) {
            document.documentElement.style.setProperty("--overflow", "auto");
            caracters = "";
        }
    });
});