export function marcarCasilla(tablero, indice, jugador) {
  // Validar que indice sea entero entre 0 y 8
  if (!Number.isInteger(indice) || indice < 0 || indice > 8) {
    return { ok: false, tablero, error: "Índice fuera del rango permitido."};
  }
  // Validar el jugador si sea 1 o 2
  if (jugador !== 1 && jugador !== 2) {
    return { ok: false, tablero, error: "El jugador debe ser 1 o 2."};
  }

  // Validar que la casilla este libre
  if (tablero[indice] !== 0) {
    return { ok: false, tablero, error: "La casilla " + indice + " ya está ocupada."};
  }
  
  const copia = [...tablero];
  copia[indice] = jugador;

  return { ok: true, tablero: copia, error: null };
}

