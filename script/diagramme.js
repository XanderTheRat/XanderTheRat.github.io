const svg = document.getElementById("svg");
const mainSvg = document.getElementById("svg");
const globalMenu = document.getElementById("menuContextuel");
const rectMenu = document.getElementById("rectContextMenu");
const contextMenu = document.getElementById("menuContextuel");

let isDrawing = true;
let draw = "";
let points = [];
let nbRect = 0;
let modifText = false;
let selectedRect = null;

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

    if (event.target.tagName === "rect" || event.target.tagName === "line") {
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
document.getElementById("addRectangle").addEventListener("click", () => {
    draw = "rectangle";
    isDrawing = true;
    contextMenu.style.display = "none";
});
document.getElementById("deleteRect").addEventListener("click", () => {
    if (selectedRect) {
        selectedRect.remove();
        hideMenus();
        selectedRect = null;
    }
});
document.getElementById("editRect").addEventListener("click", (event) => {
   if (!document.getElementById("rectMenuModif").classList.contains("active")) {
       document.getElementById("rectMenuModif").classList.add("active");
       document.getElementById("rectMenuModif").style.left = event.pageX;
       document.getElementById("rectMenuModif").style.top = event.pageY;
   }
});
document.getElementById("round").addEventListener("click", () => {
    const x = parseFloat(selectedRect.getAttribute("x"));
    const y = parseFloat(selectedRect.getAttribute("y"));
    const width = parseFloat(selectedRect.getAttribute("width"));
    const height = parseFloat(selectedRect.getAttribute("height"));

    const pathData = `
            M ${x} ${y} 
            H ${x + width} 
            V ${y + height - radius} 
            Q ${x + width} ${y + height}, ${x + width - radius} ${y + height} 
            H ${x + radius} 
            Q ${x} ${y + height}, ${x} ${y + height - radius} 
            Z
        `;
    selectedRect.setAttribute("d", pathData);
});
document.getElementById("square").addEventListener("click", () => {
    if (document.getElementById("round").classList.contains("roundBox")) {
        document.getElementById("round").classList.remove("roundBox");
    }
});



document.getElementById("main").addEventListener("click", function(event) {
   if (event.target.tagName.toLowerCase() === "rect") {
       rectId = event.target.id
       let text = document.getElementById("text-" + rectId);
       if (modifText){
           if (text) {
               text.textContent = prompt("Entrez le texte de la boite");
           }
           else {
               let x = parseFloat(event.target.getAttribute("x"));
               let y = parseFloat(event.target.getAttribute("y"));
               let width = parseFloat(event.target.getAttribute("width"));
               let height = parseFloat(event.target.getAttribute("height"));

               text = document.createElementNS("http://www.w3.org/2000/svg", "text");
               text.setAttribute("id", "text-" + rectId);
               text.setAttribute("x", x + width / 2);
               text.setAttribute("y", y + height / 2 + 5);
               text.setAttribute("text-anchor", "middle");
               text.setAttribute("dominant-baseline", "middle");
               text.setAttribute("fill", "black");
               text.setAttribute("font-size", "16px");
               text.textContent = prompt("Entrez le texte de la boite");
               document.getElementById("svg").appendChild(text);
           }
       }
       console.log("Text changé");


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
    svg.appendChild(line);
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
}
function showMenu(menu, x, y) {
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.display = "block";
}

function hideMenus() {
    globalMenu.style.display = "none";
    rectMenu.style.display = "none";
}

function fermerEdit() {
    document.getElementById("rectMenuModif").classList.remove("active");
    modifText = false;
}