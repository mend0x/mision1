# AimSimulator

M1 · El Despertar del DOM — Web Development I, U-tad.

Un minijuego de puntería hecho con HTML, CSS y JavaScript puro. El objetivo cambia de posición cada vez que lo aciertas. Completa diez aciertos intentando fallar lo menos posible.

## Cómo probarlo

1. Descarga los archivos en una misma carpeta.
2. Abre `index.html` en el navegador o con Live Server en VS Code.
3. Pulsa **Empezar ronda** y haz clic en el círculo.
4. Los clics en el fondo durante la ronda cuentan como fallos.
5. Al llegar a diez aciertos, se guarda el resultado en el historial de la página.

**Reiniciar ronda** descarta la ronda en curso. El historial conserva solamente las rondas completadas y se borra al recargar. La tecla **N** activa o desactiva el modo oscuro. Los botones también funcionan con Tab y Enter o Espacio; la puntuación no distingue entre ratón y teclado.

La precisión se calcula como `aciertos / (aciertos + fallos) * 100`, redondeada al entero más cercano. Antes del primer disparo se muestra 0% para evitar dividir entre cero.

## Archivos

| Archivo | Responsabilidad |
| --- | --- |
| `index.html` | Estructura, botones, marcador y lista de resultados. Carga el script con `defer`. |
| `style.css` | Diseño adaptable, objetivo, cursor y modo oscuro. |
| `script.js` | Estado de la ronda, eventos y cambios en el DOM. |
| `README.md` | Uso, explicación de decisiones y declaración de IA. |

No requiere instalaciones, frameworks, librerías ni servicios externos.

## Relación con la rúbrica

| Criterio | Aplicación |
| --- | --- |
| DOM · 20 puntos | `querySelector` selecciona elementos, `textContent` modifica el marcador y `createElement` + `appendChild` crean resultados. |
| Eventos · 15 puntos | `addEventListener` para botones, delegación de clics en la caja, `keydown` y `resize`. Sin eventos inline. |
| Fundamentos JS · 15 puntos | `const`, `let`, números, booleanos, funciones, ámbito local, condicionales, comparación estricta y template literals. |
| Calidad · 10 puntos | Archivos separados y funciones para mover, calcular, actualizar, comenzar y terminar. |
| Originalidad · 10 puntos | Se desarrolla la idea inicial de AimSimulator con rondas, precisión e historial. |
| Bonus | `keydown` y `classList.toggle("oscuro")` activan el modo oscuro con N. |

Esta tabla localiza las implementaciones; no garantiza una puntuación. Las comprobaciones del repositorio y la defensa oral también forman parte de la evaluación.

## Uso de IA

Partí de una versión propia de AimSimulator con una diana móvil y un contador. Utilicé ChatGPT como apoyo para comprender mejor el movimiento del botón dentro del div: cómo calcular el espacio disponible, restar las dimensiones del botón y asignar posiciones aleatorias mediante `left` y `top`.

También recibí propuestas de código para ampliar, simplificar y comentar los archivos de cara a comprenderlos y defenderlos. Fui indicando los cambios que quería en el diseño y el funcionamiento.

La idea inicial y las decisiones sobre cómo quería desarrollar el juego partieron de mí; la IA me ayudó con explicaciones y propuestas de implementación.

Probé el juego en el navegador, comprobando el movimiento de la diana dentro del contenedor, el recuento de aciertos y fallos, el cronómetro, el reinicio y el orden de la clasificación.

## Pruebas

El asistente comprobó la sintaxis y la lógica mediante una simulación del DOM: puntuación, fin de ronda, reinicio, historial, tecla N y coordenadas con medidas simuladas. Estas pruebas pasaron. La comprobación visual en un navegador real quedó pendiente porque no se pudo descargar el navegador de pruebas.

Casos para reproducir en el navegador:

- Clic en la caja antes de empezar: no cambia el marcador.
- Una ronda con 10 aciertos y 1 fallo: muestra 91% y crea un único resultado.
- Clic después del final: no modifica el resultado.
- Reinicio a mitad de ronda: vuelve a cero sin guardar una ronda incompleta.
- Segunda ronda sin fallos: muestra 100% y conserva el resultado anterior.
- Tecla N: cambia de tema y permite volver al tema inicial.
- Ventana estrecha o cambio de tamaño: el objetivo queda dentro del área de juego.

## Autopsia

Estas son dos decisiones de la propuesta asistida que el autor debe revisar antes de entregar:

1. **Rondas de diez aciertos, sin temporizador.** Permiten terminar una partida y comparar la precisión con pocas variables. Se descartó una cuenta atrás porque añadiría gestión de temporizadores y reinicios que no es necesaria para esta idea. Como contrapartida, no se mide velocidad y una ronda puede durar indefinidamente.
2. **Un listener en la caja para aciertos y fallos.** El clic del botón sube al contenedor; `event.target === botonAim` permite distinguirlo de un clic en el fondo. Se descartaron listeners separados en botón y caja, que exigirían filtrar la propagación para no contar también un fallo al acertar. Esta comparación es suficiente porque el botón no contiene otros elementos HTML: si se añadiera un icono como hijo, habría que adaptar la detección, por ejemplo con `closest`.

## Conceptos para la defensa

- `const` impide reasignar la variable; no impide modificar el elemento DOM al que apunta.
- `let` permite cambiar los aciertos, los fallos y el estado de la ronda.
- `prepararJuego()` mantiene esas variables dentro de una función; los listeners conservan acceso a ellas mediante el ámbito léxico.
- `defer` ejecuta el script cuando el HTML ya se ha parseado.
- `textContent` escribe texto sin interpretarlo como HTML.
- `clientWidth` mide el ancho interior de la caja y `offsetWidth` el ancho del botón, incluido su borde. Su diferencia limita las coordenadas.
- El botón se muestra antes de medirlo: un elemento oculto no tiene el tamaño visible necesario para ese cálculo.
- `enPartida` bloquea la puntuación antes de empezar y después de terminar.
- El historial se construye con nodos nuevos; no se necesita un array porque no se recalculan ni reutilizan sus resultados.

## Antes de entregar

- [ ] Revisar el código y completar la declaración personal de Uso de IA.
- [ ] Reproducir las pruebas y poder explicar cada línea.
- [ ] Revisar y personalizar las dos decisiones de la Autopsia.
- [ ] Publicar el repositorio como público y comprobarlo en incógnito.
- [ ] Tener al menos cinco commits reales de avances y revisiones dentro de la carpeta entregada.
- [ ] Mantener el repositorio limpio, sin dependencias ni archivos temporales.
- [ ] Entregar la URL en la Arena seleccionando M1 · El Despertar del DOM.

Para continuar por fases: revisar estructura; entender y probar eventos; revisar rondas e historial; ajustar el diseño y el modo oscuro; completar documentación y pruebas. Guarda un commit cuando completes un cambio real. No reconstruyas un historial ficticio ni hagas commits vacíos para alcanzar el mínimo.