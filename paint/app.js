const CELDA = 20;
const MIN_SIZE = 8;
const MAX_SIZE = 64;
const DEFAULT_COLS = 24;
const DEFAULT_ROWS = 16;

const PALETA = [
  "#000000",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#facc15",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const main = document.querySelector("main");

const colorPicker = document.getElementById("color-picker");
const palette = document.getElementById("palette");
const gridStatus = document.getElementById("grid-status");

const drawBtn = document.getElementById("draw-btn");
const eraseBtn = document.getElementById("erase-btn");
const rectangleBtn = document.getElementById("rectangle-btn");
const ellipseBtn = document.getElementById("ellipse-btn");
const pickerBtn = document.getElementById("picker-btn");
const clearBtn = document.getElementById("clear-btn");
const saveBtn = document.getElementById("save-btn");
const gridBtn = document.getElementById("grid-btn");

const optionsModal = document.getElementById("options-modal");
const gridForm = document.getElementById("grid-form");
const colsRange = document.getElementById("cols-range");
const rowsRange = document.getElementById("rows-range");
const colsOutput = document.getElementById("cols-output");
const rowsOutput = document.getElementById("rows-output");
const linesCheckbox = document.getElementById("lines-checkbox");
const modalCancel = document.getElementById("modal-cancel");

let columnas = DEFAULT_COLS;
let filas = DEFAULT_ROWS;
let matriz = crearMatriz(filas, columnas);

let herramientaActiva = "brush";
let color = "#000000";
let mostrarCuadricula = true;

let dibujando = false;
let ultimaCelda = null;
let inicioForma = null;
let copiaMatriz = null;

function crearMatriz(cantidadFilas, cantidadColumnas) {
  return Array.from({ length: cantidadFilas }, () =>
    Array(cantidadColumnas).fill(null)
  );
}

function copiarMatriz(origen) {
  return origen.map((fila) => fila.slice());
}

function redimensionarMatriz(
  origen,
  filasOrigen,
  columnasOrigen,
  filasDestino,
  columnasDestino
) {
  const nueva = crearMatriz(filasDestino, columnasDestino);

  for (let fila = 0; fila < filasDestino; fila++) {
    const filaOrigen = Math.min(
      filasOrigen - 1,
      Math.floor((fila * filasOrigen) / filasDestino)
    );

    for (let columna = 0; columna < columnasDestino; columna++) {
      const columnaOrigen = Math.min(
        columnasOrigen - 1,
        Math.floor((columna * columnasOrigen) / columnasDestino)
      );

      nueva[fila][columna] = origen[filaOrigen][columnaOrigen];
    }
  }

  return nueva;
}

function aplicarCuadricula(nuevasColumnas, nuevasFilas, lineas) {
  const columnasSeguras = limitar(nuevasColumnas, MIN_SIZE, MAX_SIZE);
  const filasSeguras = limitar(nuevasFilas, MIN_SIZE, MAX_SIZE);

  matriz = redimensionarMatriz(
    matriz,
    filas,
    columnas,
    filasSeguras,
    columnasSeguras
  );

  columnas = columnasSeguras;
  filas = filasSeguras;
  mostrarCuadricula = Boolean(lineas);

  canvas.width = columnas * CELDA;
  canvas.height = filas * CELDA;

  dibujarMatriz();
  actualizarEstado();
  ajustarLienzo();
}

function matrizVacia() {
  return matriz.every((fila) => fila.every((celda) => celda === null));
}

function dibujarMatriz() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let fila = 0; fila < filas; fila++) {
    for (let columna = 0; columna < columnas; columna++) {
      const colorCelda = matriz[fila][columna];
      if (!colorCelda) continue;

      ctx.fillStyle = colorCelda;
      ctx.fillRect(columna * CELDA, fila * CELDA, CELDA, CELDA);
    }
  }

  if (!mostrarCuadricula) return;

  ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();

  for (let columna = 1; columna < columnas; columna++) {
    const px = columna * CELDA + 0.5;
    ctx.moveTo(px, 0);
    ctx.lineTo(px, canvas.height);
  }

  for (let fila = 1; fila < filas; fila++) {
    const py = fila * CELDA + 0.5;
    ctx.moveTo(0, py);
    ctx.lineTo(canvas.width, py);
  }

  ctx.stroke();
}

function pintarCelda(fila, columna, valor) {
  if (fila < 0 || columna < 0 || fila >= filas || columna >= columnas) {
    return;
  }

  matriz[fila][columna] = valor;
}

