const svg = document.getElementById("svg");
const mainSvg = document.getElementById("svg");
const globalMenu = document.getElementById("menuContextuel");
const rectMenu = document.getElementById("rectContextMenu");
const contextMenu = document.getElementById("menuContextuel");

let isDrawing = true;
let modifText = false;
let draw = "";
let points = [];
let nbRect = 0;
let selectedRect = null;
let selectedText = null;
let Lines = [];
let nbLine = 0;

svg.addEventListener("click", (event) => {
    const x = event.clientX - svg.getBoundingClientRect().left;
    const y = event.clientY - svg.getBoundingClientRect().top;


    if (isDrawing){
        switch (draw) {
            case "line":
                points.push({x, y});
                if (points.length === 2) {
                    drawLine(points[0], points[1]);
                    points = [];
                    isDrawing = false;
                }
                break;
            case "rectangle":
                points.push({x, y});
                if (points.length === 2) {
                    drawRectangle(points[0], points[1]);
                    points = [];
                    isDrawing = false;
                }
                break;
            case "curvedLine":
                points.push({x, y});
                if (points.length === 2) {
                    drawCurvedLine(points[0], points[1]);
                    points = [];
                    isDrawing = false;
                }
                break;
            default:
                break;
        }
    }
    contextMenu.style.display = "none";


});

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});
mainSvg.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    hideMenus();

    if (event.target.tagName === "rect" || event.target.tagName === "line" || event.target.tagName === "path") {
        if (event.target.tagName === "rect") {
            document.getElementById("addChildForRectangle").style.display = "block";
        }
        selectedRect = event.target;
        showMenu(rectMenu, event.pageX, event.pageY);
    }else {
        showMenu(globalMenu, event.pageX, event.pageY);
    }
});
document.addEventListener("click", hideMenus);
document.addEventListener("click", () => {
    globalMenu.style.display = "none";
    rectMenu.style.display = "none";
});

document.getElementById("addLine").addEventListener("click", () => {
    draw = "line";
    isDrawing = true;
    contextMenu.style.display = "none";
});
document.getElementById("addCurvedLine").addEventListener("click", () => {
   draw = "curvedLine";
   isDrawing = true;
    contextMenu.style.display = "none";
});
document.getElementById("addRectangle").addEventListener("click", () => {
    draw = "rectangle";
    isDrawing = true;
    contextMenu.style.display = "none";
});
document.getElementById("deleteRect").addEventListener("click", () => {
    if (selectedRect) {
        let text = document.getElementById("text-" + selectedRect.id);
        if (text) {
            text.remove();
        }
        selectedRect.remove();
        hideMenus();
        selectedRect = null;
    }
});
document.getElementById("editRect").addEventListener("click", (event) => {
   if (!document.getElementById("rectMenuModif").classList.contains("active")) {
       document.getElementById("rectMenuModif").classList.add("active");
       document.getElementById("rectMenuModif").style.left = (event.clientX + 5).toString() + "px";
       document.getElementById("rectMenuModif").style.top = event.clientY.toString() + "px";
       console.log("X :" + event.clientX + " Y :" + event.clientY);
       console.log("X Actif :" + document.getElementById("rectMenuModif").style.left + " Y Actif :" + document.getElementById("rectMenuModif").style.top);
   }
});
document.getElementById("addChildForRectangle").addEventListener("click", (event) => {

});


document.getElementById("round").addEventListener("click", () => {
    selectedRect.setAttribute("rx", "50px");
});
document.getElementById("changerCouleurDeFond").addEventListener("click", () => {
   let couleur = prompt("Entrez la couleur de la boite");

   selectedRect.setAttribute("fill", couleur);
});
document.getElementById("changerCouleurDeBordure").addEventListener("click", () => {
    let couleur = prompt("Entrez la couleur des bordures la boite");

    selectedRect.setAttribute("stroke", couleur);
});
document.getElementById("changerCouleurDeTexte").addEventListener("click", () => {
    let couleur = prompt("Entrez la couleur du texte");

    let text = document.getElementById("text-" + selectedRect.id);
    if (text) {
        text.setAttribute("fill", couleur);
    }
});
document.getElementById("square").addEventListener("click", () => {
    let text = document.getElementById("text-" + selectedRect.id);
    if (text) {
        text.setAttribute("fill", "#000000");
        text.textContent = "";
    }
    selectedRect.setAttribute("fill", "#FFFFFF");
    selectedRect.setAttribute("stroke", "#FFFFFF");
    selectedRect.setAttribute("rx", "0px");

    hideMenus();

});

