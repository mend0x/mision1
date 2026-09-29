## Dificultad progresiva

Cada ronda utiliza la misma secuencia de tamaños:

- Disparos 1–3: diana de 60 × 60 píxeles.
- Disparos 4–6: diana de 50 × 50 píxeles.
- Disparos 7–10: diana de 40 × 40 píxeles.

El nivel depende del total de disparos, contando aciertos y fallos.
Así, fallar no permite mantener una diana grande durante más disparos.

La diana cambia de posición al acertar. Al fallar permanece en su
posición, aunque puede reducirse si corresponde avanzar de nivel.
Al comenzar o reiniciar una ronda se recupera el tamaño inicial.

Esta mejora se desarrolló con ayuda de ChatGPT, que propuso el código
y una prueba de lógica con DOM simulado. Esa prueba no sustituye la
comprobación visual del juego en el navegador.

### Decisión de diseño

Se eligió aumentar la dificultad dentro de cada ronda, en lugar de
aumentarla entre rondas, para que todas utilicen la misma progresión
de tamaños y sus resultados sean comparables bajo las mismas reglas.

Los tamaños se configuran en `tamanosDiana` y los disparos de cada
nivel en `disparosPorNivel`. El índice del nivel se limita al último
elemento del array para evitar acceder a un tamaño inexistente.