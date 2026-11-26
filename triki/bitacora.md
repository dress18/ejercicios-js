Funciones con js:
- marcar-casilla
- reglas-juego
- jugadores
- casos-victoria

y función main que reune todas esas y las implementa al tiempo aplicando metodo factory

### marcar-casilla
`[0, 0, 0, 0, 0, 0, 0, 0, 0]` -> Cada que un jugador marca una casilla ese índice dentro del arreglo cambia al número del jugador 1 o 2.

**Condiciones:**
- Si la marca al recorrerla es `0` (casilla libre), permite cambiarla al número del jugador (`1` o `2`).
- Si la casilla ya es `1` o `2`, no se permite marcar encima y se rechaza la jugada.
- El índice elegido debe estar dentro del rango válido del arreglo (`0` a `8`).
- Devuelve una copia actualizada del arreglo para no alterar directamente el estado anterior.

---

### casos-victoria
Evalúa el arreglo `[0, 0, 0, 0, 0, 0, 0, 0, 0]` comparando las 8 combinaciones ganadoras posibles (3 filas, 3 columnas y 2 diagonales).

**Condiciones:**
- Si tres posiciones de una línea ganadora tienen el mismo número distinto de `0` (`1` o `2`), ese jugador gana.
- Si ninguna línea gana y ya no quedan ceros (`0`) en el arreglo, la partida termina en empate.
- Si aún existen ceros (`0`) y nadie ha ganado, el juego continúa.

---

### jugadores
Aplica el **patrón Factory** (`crearJugador(tipo, numero)`) para construir distintos tipos de jugador (`1` o `2`) manteniendo la misma forma de pedir su movimiento.

**Condiciones:**
- Todos los jugadores creados por la fábrica deben devolver un índice válido (`0` a `8`) donde el arreglo tenga `0`.
- Jugador (`1`): recibe la casilla elegida manualmente por el usuario.
- Jugador (`2`): recibe la casilla elegida manualmente por el usuario.

---

### reglas-juego
Coordina el flujo de cada turno usando `marcar-casilla`, `jugadores` y `casos-victoria`, haciendo que tras cada movimiento del Jugador 1 siga automáticamente el Jugador 2.

**Condiciones:**
- Primero ejecuta y valida la marca del Jugador `1` sobre el arreglo.
- Si tras la jugada del Jugador `1` se cumple un caso de victoria o empate, se detiene la ronda y no juega el Jugador `2`.
- Si el juego sigue activo después del Jugador `1`, se dispara automáticamente el turno del Jugador `2` y se vuelve a evaluar el estado del arreglo.

---

### main
Función principal que reúne e implementa al tiempo `marcar-casilla`, `jugadores`, `reglas-juego` y `casos-victoria`.

**Condiciones:**
- Inicializa el tablero en `[0, 0, 0, 0, 0, 0, 0, 0, 0]` e instancia al Jugador `1` y al Jugador `2` desde la fábrica.
- Ejecuta el ciclo de rondas: recibe la jugada del Jugador `1`, aplica las reglas con respuesta automática del Jugador `2` y actualiza el arreglo en cada paso.
- Finaliza el ciclo en cuanto `casos-victoria` detecte victoria del `1`, victoria del `2` o empate.