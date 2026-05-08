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