document.getElementById("changerTexte").addEventListener("click", () => {
    if (!selectedRect) {
        console.log("Aucune boîte sélectionnée");
    }

    const savedText = selectedRect.getAttribute("data-text");
    const rectId = selectedRect.id;
    let text = document.getElementById("text-" + rectId);
    let buffer;

    if (savedText) {
        buffer = savedText + " ";
    }
    else {
        buffer = "";
    }

    const handleKey = function(event) {

        event.preventDefault();
        if (event.key === "Enter") {
            event.preventDefault();

            if (event.shiftKey) {
                buffer += "\n";
            } else {
                updateSvgText(buffer, text);
                document.removeEventListener('keydown', handleKey);
                selectedRect.setAttribute("data-text", buffer);
            }
        } else if (event.code === "Space") {
            event.preventDefault();
            buffer += " ";
        } else if (event.key === "Backspace") {
            buffer = buffer.slice(0, -1);
        } else if (event.key === "Delete") {
            buffer = "";
        } else if (event.key.length === 1) {
            buffer += event.key;
        }

        updateSvgText(buffer, text);
    };

    if (!text) {
        const x = parseFloat(selectedRect.getAttribute("x"));
        const y = parseFloat(selectedRect.getAttribute("y"));
        const width = parseFloat(selectedRect.getAttribute("width"));
        const height = parseFloat(selectedRect.getAttribute("height"));

        text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("id", "text-" + rectId);
        text.setAttribute("x", x + width / 2);
        text.setAttribute("y", y + height / 2 + 5);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("fill", "black");
        text.setAttribute("font-size", "16px");
        text.setAttribute("font-family", "monospace");

        selectedRect.parentNode.insertBefore(text, selectedRect.nextSibling);
    } else {
        while (text.firstChild) {
            text.removeChild(text.firstChild);
        }
    }

    document.addEventListener('keydown', handleKey);

    hideMenus();
});

function updateSvgText(rawText, textElement) {
    while (textElement.firstChild) {
        textElement.removeChild(textElement.firstChild);
    }

    const lines = rawText.split("\n");
    lines.forEach((line, index) => {
        const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan.setAttribute("x", textElement.getAttribute("x"));
        tspan.setAttribute("dy", index === 0 ? "0" : "20");
        tspan.textContent = line;
        textElement.appendChild(tspan);
    });
}


document.getElementById("main").addEventListener("click", function(event) {
    if (event.target.tagName === "rect") {
        const rect = event.target;
        let textElement = rect.nextElementSibling;

        if (textElement && textElement.tagName !== "text") {
            textElement = null;
        }

        if (textElement) {
            selectedText = textElement;
            showMenu(rectMenu, event.pageX, event.pageY);
        }
    }
});



function drawLine(start, end) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", start.x);
    line.setAttribute("y1", start.y);
    line.setAttribute("x2", end.x);
    line.setAttribute("y2", end.y);
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", "2");

    while (Lines.includes(nbLine)) {
        nbLine++;
    }
    Lines.push(nbLine);

    line.setAttribute("id", `line${nbLine}`);
    svg.appendChild(line);

    objectsArePlacedCorrectly();
}

function drawCurvedLine(start, end) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const dx = start.x + end.x;
    const dy = start.y - end.y;

    const curve = .3;

    const midX1 = start.x + dx * curve;
    const midY1 = start.y;

    line.setAttribute("d", `M ${start.x} ${start.y} Q ${midX1} ${midY1}, ${end.x} ${end.y}`);
    line.setAttribute("stroke", "white");
    line.setAttribute("fill", "none");
    line.setAttribute("stroke-width", "2");

    while (Lines.includes(nbLine)) {
        nbLine++;
    }
    Lines.push(nbLine);

    line.setAttribute("id", `line${nbLine}`);
    svg.appendChild(line);

    objectsArePlacedCorrectly();
}

function drawRectangle(start, end) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    if (start.x > end.x) {
        const temp = start.x;
        start.x = end.x;
        end.x = temp;
    }
    if (start.y > end.y) {
        const temp = start.y;
        start.y = end.y;
        end.y = temp;
    }
    rect.setAttribute("x", start.x);
    rect.setAttribute("y", start.y);
    rect.setAttribute("width", Math.abs(start.x-end.x));
    rect.setAttribute("height", Math.abs(start.y-end.y));
    rect.setAttribute("fill", "#FFFFFF");
    rect.setAttribute("stroke", "white");
    rect.setAttribute("stroke-width", "1");
    rect.setAttribute("color", "#000000");
    rect.setAttribute("class", "rectangle");
    rect.setAttribute("id", `rect${nbRect}`);
    nbRect++;
    svg.appendChild(rect);

    objectsArePlacedCorrectly();
}
function objectsArePlacedCorrectly() {
    const svg = document.querySelector("svg");
    const lines = Array.from(svg.getElementsByTagName("line"));
    const rects = Array.from(svg.getElementsByTagName("rect"));

    lines.forEach(line => svg.removeChild(line));
    rects.forEach(rect => svg.removeChild(rect));

    lines.forEach(line => svg.appendChild(line));
    rects.forEach(rect => svg.appendChild(rect));
}

function showMenu(menu, x, y) {
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.display = "block";
}

function hideMenus() {
    globalMenu.style.display = "none";
    rectMenu.style.display = "none";

    document.getElementById("addChildForRectangle").style.display = "none";
}

function fermerEdit() {
    document.getElementById("rectMenuModif").classList.remove("active");
    modifText = false;
}