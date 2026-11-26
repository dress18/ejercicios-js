const COMBINACIONES_GANADORAS = [
  [0, 1, 2], // fila de arriba
  [3, 4, 5], // fila del medio
  [6, 7, 8], // fila de abajo
  [0, 3, 6], // columna izquierda
  [1, 4, 7], // columna del medio
  [2, 5, 8], // columna derecha
  [0, 4, 8], // diagonal 1
  [2, 4, 6], // diagonal 2
];

export function evaluarVictoria(tablero) {
  //Busca una linea con las fichas iguales y distintas de 0
  for (const linea of COMBINACIONES_GANADORAS) {
    const [a, b, c] = linea;
    const ficha = tablero[a];

    if (ficha !== 0 && ficha === tablero[b] && ficha === tablero[c]) {
      return { estado: "victoria", ganador: ficha, linea };
    }
  }

  //condición para el empate
  if (!tablero.includes(0)) {
    return { estado: "empate", ganador: null, linea: null };
  }

  // jugando
  return { estado: "jugando", ganador: null, linea: null };
}
