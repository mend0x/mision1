"use strict";

// Agrupamos el juego en una función para mantener su estado en un ámbito local.
function prepararJuego() {
    // Seleccionamos una sola vez los elementos que vamos a utilizar.
    // const evita reasignar estas referencias, pero permite modificar los elementos.
    const caja = document.querySelector("#CajaEspacio");
    const diana = document.querySelector("#botonAim");
    const iniciar = document.querySelector("#iniciar");
    const mensaje = document.querySelector("#mensaje");
    const salidaAciertos = document.querySelector("#aciertos");
    const salidaFallos = document.querySelector("#fallos");
    const salidaPrecision = document.querySelector("#precision");
    const salidaTiempo = document.querySelector("#tiempo");
    const clasificacion = document.querySelector("#clasificacion");
    const instrucciones = document.querySelector("#instrucciones");

    // La meta permanece igual durante todas las rondas.
    const meta = 10;

    // Tiempo entre actualizaciones del cronómetro visible, en milisegundos.
    const intervaloCronometro = 50;

    // El array almacena un objeto por cada ronda completada.
    // Aunque sea const, podemos añadir elementos y ordenarlos.
    const rondas = [];

    // Usamos let para los valores que cambian durante la partida.
    let aciertos = 0;
    let fallos = 0;
    let enPartida = false;
    let inicioRonda = 0;
    let cronometro = null;

    // Guardamos proporciones del recorrido disponible, no píxeles.
    // Así podemos mantener la posición relativa al redimensionar.
    let proporcionX = 0;
    let proporcionY = 0;

    function calcularPrecision() {
        const disparos = aciertos + fallos;
        // Antes del primer disparo evitamos dividir entre cero.
        if (disparos === 0) {
            return 0;
        }
        // Math.round redondea el porcentaje al entero más cercano.
        return Math.round(aciertos / disparos * 100);
    }

    function actualizarMarcador() {
        // textContent modifica el texto sin interpretarlo como HTML.
        // Los template literals permiten insertar valores con ${...}.
        salidaAciertos.textContent = `${aciertos} / ${meta}`;
        salidaFallos.textContent = fallos;
        salidaPrecision.textContent = `${calcularPrecision()}%`;
    }

    function obtenerTiempo() {
        // Date.now() devuelve una marca de tiempo en milisegundos.
        // Restamos el inicio para conocer la duración de la ronda.
        return Date.now() - inicioRonda;
    }

    function mostrarTiempo(milisegundos) {
        // Dividimos entre 1000 para convertir a segundos.
        // toFixed(2) devuelve el número como texto con dos decimales.
        return `${(milisegundos / 1000).toFixed(2)} s`;
    }

    function actualizarCronometro() {
        salidaTiempo.textContent = mostrarTiempo(obtenerTiempo());
    }

    function posicionarDiana() {
        const anchoCaja = caja.clientWidth;
        const altoCaja = caja.clientHeight;
        const anchoDiana = diana.offsetWidth;
        const altoDiana = diana.offsetHeight;

        // Si algún elemento no tiene tamaño, conservamos las proporciones
        // y esperamos a una próxima llamada con medidas válidas.
        if (
            anchoCaja <= 0 || altoCaja <= 0 ||
            anchoDiana <= 0 || altoDiana <= 0
        ) {
            return;
        }

        // Restamos el tamaño de la diana para que quepa dentro de la caja.
        // Math.max evita coordenadas negativas si la caja es más pequeña.
        // En ese caso se coloca en el origen, aunque no puede caber entera.
        const maxX = Math.max(0, anchoCaja - anchoDiana);
        const maxY = Math.max(0, altoCaja - altoDiana);

        // Convertimos las proporciones guardadas en coordenadas en píxeles.
        diana.style.left = `${proporcionX * maxX}px`;
        diana.style.top = `${proporcionY * maxY}px`;
    }

    function moverDiana() {
        // Math.random() genera un número desde 0 hasta menos de 1.
        // Al multiplicarlo por el recorrido disponible en posicionarDiana(),
        // obtenemos una posición dentro del espacio disponible.
        proporcionX = Math.random();
        proporcionY = Math.random();

        posicionarDiana();
    }

    function comenzarRonda() {
        // Detenemos el cronómetro anterior si se reinicia una ronda.
        // Así evitamos tener varios intervalos funcionando a la vez.
        clearInterval(cronometro);

        aciertos = 0;
        fallos = 0;
        enPartida = true;

        // Mostramos la diana antes de medir su anchura y altura.
        diana.hidden = false;
        moverDiana();
        actualizarMarcador();

        iniciar.textContent = "Reiniciar ronda";
        mensaje.textContent = `Tienes ${meta} disparos. Apunta bien: cada clic cuenta.`;
        salidaTiempo.textContent = "0.00 s";

        inicioRonda = Date.now();

        // Ejecuta la función cada 50 ms para refrescar el tiempo visible.
        // Guardamos su identificador para poder detenerlo.
        cronometro = setInterval(actualizarCronometro, intervaloCronometro);
    }

    function actualizarClasificacion(nuevaRonda) {
        let posicion = 0;

        // Buscamos el primer resultado al que supera la nueva ronda.
        for (const ronda of rondas) {
            const mayorPrecision = nuevaRonda.precision > ronda.precision;

            const empateConMenorTiempo =
                nuevaRonda.precision === ronda.precision &&
                nuevaRonda.tiempo < ronda.tiempo;

            if (mayorPrecision || empateConMenorTiempo) {
                break;
            }

            posicion++;
        }

        // Insertamos sin eliminar ninguna ronda anterior.
        rondas.splice(posicion, 0, nuevaRonda);

        const elemento = document.createElement("li");

        elemento.textContent =
            `Ronda ${nuevaRonda.numero}: ${mostrarTiempo(nuevaRonda.tiempo)} · ` +
            `${nuevaRonda.fallos} fallos · ${nuevaRonda.precision}% de precisión`;

        const siguiente = clasificacion.children[posicion] ?? null;
        clasificacion.insertBefore(elemento, siguiente);
    }

    function terminarRonda() {
        // Medimos al terminar, sin depender del último refresco del cronómetro.
        const tiempoFinal = obtenerTiempo();

        enPartida = false;
        clearInterval(cronometro);
        diana.hidden = true;

        salidaTiempo.textContent = mostrarTiempo(tiempoFinal);
        iniciar.textContent = "Otra ronda";
        mensaje.textContent = `Ronda completada en ${mostrarTiempo(tiempoFinal)}.`;

        // Creamos el resultado y lo pasamos a la clasificación.
        const nuevaRonda = {
            numero: rondas.length + 1,
            tiempo: tiempoFinal,
            fallos: fallos,
            precision: calcularPrecision()
        };

        actualizarClasificacion(nuevaRonda);
    }

    function registrarDisparo(event) {
        // Ignoramos los clics antes de empezar y después de terminar.
        if (!enPartida) {
            return;
        }

        // target identifica el elemento donde se originó el clic.
        // contains reconoce tanto la propia diana como sus posibles hijos.
        const esAcierto = diana.contains(event.target);

        if (esAcierto) {
            aciertos++;
        } else {
            fallos++;
        }

        actualizarMarcador();

        if (aciertos + fallos === meta) {
            terminarRonda();
        } else if (esAcierto) {
            moverDiana();
        }
    }

    // La configuración también determina los textos iniciales de la interfaz.
    instrucciones.textContent =
        `Tienes ${meta} disparos. Consigue la mayor precisión posible.`;

    actualizarMarcador();

    // Pasamos la función sin paréntesis para que se ejecute al hacer clic.
    iniciar.addEventListener("click", comenzarRonda);

    // Delegación: escuchamos en la caja los clics del fondo y de la diana.
    caja.addEventListener("click", registrarDisparo);

    // Bonus de la misión: cambiar de tema mediante una tecla.
    document.addEventListener("keydown", (event) => {
        // repeat evita cambiar de tema muchas veces al mantener N pulsada.
        if ((event.key === "n" || event.key === "N") && !event.repeat) {
            document.body.classList.toggle("oscuro");
        }
    });

    // Si cambia el tamaño de la ventana, conservamos la posición proporcional.
    // El listener permanece conectado para las siguientes rondas,
    // pero solo actualiza la diana mientras hay una partida activa.
    window.addEventListener("resize", () => {
        if (enPartida) {
            posicionarDiana();
        }
    });
}

// Se ejecuta una vez para preparar las variables y conectar los eventos.
prepararJuego();