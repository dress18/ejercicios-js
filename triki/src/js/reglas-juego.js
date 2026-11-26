import { marcarCasilla } from "./marcar-casilla.js";
import { evaluarVictoria } from "./casos-victoria.js";
import { crearJugador } from "./jugadores.js";

export function crearPartida() {
  return {
    tablero: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    jugadores: [crearJugador(1), crearJugador(2)],
    turno: 0,
    resultado: { estado: "jugando", ganador: null, linea: null },
  };
}

export function jugarTurno(partida, indice) {
  if (partida.resultado.estado !== "jugando") {
    return { ok: false, error: "La partida ya terminó.", jugador: null };
  }

  const jugador = partida.jugadores[partida.turno];

  const movimiento = jugador.pedirMovimiento(partida.tablero, indice);
  if (movimiento === null) {
    return { ok: false, error: "Casilla inválida u ocupada.", jugador: null };
  }

  // aplica la marca sobre una copia del tablero(arreglo)
  const marca = marcarCasilla(partida.tablero, movimiento, jugador.numero);
  if (!marca.ok) {
    return { ok: false, error: marca.error, jugador: null };
  }
  partida.tablero = marca.tablero;

  // evaluamos el estado de la partida
  partida.resultado = evaluarVictoria(partida.tablero);

  if (partida.resultado.estado === "jugando") {
    partida.turno = partida.turno === 0 ? 1 : 0;
  }

  return { ok: true, error: null, jugador: jugador.numero };
}