function pintarLinea(desde, hasta, valor) {
  let columna0 = desde.columna;
  let fila0 = desde.fila;
  const columna1 = hasta.columna;
  const fila1 = hasta.fila;

  const dx = Math.abs(columna1 - columna0);
  const sx = columna0 < columna1 ? 1 : -1;
  const dy = -Math.abs(fila1 - fila0);
  const sy = fila0 < fila1 ? 1 : -1;
  let error = dx + dy;

  while (true) {
    pintarCelda(fila0, columna0, valor);

    if (columna0 === columna1 && fila0 === fila1) break;

    const e2 = 2 * error;

    if (e2 >= dy) {
      error += dy;
      columna0 += sx;
    }

    if (e2 <= dx) {
      error += dx;
      fila0 += sy;
    }
  }

  dibujarMatriz();
}


function aplicarForma(celdaFinal) {
  matriz = copiarMatriz(copiaMatriz);

  const columna0 = Math.min(inicioForma.columna, celdaFinal.columna);
  const columna1 = Math.max(inicioForma.columna, celdaFinal.columna);
  const fila0 = Math.min(inicioForma.fila, celdaFinal.fila);
  const fila1 = Math.max(inicioForma.fila, celdaFinal.fila);

  if (herramientaActiva === "rectangle") {
    for (let fila = fila0; fila <= fila1; fila++) {
      for (let columna = columna0; columna <= columna1; columna++) {
        pintarCelda(fila, columna, color);
      }
    }
  } else {
    /*
      Para el circulo
      La caja que forman la celda inicial y la final se usa como
      rectángulo contenedor. Dentro de esa caja:

      centroX = (columna0 + columna1 + 1) / 2
      centroY = (fila0 + fila1 + 1) / 2
      radioX  = (columna1 - columna0 + 1) / 2
      radioY  = (fila1 - fila0 + 1) / 2

      Una celda se pinta si su centro cumple:

      ((x - centroX) / radioX)² + ((y - centroY) / radioY)² <= 1

      Si la caja es cuadrada, radioX y radioY son iguales y sale un círculo.
      Si la caja es rectangular, sale una elipse.
    */

    const centroX = (columna0 + columna1 + 1) / 2;
    const centroY = (fila0 + fila1 + 1) / 2;
    const radioX = (columna1 - columna0 + 1) / 2;
    const radioY = (fila1 - fila0 + 1) / 2;

    for (let fila = fila0; fila <= fila1; fila++) {
      for (let columna = columna0; columna <= columna1; columna++) {
        const nx = (columna + 0.5 - centroX) / radioX;
        const ny = (fila + 0.5 - centroY) / radioY;

        if (nx * nx + ny * ny <= 1.0001) {
          pintarCelda(fila, columna, color);
        }
      }
    }
  }

  dibujarMatriz();
}

function ajustarLienzo() {
  const styles = getComputedStyle(main);
  const padX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
  const padY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
  const anchoDisponible = main.clientWidth - padX;
  const altoDisponible = main.clientHeight - padY;

  if (anchoDisponible <= 0 || altoDisponible <= 0) return;

  const escala = Math.min(
    anchoDisponible / canvas.width,
    altoDisponible / canvas.height
  );

  canvas.style.width = `${Math.max(1, Math.floor(canvas.width * escala))}px`;
  canvas.style.height = `${Math.max(1, Math.floor(canvas.height * escala))}px`;
}

function celdaDesdePuntero(event) {
  const rect = canvas.getBoundingClientRect();
  const columna = Math.floor(((event.clientX - rect.left) / rect.width) * columnas);
  const fila = Math.floor(((event.clientY - rect.top) / rect.height) * filas);

  return {
    fila: limitar(fila, 0, filas - 1),
    columna: limitar(columna, 0, columnas - 1),
  };
}

function valorPincelActual() {
  return herramientaActiva === "eraser" ? null : color;
}

canvas.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 && event.pointerType === "mouse") return;

  event.preventDefault();
  const celda = celdaDesdePuntero(event);

  if (herramientaActiva === "picker") {
    seleccionarColor(matriz[celda.fila][celda.columna] || "#ffffff");
    return;
  }

  if (herramientaActiva === "rectangle" || herramientaActiva === "ellipse") {
    canvas.setPointerCapture(event.pointerId);
    dibujando = true;
    inicioForma = celda;
    copiaMatriz = copiarMatriz(matriz);
    aplicarForma(celda);
    return;
  }

  canvas.setPointerCapture(event.pointerId);
  dibujando = true;
  ultimaCelda = celda;
  pintarLinea(celda, celda, valorPincelActual());
});

canvas.addEventListener("pointermove", (event) => {
  if (!dibujando) return;

  const celda = celdaDesdePuntero(event);

  if (herramientaActiva === "rectangle" || herramientaActiva === "ellipse") {
    aplicarForma(celda);
    return;
  }

  pintarLinea(ultimaCelda, celda, valorPincelActual());
  ultimaCelda = celda;
});

