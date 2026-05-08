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
// Reemplaza el arreglo escenas por este (cubre los 5 casos del algoritmo):
const escenas = [
    // Caso 1: Completamente DENTRO del viewport
    { x1: 250, y1: 200, x2: 550, y2: 300 },

    // Caso 2: Completamente FUERA (rechazo trivial, mismo lado)
    { x1: 650, y1: 100, x2: 750, y2: 450 },

    // Caso 3: Cruza UN borde (recorte por un extremo)
    { x1: 50,  y1: 250, x2: 400, y2: 250 },

    // Caso 4: Cruza DOS bordes opuestos (recorte en ambos extremos)
    { x1: 100, y1: 100, x2: 700, y2: 400 },

    // Caso 5: Cruza una ESQUINA (recorte diagonal, caso más complejo)
    { x1: 400, y1: 50,  x2: 400, y2: 450 }
];

let escenaActual = 0;

function primeraEscena() {
    escenaActual = 0;
    dibujarEscena();
}
function ultimaEscena() {
    escenaActual = escenas.length - 1;
    dibujarEscena();
}

function siguienteEscena() {
            escenaActual = (escenaActual + 1) % escenas.length;
            dibujarEscena();
        }

function anteriorEscena() {
            escenaActual = (escenaActual - 1 + escenas.length) % escenas.length;
            dibujarEscena();
        }

const INSIDE = 0;
const LEFT = 1;
const RIGHT = 2;
const BOTTOM = 4;
const TOP = 8;

function obtenerCodigo(x, y, xmin, ymin, xmax, ymax) {
            let c = INSIDE;
            if (x < xmin) c |= LEFT;
            else if (x > xmax) c |= RIGHT;
            if (y < ymin) c |= TOP;
            else if (y > ymax) c |= BOTTOM;
            return c;
        }

 function cohenSutherland(x1, y1, x2, y2, xmin, ymin, xmax, ymax) {
            let c1 = obtenerCodigo(x1, y1, xmin, ymin, xmax, ymax);
            let c2 = obtenerCodigo(x2, y2, xmin, ymin, xmax, ymax);
            let aceptar = false;


    while (true) {
                if ((c1 | c2) === 0) { aceptar = true; break; }
                else if ((c1 & c2) !== 0) { break; }
                else {
                    let x, y;
                    let cFuera = c1 !== 0 ? c1 : c2;

                    if (cFuera & TOP)         { x = x1 + (x2-x1)*(ymin-y1)/(y2-y1); y = ymin; }
                    else if (cFuera & BOTTOM) { x = x1 + (x2-x1)*(ymax-y1)/(y2-y1); y = ymax; }
                    else if (cFuera & RIGHT)  { y = y1 + (y2-y1)*(xmax-x1)/(x2-x1); x = xmax; }
                    else if (cFuera & LEFT)   { y = y1 + (y2-y1)*(xmin-x1)/(x2-x1); x = xmin; }

                    if (cFuera === c1) { x1 = x; y1 = y; c1 = obtenerCodigo(x1, y1, xmin, ymin, xmax, ymax); }
                    else               { x2 = x; y2 = y; c2 = obtenerCodigo(x2, y2, xmin, ymin, xmax, ymax); }
                }
            }
            return { aceptar, x1, y1, x2, y2 };
        }

function dibujarEscena(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    const xmin = parseInt(document.getElementById("xmin").value);

    const ymin = parseInt(document.getElementById("ymin").value);

    const xmax = parseInt(document.getElementById("xmax").value);

    const ymax = parseInt(document.getElementById("ymax").value);

    dibujarViewport(
        xmin,
        ymin,
        xmax,
        ymax
    );

    const linea = escenas[escenaActual];

    // LINEA ORIGINAL
    dibujarLinea(
        linea.x1,
        linea.y1,
        linea.x2,
        linea.y2,
        "gray"
    );
    const res = cohenSutherland(linea.x1, linea.y1, linea.x2, linea.y2, xmin, ymin, xmax, ymax);

     if (res.aceptar) {
         dibujarLinea(res.x1, res.y1, res.x2, res.y2, "green");
         dibujarLinea(linea.x1, linea.y1, res.x1, res.y1, "red");
         dibujarLinea(res.x2, res.y2, linea.x2, linea.y2, "red");
         }
    document.getElementById("info-escena").textContent =
                `${escenaActual + 1} de ${escenas.length}`;
            document.getElementById("info-original").textContent =
                `p1: (${linea.x1}, ${linea.y1})    p2: (${linea.x2}, ${linea.y2})`;

            if (res.aceptar) {
                document.getElementById("info-recorte").textContent =
                    `pc1: (${Math.round(res.x1)}, ${Math.round(res.y1)})    pc2: (${Math.round(res.x2)}, ${Math.round(res.y2)})`;
                document.getElementById("info-estado").textContent = "✅ Visible";
                document.getElementById("info-estado").style.color = "green";
            } else {
                document.getElementById("info-recorte").textContent = "—";
                document.getElementById("info-estado").textContent = "❌ Completamente fuera";
                document.getElementById("info-estado").style.color = "red";
            }
        }
dibujarEscena();