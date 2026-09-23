# AimSimulator

**M1 · El Despertar del DOM — Web Development I, U-tad.**

Minijuego de puntería desarrollado con HTML, CSS y JavaScript puro, sin frameworks ni librerías. Cada ronda tiene diez disparos: el objetivo es conseguir la mayor precisión posible y, en caso de empate, el menor tiempo.

## Cómo probarlo

1. Descarga los archivos en una misma carpeta.
2. Abre `index.html` en el navegador o con Live Server en VS Code.
3. Pulsa **Empezar ronda** para iniciar el cronómetro y mostrar la diana.
4. Haz clic en la diana para sumar un acierto. Los clics en el fondo cuentan como fallos.
5. Al completar **diez disparos entre aciertos y fallos**, termina la ronda y aparece su resultado en la clasificación.

La diana cambia de posición cada vez que aciertas. **Reiniciar ronda** descarta la ronda en curso sin guardar su resultado. La tecla **N** activa o desactiva el modo oscuro.

La clasificación ordena las rondas por mayor precisión y, en caso de empate, por menor tiempo. Los resultados son locales y se borran al recargar la página.

La precisión se calcula como `aciertos / (aciertos + fallos) * 100`. Por ejemplo, siete aciertos y tres fallos equivalen al 70%.

## Archivos

| Archivo | Responsabilidad |
| --- | --- |
| `index.html` | Estructura, marcador, botones y clasificación. |
| `style.css` | Presentación, área de juego de 600 px de altura y modo oscuro. |
| `script.js` | Movimiento de la diana, eventos, puntuación, cronómetro y clasificación. |
| `README.md` | Instrucciones, uso de IA y decisiones de implementación. |

## Uso de IA

Partí de una versión propia de AimSimulator que ya incluía una diana móvil, un contador y el cálculo de posiciones aleatorias. Esa fue la base que aporté antes de esta revisión con IA.

Utilicé **ChatGPT (Codex)** como apoyo para comprender mejor el movimiento del botón dentro del div: calcular el espacio disponible, restar las dimensiones del botón y asignar posiciones mediante `left` y `top`.

También recibí propuestas de código para organizar los eventos y añadir el cronómetro, la clasificación y el modo oscuro. Pedí simplificar los estilos y comentar el código para poder entenderlo y defenderlo. Este README también se redactó con ayuda de IA.

Partí de un código propio que seleccionaba el botón, el contenedor y el contador mediante `getElementById`. Al pulsar la diana, aumentaba el contador y calculaba una nueva posición con `Math.random()`, restando las dimensiones del botón a las del contenedor para mantenerlo dentro.

A partir de esa base, fui desarrollando el juego con ayuda de ChatGPT: reorganizamos los eventos y añadimos rondas, fallos, precisión, cronómetro, reinicio y clasificación. También pedí simplificar el CSS, fijar el área de juego en 600 px de altura y explicar el código mediante comentarios para preparar la defensa.

La idea inicial y las preferencias de diseño y funcionamiento partieron de mí, incluida la elección de una altura de 600 px para el área de juego.

Fragmentos de prompts reales utilizados:

> Dame los nuevos cambios sin añadir excesivo código, solo con las implementaciones de la teoria

> Tambien vas a añadir un cronometro que temporice la ronda para que tenga sentido la leaderboard de rondas

Verifiqué el resultado jugando en el navegador y comprobando el movimiento de la diana dentro del contenedor, el recuento de aciertos y fallos, el cronómetro, el reinicio y el orden de la clasificación.

## Autopsia

1. **Diez disparos por ronda y precisión como criterio principal.** La versión inicial terminaba al alcanzar diez aciertos, por lo que todas las rondas acababan mostrando 10/10. Con diez disparos totales, los fallos afectan al resultado final. Se descartó ordenar únicamente por tiempo porque una ronda de fallos rápidos podría quedar por delante de una ronda precisa. El tiempo se utiliza como desempate.

2. **Medir el tiempo mediante la diferencia entre dos instantes.** La duración se calcula con `Date.now() - inicioRonda`; `setInterval()` solo actualiza el cronómetro visible. Se descartó sumar una cantidad fija en cada ejecución del intervalo porque el navegador puede retrasarla. Al terminar o reiniciar se utiliza `clearInterval()` para detener el intervalo anterior. Es una solución sencilla para este ejercicio, aunque depende del reloj del sistema.