function terminarTrazo() {
  dibujando = false;
  ultimaCelda = null;
  inicioForma = null;
  copiaMatriz = null;
}

canvas.addEventListener("pointerup", terminarTrazo);
canvas.addEventListener("pointercancel", terminarTrazo);

const BOTONES_HERRAMIENTA = {
  brush: drawBtn,
  eraser: eraseBtn,
  rectangle: rectangleBtn,
  ellipse: ellipseBtn,
  picker: pickerBtn,
};

function seleccionarHerramienta(herramienta) {
  herramientaActiva = herramienta;

  Object.entries(BOTONES_HERRAMIENTA).forEach(([nombre, boton]) => {
    const activo = nombre === herramienta;
    boton.classList.toggle("active", activo);
    boton.setAttribute("aria-pressed", String(activo));
  });

  canvas.classList.toggle("picker-mode", herramienta === "picker");
}

Object.entries(BOTONES_HERRAMIENTA).forEach(([herramienta, boton]) => {
  boton.addEventListener("click", () => seleccionarHerramienta(herramienta));
});

function seleccionarColor(valor) {
  color = valor.toLowerCase();
  colorPicker.value = color;

  palette.querySelectorAll("button").forEach((boton) => {
    boton.classList.toggle("active", boton.dataset.color === color);
  });
}

colorPicker.addEventListener("input", (event) => seleccionarColor(event.target.value));

PALETA.forEach((hex) => {
  const muestra = document.createElement("button");
  muestra.type = "button";
  muestra.dataset.color = hex;
  muestra.style.backgroundColor = hex;
  muestra.title = hex;
  muestra.setAttribute("aria-label", `Usar color ${hex}`);
  muestra.addEventListener("click", () => seleccionarColor(hex));
  palette.appendChild(muestra);
});

clearBtn.addEventListener("click", () => {
  if (!matrizVacia() && !confirm("¿Quieres borrar todo el dibujo?")) {
    return;
  }

  matriz = crearMatriz(filas, columnas);
  dibujarMatriz();
});

saveBtn.addEventListener("click", () => {
  const celdaExportacion = 32;
  const salida = document.createElement("canvas");
  salida.width = columnas * celdaExportacion;
  salida.height = filas * celdaExportacion;

  const ctxSalida = salida.getContext("2d");
  ctxSalida.fillStyle = "#ffffff";
  ctxSalida.fillRect(0, 0, salida.width, salida.height);

  for (let fila = 0; fila < filas; fila++) {
    for (let columna = 0; columna < columnas; columna++) {
      const colorCelda = matriz[fila][columna];
      if (!colorCelda) continue;

      ctxSalida.fillStyle = colorCelda;
      ctxSalida.fillRect(
        columna * celdaExportacion,
        fila * celdaExportacion,
        celdaExportacion,
        celdaExportacion
      );
    }
  }

  salida.toBlob((blob) => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = `paint-${columnas}x${filas}.png`;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
});

function actualizarEstado() {
  gridStatus.textContent = `Matriz ${columnas} × ${filas}`;
}

function abrirModalCuadricula() {
  colsRange.value = String(columnas);
  rowsRange.value = String(filas);
  colsOutput.textContent = String(columnas);
  rowsOutput.textContent = String(filas);
  linesCheckbox.checked = mostrarCuadricula;
  optionsModal.showModal();
}

gridBtn.addEventListener("click", abrirModalCuadricula);

colsRange.addEventListener("input", () => {
  colsOutput.textContent = colsRange.value;
});

rowsRange.addEventListener("input", () => {
  rowsOutput.textContent = rowsRange.value;
});

gridForm.addEventListener("submit", (event) => {
  event.preventDefault();

  aplicarCuadricula(
    Number(colsRange.value),
    Number(rowsRange.value),
    linesCheckbox.checked
  );
  optionsModal.close();
});

modalCancel.addEventListener("click", () => optionsModal.close());

optionsModal.addEventListener("click", (event) => {
  if (event.target === optionsModal) optionsModal.close();
});

/* ---------- Utilidades e inicio ---------- */

function limitar(valor, min, max) {
  return Math.min(max, Math.max(min, valor));
}

canvas.width = columnas * CELDA;
canvas.height = filas * CELDA;
dibujarMatriz();
actualizarEstado();
seleccionarColor(color);
seleccionarHerramienta("brush");
ajustarLienzo();

if ("ResizeObserver" in window) {
  new ResizeObserver(ajustarLienzo).observe(main);
} else {
  window.addEventListener("resize", ajustarLienzo);
}
