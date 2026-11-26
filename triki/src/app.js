import { crearPartida, jugarTurno } from "./js/reglas-juego.js";

const celdas = document.querySelectorAll(".casilla");
const mensaje = document.getElementById("mensaje");
const botonReiniciar = document.getElementById("reiniciar");

let partida = crearPartida();

function renderizar() {
  const { tablero, resultado } = partida;

  celdas.forEach((celda, indice) => {
    const ficha = tablero[indice];

    celda.textContent = ficha === 0 ? "" : ficha === 1 ? "X" : "O";
    celda.disabled = ficha !== 0 || resultado.estado !== "jugando";
    celda.classList.toggle(
      "ganadora",
      resultado.linea !== null && resultado.linea.includes(indice)
    );
  });

  if (resultado.estado === "victoria") {
    mensaje.textContent = "¡Ganó el jugador " + resultado.ganador + "!";
  } else if (resultado.estado === "empate") {
    mensaje.textContent = "Empate.";
  } else {
    const jugadorActual = partida.jugadores[partida.turno];
    mensaje.textContent = "Turno del jugador " + jugadorActual.numero;
  }
}

celdas.forEach((celda) => {
  celda.addEventListener("click", () => {
    const indice = Number(celda.dataset.indice);
    const jugada = jugarTurno(partida, indice);

    // Click inválido: se muestra el error y no se cambia el turno.
    if (!jugada.ok) {
      mensaje.textContent = jugada.error;
      return;
    }

    renderizar();
  });
});

botonReiniciar.addEventListener("click", () => {
  partida = crearPartida();
  renderizar();
});

renderizar();
