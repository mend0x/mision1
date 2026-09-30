# AimSimulator

**M1 · El Despertar del DOM — Web Development I, U-tad.**

Minijuego de puntería desarrollado con HTML, CSS y JavaScript puro,
sin frameworks ni librerías.

Cada ronda tiene diez disparos. El objetivo es conseguir la mayor
precisión posible y, en caso de empate, el menor tiempo. La diana
se hace más pequeña conforme avanza la ronda.

## Cómo probarlo

1. Descarga o clona el repositorio.
2. Abre `index.html` en el navegador o con Live Server en VS Code.
3. Pulsa **Empezar ronda** para iniciar el cronómetro y mostrar la diana.
4. Haz clic en la diana para sumar un acierto. Los clics en el fondo
   del área de juego cuentan como fallos.
5. Al completar diez disparos entre aciertos y fallos, termina la ronda
   y aparece su resultado en la clasificación.

La diana cambia de posición cada vez que aciertas. Al fallar permanece
en su posición, aunque puede reducirse si corresponde avanzar de nivel.

**Reiniciar ronda** descarta la ronda en curso sin guardar su resultado
y devuelve la dificultad al nivel inicial.

La tecla **N** activa o desactiva el modo oscuro. Mantenerla pulsada
no provoca cambios repetidos de tema.

Al cambiar el tamaño de la ventana durante una partida, se calcula
una nueva posición aleatoria para la diana.

Los resultados se guardan únicamente en memoria y se borran al
recargar la página.

## Puntuación y clasificación

La precisión se calcula así:

`aciertos / (aciertos + fallos) * 100`

El porcentaje se redondea al entero más cercano. Antes del primer
disparo se muestra un 0 % para evitar una división entre cero.

Por ejemplo, siete aciertos y tres fallos equivalen al 70 %.

La clasificación utiliza estos criterios:

1. Mayor precisión.
2. Si la precisión coincide, menor tiempo.
3. Si ambos valores coinciden, la ronda anterior permanece delante.

Cada resultado se inserta en su posición dentro del array con `splice`
y en la lista HTML con `insertBefore`. Los resultados anteriores
no se destruyen ni se vuelven a crear.

## Dificultad progresiva

Cada ronda utiliza la misma secuencia:

| Disparos | Nivel | Tamaño de la diana |
| --- | --- | --- |
| 1–3 | 1 | 60 × 60 píxeles |
| 4–6 | 2 | 50 × 50 píxeles |
| 7–10 | 3 | 40 × 40 píxeles |

El nivel depende del total de disparos, contando aciertos y fallos.
Así, fallar no permite mantener una diana grande durante más disparos.

Al comenzar o reiniciar una ronda se recupera el tamaño inicial.

La configuración está al principio de `prepararJuego()`:

- `meta`: número de disparos por ronda.
- `intervaloCronometro`: intervalo de actualización visual del tiempo.
- `tamanosDiana`: tamaños disponibles para los niveles.
- `disparosPorNivel`: disparos necesarios para avanzar de nivel.

Las instrucciones de la página se generan desde esa configuración.
El índice del nivel se limita al último elemento de `tamanosDiana`
para evitar acceder a un tamaño inexistente.

## Archivos

| Archivo | Responsabilidad |
| --- | --- |
| `index.html` | Estructura, marcador, botones y clasificación. |
| `style.css` | Presentación, área de juego de 600 px de altura, foco visible y modo oscuro. |
| `script.js` | Eventos, movimiento, dificultad, puntuación, cronómetro y clasificación. |
| `README.md` | Instrucciones, uso de IA, verificación y decisiones de diseño. |

## Uso de IA

Utilicé **ChatGPT (Codex)** como apoyo durante el desarrollo y la
revisión del proyecto.

### Base propia y trabajo manual

Partí de una versión propia de AimSimulator que ya incluía una diana
móvil, un contador y el cálculo de posiciones aleatorias.

Esa versión seleccionaba el botón, el contenedor y el contador mediante
`getElementById`. Al pulsar la diana, aumentaba el contador y calculaba
una nueva posición con `Math.random()`, restando las dimensiones del
botón a las del contenedor.

La idea inicial y las preferencias de diseño y funcionamiento
partieron de mí, incluida la elección de una altura de 600 px para
el área de juego.

Durante las revisiones fui incorporando los cambios a los archivos
locales y registrándolos mediante commits. Pedí conservar comentarios
didácticos para facilitar el estudio y la defensa del código.

### Qué delegué a la IA

ChatGPT propuso código y explicaciones para:

- Organizar el estado y las funciones dentro de `prepararJuego()`.
- Gestionar aciertos y fallos mediante delegación de eventos.
- Añadir rondas, precisión, cronómetro y reinicio.
- Construir la clasificación y mantenerla ordenada mediante inserción.
- Añadir el modo oscuro y controlar la repetición de la tecla.
- Generar los textos de instrucciones desde la configuración.
- Incorporar dificultad progresiva mediante distintos tamaños de diana.
- Revisar la coherencia entre HTML, JavaScript y documentación.

