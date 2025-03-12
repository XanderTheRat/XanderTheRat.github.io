let caracters = "";

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("keydown", function(event){
        if (caracters.length > 200) {
            caracters.substring(caracters.length - 10, caracters.length);
        }
        caracters += event.key;
        if (caracters.toLowerCase().includes("shift") && caracters.toLowerCase().includes("alt")) {
            if (caracters.toLowerCase().includes("arrowleft") || caracters.toLowerCase().includes("arrowright")) {
                document.documentElement.style.setProperty("--overflowX", "hidden");
                caracters = "";
            }
            else if (caracters.toLowerCase().includes("arrowup") || caracters.toLowerCase().includes("arrowdown")) {
                document.documentElement.style.setProperty("--overflowY", "hidden");
                caracters = "";
            }
            else {
                document.documentElement.style.setProperty("--overflowX", "hidden");
                document.documentElement.style.setProperty("--overflowY", "hidden");
                caracters = "";
            }
        }
        else if (caracters.toLowerCase().includes("alt") && caracters.toLowerCase().includes("control")) {
            if (caracters.toLowerCase().includes("arrowleft") || caracters.toLowerCase().includes("arrowright")) {
                document.documentElement.style.setProperty("--overflowX", "auto");
                caracters = "";
            }
            else if (caracters.toLowerCase().includes("arrowup") || caracters.toLowerCase().includes("arrowdown")) {
                document.documentElement.style.setProperty("--overflowY", "auto");
                caracters = "";
            }
            else {
                document.documentElement.style.setProperty("--overflowX", "auto");
                document.documentElement.style.setProperty("--overflowY", "auto");
                caracters = "";
            }
        }
    });
});