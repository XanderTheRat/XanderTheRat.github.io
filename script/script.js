let Case = false;

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("keydown", function(event){
        if (event.key === "Backspace"){
            document.getElementById("mainDiv").textContent = ""
        }
        else {
            if (event.key === "Shift") {
                if (Case) {
                    Case = false
                }else{
                    Case = true;
                }
            }
            else {
                if (event.key === "Enter" || event.key === "Tab" || event.key === "Control" || event.key === "alt"){
                    if (event.key === "Enter") {
                        document.getElementById("mainDiv").textContent += "\n";
                    }
                    else {
                        document.getElementById("mainDiv").textContent += "";
                    }
                }
                else{
                    if (Case) {
                        document.getElementById("mainDiv").textContent += event.key.toUpperCase();
                    }
                    else {
                        document.getElementById("mainDiv").textContent += event.key.toLowerCase();
                    }
                }


            }

        }
    })
});