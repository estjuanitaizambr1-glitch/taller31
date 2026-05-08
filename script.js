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
const escenas = [

    {
        x1:100,
        y1:100,
        x2:700,
        y2:400
    },

    {
        x1:250,
        y1:200,
        x2:550,
        y2:300
    },

    {
        x1:50,
        y1:250,
        x2:300,
        y2:250
    },

    {
        x1:400,
        y1:50,
        x2:400,
        y2:450
    },

    {
        x1:650,
        y1:100,
        x2:750,
        y2:450
    }

];
let escenaActual = 0;

function siguienteEscena(){

    escenaActual++;

    if(escenaActual >= escenas.length){
        escenaActual = 0;
    }

    dibujarEscena();
}

function anteriorEscena(){

    escenaActual--;

    if(escenaActual < 0){
        escenaActual = escenas.length - 1;
    }

    dibujarEscena();
}
const INSIDE = 0;
const LEFT = 1;
const RIGHT = 2;
const BOTTOM = 4;
const TOP = 8;
function obtenerCodigo(x, y, xmin, ymin, xmax, ymax){

    let codigo = INSIDE;

    if(x < xmin){
        codigo |= LEFT;
    }

    else if(x > xmax){
        codigo |= RIGHT;
    }

    if(y < ymin){
        codigo |= TOP;
    }

    else if(y > ymax){
        codigo |= BOTTOM;
    }

    return codigo;
}
function cohenSutherland(x1, y1, x2, y2, xmin, ymin, xmax, ymax){

    let codigo1 = obtenerCodigo(x1, y1, xmin, ymin, xmax, ymax);

    let codigo2 = obtenerCodigo(x2, y2, xmin, ymin, xmax, ymax);

    let aceptar = false;

    while(true){

        if((codigo1 | codigo2) === 0){

            aceptar = true;
            break;
        }

        else if((codigo1 & codigo2) !== 0){

            break;
        }

        else{

            let x, y;

            let codigoFuera = codigo1 !== 0 ? codigo1 : codigo2;

            if(codigoFuera & TOP){

                x = x1 + (x2 - x1) * (ymin - y1) / (y2 - y1);

                y = ymin;
            }

            else if(codigoFuera & BOTTOM){

                x = x1 + (x2 - x1) * (ymax - y1) / (y2 - y1);

                y = ymax;
            }

            else if(codigoFuera & RIGHT){

                y = y1 + (y2 - y1) * (xmax - x1) / (x2 - x1);

                x = xmax;
            }

            else if(codigoFuera & LEFT){

                y = y1 + (y2 - y1) * (xmin - x1) / (x2 - x1);

                x = xmin;
            }

            if(codigoFuera === codigo1){

                x1 = x;
                y1 = y;

                codigo1 = obtenerCodigo(
                    x1,
                    y1,
                    xmin,
                    ymin,
                    xmax,
                    ymax
                );
            }

            else{

                x2 = x;
                y2 = y;

                codigo2 = obtenerCodigo(
                    x2,
                    y2,
                    xmin,
                    ymin,
                    xmax,
                    ymax
                );
            }
        }
    }

    return {
        aceptar,
        x1,
        y1,
        x2,
        y2
    };
}