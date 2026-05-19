const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");
const TAMANIO_CELDA = 25;

let puntos = 0;
let monedas = 0;
let monedasMapa = [];
let tiempoMoneda = null;
let direccionBloqueada = false;
let serpiente = [
  { x: 8, y: 10 }
];

let direccionActual = "derecha";
let intervaloSerpiente;
let comio = false;
let velocidad = 250;
let gameOver = false;
let comida = {
  x: 0,
  y: 0
};

// =========================
// INICIALIZACIÓN
// =========================

generarComida();
programarMoneda();
dibujarTodo();

// =========================
// FUNCIONES DE DIBUJO
// =========================
function limpiarCanvas() {
  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );
}

function dibujarTablero() {
  ctx.strokeStyle = "#ffffff22";

  for (let x = 0; x <= canvas.width; x += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += TAMANIO_CELDA) {

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function pintarParte(lineaX, lineaY, color) {

  const posicionRealX =
    lineaX * TAMANIO_CELDA;
  const posicionRealY =
    lineaY * TAMANIO_CELDA;
  ctx.fillStyle = color;
  ctx.fillRect(
    posicionRealX,
    posicionRealY,
    TAMANIO_CELDA,
    TAMANIO_CELDA
  );

  ctx.strokeStyle = "black";
  ctx.strokeRect(
    posicionRealX,
    posicionRealY,
    TAMANIO_CELDA,
    TAMANIO_CELDA
  );
}

function dibujarTodo() {
  limpiarCanvas();
  dibujarTablero();
  pintarComida();
  pintarMoneda();
  pintarSerpiente();
}

function pintarSerpiente() {
  for (let i = 0; i < serpiente.length; i++) {
    const parte = serpiente[i];
    if (i === 0) {
      pintarParte(
        parte.x,
        parte.y,
        "yellow"
      );
    } else {
      pintarParte(
        parte.x,
        parte.y,
        "red"
      );
    }
  }
}

function pintarComida() {
  pintarParte(
    comida.x,
    comida.y,
    "lime"
  );
}

function pintarMoneda() {
  for (let i = 0; i < monedasMapa.length; i++) {
    pintarParte(
      monedasMapa[i].x,
      monedasMapa[i].y,
      monedasMapa[i].color
    );
  }
}

// =========================
// MONEDAS
// =========================

function atraparMoneda() {
  const cabeza = serpiente[0];
  for (let i = 0; i < monedasMapa.length; i++) {
    if (
      cabeza.x === monedasMapa[i].x &&
      cabeza.y === monedasMapa[i].y
    ) {

      monedas += monedasMapa[i].valor;
      document.getElementById("monedas")
        .innerText = monedas;
      monedasMapa.splice(i, 1);
      programarMoneda();
      break;
    }
  }
}

function generarMoneda() {
  const columnas =
    canvas.width / TAMANIO_CELDA;
  const filas =
    canvas.height / TAMANIO_CELDA;
  let color;
  let valor;
  const probabilidad =
    Math.random() * 100;
  if (probabilidad < 80) {
    color = "gold";
    valor = 5;
  } else if (probabilidad < 95) {
    color = "orange";
    valor = 10;
  } else {
    color = "purple";
    valor = 15;
  }

  let posicionValida = false;
  let x;
  let y;
  while (posicionValida === false) {
    x = Math.floor(
      Math.random() * columnas
    );
    y = Math.floor(
      Math.random() * filas
    );
    posicionValida = true;

    // Validar serpiente
    for (let i = 0; i < serpiente.length; i++) {
      if (
        serpiente[i].x === x &&
        serpiente[i].y === y
      ) {
        posicionValida = false;
      }
    }

    // Validar comida
    if (
      comida.x === x &&
      comida.y === y
    ) {
      posicionValida = false;
    }

    // Validar monedas
    for (let i = 0; i < monedasMapa.length; i++) {
      if (
        monedasMapa[i].x === x &&
        monedasMapa[i].y === y
      ) {
        posicionValida = false;
      }
    }
  }

  monedasMapa.push({
    x: x,
    y: y,
    color: color,
    valor: valor
  });
}

function programarMoneda() {
  clearTimeout(tiempoMoneda);
  const tiempoAleatorio =
    Math.floor(Math.random() * 30000) + 1000;
  tiempoMoneda = setTimeout(function () {
    if (gameOver === false) {
      generarMoneda();
      dibujarTodo();
    }
  }, tiempoAleatorio);
}

// =========================
// COMIDA
// =========================

function atraparComida() {
  const cabeza = serpiente[0];
  if (
    cabeza.x === comida.x &&
    cabeza.y === comida.y
  ) {
    return true;
  }
  return false;
}

function generarComida() {
  const columnas =
    canvas.width / TAMANIO_CELDA;
  const filas =
    canvas.height / TAMANIO_CELDA;
  let posicionValida = false;
  while (posicionValida === false) {
    comida.x = Math.floor(
      Math.random() * columnas
    );
    comida.y = Math.floor(
      Math.random() * filas
    );
    posicionValida = true;

    // Validar serpiente
    for (let i = 0; i < serpiente.length; i++) {

      if (
        comida.x === serpiente[i].x &&
        comida.y === serpiente[i].y
      ) {

        posicionValida = false;
      }
    }

    // Validar monedas
    for (let i = 0; i < monedasMapa.length; i++) {

      if (
        comida.x === monedasMapa[i].x &&
        comida.y === monedasMapa[i].y
      ) {
        posicionValida = false;
      }
    }
  }
}

// =========================
// MOVIMIENTO
// =========================

function moverSerpienteDireccion(x, y) {

  const cabezaActual = serpiente[0];
  const nuevaCabeza = {
    x: cabezaActual.x + x,
    y: cabezaActual.y + y
  };
  serpiente.unshift(nuevaCabeza);
  if (comio === false) {
    serpiente.pop();
  }
}

function cambiarDireccion(direccion) {
  if (direccionBloqueada) {
    return;
  }
  if (direccionActual === "derecha" &&
    direccion === "izquierda"
  ) {
    return;
  }
  if (direccionActual === "izquierda" &&
    direccion === "derecha"
  ) {
    return;
  }
  if (direccionActual === "arriba" &&
    direccion === "abajo"
  ) {
    return;
  }
  if (direccionActual === "abajo" &&
    direccion === "arriba"
  ) {
    return;
  }

  direccionActual = direccion;
  direccionBloqueada = true;
}

function moverSerpiente() {

  if (direccionActual === "derecha") {
    moverSerpienteDireccion(1, 0);
  } else if (direccionActual === "izquierda") {
    moverSerpienteDireccion(-1, 0);
  } else if (direccionActual === "arriba") {
    moverSerpienteDireccion(0, -1);
  } else if (direccionActual === "abajo") {
    moverSerpienteDireccion(0, 1);
  }
  // Comer comida
  if (atraparComida()) {

    puntos++;

    document.getElementById("puntaje")
      .innerText = puntos;

    comio = true;

    generarComida();

    if (serpiente.length === 400) {

      alert("Ganaste");

      document.getElementById("estado")
        .innerText = "Ganaste";

      gameOver = true;
    }

    // Aumentar velocidad
    if (velocidad > 60) {
      velocidad -= 10;
    }

    clearInterval(intervaloSerpiente);

    iniciarJuego();

  } else {

    comio = false;
  }

  // Monedas
  atraparMoneda();

  // Colisión borde
  if (verificarBorde()) {

    clearInterval(intervaloSerpiente);

    document.getElementById("estado")
      .innerText = "Game Over";

    gameOver = true;
  }

  // Colisión cuerpo
  if (colisionCuerpo()) {

    clearInterval(intervaloSerpiente);

    document.getElementById("estado")
      .innerText = "Game Over";

    gameOver = true;
  }

  dibujarTodo();

  direccionBloqueada = false;
}

// =========================
// VALIDACIONES
// =========================

function verificarBorde() {

  const cabeza = serpiente[0];

  const totalColumnas =
    canvas.width / TAMANIO_CELDA;

  const totalFilas =
    canvas.height / TAMANIO_CELDA;
  if (cabeza.x < 0) {
    return true;
  }
  if (cabeza.x >= totalColumnas) {
    return true;
  }
  if (cabeza.y < 0) {
    return true;
  }
  if (cabeza.y >= totalFilas) {
    return true;
  }
  return false;
}

function colisionCuerpo() {
  const cabeza = serpiente[0];
  for (let i = 1; i < serpiente.length; i++) {
    if (
      cabeza.x === serpiente[i].x &&
      cabeza.y === serpiente[i].y
    ) {
      return true;
    }
  }
  return false;
}

// =========================
// TECLADO
// =========================

document.addEventListener(
  "keydown",
  function (event) {
    if (
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight"
    ) {
      event.preventDefault();
    }
    if (event.key === "ArrowUp") {
      cambiarDireccion("arriba");
    } else if (event.key === "ArrowDown") {
      cambiarDireccion("abajo");
    } else if (event.key === "ArrowLeft") {
      cambiarDireccion("izquierda");
    } else if (event.key === "ArrowRight") {
      cambiarDireccion("derecha");
    }
  }
);

// =========================
// CONTROLES
// =========================

function iniciarJuego() {

  if (gameOver === true) {
    return;
  }
  document.getElementById("estado")
    .innerText = "Jugando";
  clearInterval(intervaloSerpiente);
  intervaloSerpiente =
    setInterval(
      moverSerpiente,
      velocidad
    );
}

function pausarJuego() {
  clearInterval(intervaloSerpiente);
  document.getElementById("estado")
    .innerText = "Pausado";
}

function reiniciarJuego() {
  clearInterval(intervaloSerpiente);
  puntos = 0;
  monedas = 0;
  velocidad = 300;
  monedasMapa = [];
  document.getElementById("puntaje")
    .innerText = puntos;
  document.getElementById("monedas")
    .innerText = monedas;
  document.getElementById("estado")
    .innerText = "Listo";

  serpiente = [
    { x: 8, y: 10 }
  ];

  direccionActual = "derecha";
  gameOver = false;
  generarComida();
  clearTimeout(tiempoMoneda);
  programarMoneda();
  dibujarTodo();
}