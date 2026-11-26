
import { crearPartida, jugarTurno } from "./js/reglas-juego.js";

console.log("Iniciando aplicación de Triki...");

const celdas = document.querySelectorAll(".casilla");
const mensaje = document.getElementById("mensaje");
const botonReiniciar = document.getElementById("reiniciar");

let partida = crearPartida();

console.log("Partida creada:", partida);

function renderizar() {
  console.log("Renderizando tablero...");

  const { tablero, resultado } = partida;

  console.log("Estado actual del tablero:", tablero);
  console.log("Resultado actual:", resultado);

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

    console.log("¡Victoria del jugador!", resultado.ganador);
    console.log("Línea ganadora:", resultado.linea);

  } else if (resultado.estado === "empate") {
    mensaje.textContent = "Empate.";

    console.log("La partida terminó en empate.");

  } else {
    const jugadorActual = partida.jugadores[partida.turno];

    mensaje.textContent = "Turno del jugador " + jugadorActual.numero;

    console.log("Turno del jugador:", jugadorActual.numero);
  }
}

celdas.forEach((celda) => {
  celda.addEventListener("click", () => {
    const indice = Number(celda.dataset.indice);

    console.log("Click en la casilla:", indice);

    const jugada = jugarTurno(partida, indice);

    console.log("Resultado de la jugada:", jugada);

    // Click inválido: se muestra el error y no se cambia el turno.
    if (!jugada.ok) {
      console.warn("Jugada inválida:", jugada.error);

      mensaje.textContent = jugada.error;
      return;
    }

    console.log("Jugada realizada correctamente.");
    console.log("Nuevo estado de la partida:", partida);

    renderizar();
  });
});

botonReiniciar.addEventListener("click", () => {
  console.log("Reiniciando partida...");

  partida = crearPartida();

  console.log("Nueva partida creada:", partida);

  renderizar();
});

renderizar();

console.log("Aplicación inicializada correctamente.");
