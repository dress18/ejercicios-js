export function crearJugador(numero) {
  if (numero !== 1 && numero !== 2) {
    throw new Error("El número de jugador debe ser 1 o 2.");
  }

  return {
    numero,
    pedirMovimiento(tablero, indice) {
      if (!Number.isInteger(indice) || indice < 0 || indice > 8) {
        return null;
      }

      if (tablero[indice] !== 0) {
        return null;
      }

      return indice;
    },
  };
}
