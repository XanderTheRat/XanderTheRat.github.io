const svg = document.getElementById("svg");
let points = [];

svg.addEventListener("click", (event) => {
    const x = event.clientX - svg.getBoundingClientRect().left;
    const y = event.clientY - svg.getBoundingClientRect().top;

    points.push({ x, y });

    if (points.length === 2) {
        drawLine(points[0], points[1]);
        points = []; // Réinitialiser
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