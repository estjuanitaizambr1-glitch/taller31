const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function dibujarViewport(xmin, ymin, xmax, ymax){

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.strokeRect(
        xmin,
        ymin,
        xmax - xmin,
        ymax - ymin
    );
}
function dibujarLinea(x1, y1, x2, y2, color){

    ctx.beginPath();

    ctx.moveTo(x1, y1);

    ctx.lineTo(x2, y2);

    ctx.strokeStyle = color;

    ctx.lineWidth = 3;

    ctx.stroke();
}