También recibí ayuda para redactar este README. El apoyo de IA abarcó
varias partes del proyecto, no únicamente la dificultad progresiva.

### Prompts clave

Dos instrucciones utilizadas durante el desarrollo fueron:

> Dame los nuevos cambios sin añadir excesivo código, solo con las implementaciones de la teoria

> Tambien vas a añadir un cronometro que temporice la ronda para que tenga sentido la leaderboard de rondas

### Cómo se verificó

Durante las revisiones comprobé el juego en el navegador: movimiento
de la diana, recuento de aciertos y fallos, cronómetro, reinicio y
clasificación. También confirmé el funcionamiento del cronómetro tras
extraer su intervalo a una constante.

Para la dificultad progresiva, ChatGPT ejecutó una prueba de lógica
con DOM simulado. Esa prueba comprobó:

- La secuencia de tamaños durante los diez disparos.
- La finalización de una ronda con todos los disparos fallados.
- La finalización de una ronda con todos los disparos acertados.
- La colocación del resultado con mayor precisión por delante.
- El reinicio de contadores y del tamaño de la diana.
- Que reiniciar una ronda no añade un resultado a la clasificación.

La prueba se ejecutó fuera del repositorio y no está incluida como
archivo de test. Valida esas rutas de lógica con un DOM simulado;
no verifica el aspecto visual ni sustituye una prueba en un navegador.

## Autopsia

### 1. Diez disparos totales y precisión como criterio principal

La versión inicial terminaba al alcanzar diez aciertos. Con diez
disparos totales, los fallos afectan directamente al resultado y
todas las rondas tienen el mismo número de oportunidades.

Se descartó ordenar únicamente por tiempo porque una ronda de
fallos rápidos podría quedar por delante de una ronda precisa.
Por eso la precisión es el criterio principal y el tiempo sirve
como desempate.

### 2. Medir el tiempo mediante la diferencia entre dos instantes

La duración se calcula con `Date.now() - inicioRonda`.
`setInterval()` únicamente actualiza el tiempo visible.

Se descartó sumar una cantidad fija en cada ejecución del intervalo
porque el navegador puede retrasarla. Al terminar o reiniciar
se utiliza `clearInterval()` para detener el intervalo anterior.

Al finalizar la ronda se vuelve a medir el tiempo, sin depender
del último refresco visible. Esta solución depende del reloj del
sistema; no utiliza un reloj monotónico.

### 3. Insertar cada resultado en su posición

Las rondas anteriores ya están ordenadas. Un bucle busca el primer
resultado al que supera la nueva ronda y se detiene con `break`.

Se inserta el objeto con `splice` y se crea únicamente su nuevo
elemento `li`, colocándolo con `insertBefore`.

Se eligió este enfoque frente a ordenar de nuevo todo el array y
reconstruir la lista completa. En el peor caso, la búsqueda recorre
todos los resultados y la inserción desplaza elementos del array:
no se considera una operación de coste constante.

### 4. Aumentar la dificultad dentro de cada ronda

Se eligió reducir la diana según los disparos realizados, contando
también los fallos.

Aumentar la dificultad solo al acertar permitiría mantener una
diana mayor al fallar. Aumentarla entre rondas haría que sus resultados
correspondiesen a dificultades diferentes.

Con la progresión actual, todas las rondas siguen la misma secuencia
de tamaños. Las posiciones continúan siendo aleatorias.

### 5. Reutilizar el botón de la diana

La diana se mantiene como un único botón. JavaScript modifica su
posición, sus dimensiones y su propiedad `hidden`.

Recrearlo en cada acierto implicaría crear y eliminar nodos sin
necesidad para esta mecánica. La delegación de eventos permite
gestionar los disparos desde el contenedor.

## Comprobaciones manuales para futuras revisiones

- Antes de empezar, los clics en el área no cuentan.
- Cada clic durante la ronda suma exactamente un acierto o un fallo.
- Tras el tercer disparo, la siguiente diana mide 50 × 50 píxeles.
- Tras el sexto disparo, la siguiente diana mide 40 × 40 píxeles.
- La ronda termina tras diez disparos y guarda un único resultado.
- Reiniciar devuelve el tamaño a 60 × 60 píxeles y pone los contadores a cero.
- La clasificación respeta precisión y desempate por tiempo.
- Mantener pulsada N no alterna continuamente el tema.
- Recargar la página borra los resultados, como indican las instrucciones.

## Limitaciones conocidas

- La clasificación no persiste al recargar.
- Al redimensionar durante una ronda, la diana cambia a una posición aleatoria.
- Si el contenedor fuese más pequeño que la diana, el cálculo actual
  podría producir coordenadas negativas.
- El tiempo depende del reloj del sistema.