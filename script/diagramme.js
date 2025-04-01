const svg = document.getElementById("svg");
const contextMenu = document.getElementById("menuContextuel");
let isDrawing = true;
let draw = "";
let points = [];

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
    const x = event.clientX;
    const y = event.clientY;
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.display = "block";
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
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke", "white");
    rect.setAttribute("stroke-width", "1");
    svg.appendChild(rect);
}