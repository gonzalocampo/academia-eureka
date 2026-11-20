// ===== Datos curiosos: juntamos todas las listas en un objeto =====
// Así podemos buscar el dato de un número directamente: datosPorNumero[42]
// (typeof ... evita errores si algún archivo de datos no está cargado)
const LISTAS = [
  typeof DATOS_CURIOSOS !== "undefined" ? DATOS_CURIOSOS : [],
  typeof DATOS_CURIOSOS_2 !== "undefined" ? DATOS_CURIOSOS_2 : [],
  typeof DATOS_CURIOSOS_3 !== "undefined" ? DATOS_CURIOSOS_3 : [],
  typeof DATOS_CURIOSOS_4 !== "undefined" ? DATOS_CURIOSOS_4 : [],
  typeof DATOS_CURIOSOS_5 !== "undefined" ? DATOS_CURIOSOS_5 : [],
  typeof DATOS_CURIOSOS_6 !== "undefined" ? DATOS_CURIOSOS_6 : [],
  typeof DATOS_CURIOSOS_7 !== "undefined" ? DATOS_CURIOSOS_7 : [],
  typeof DATOS_CURIOSOS_8 !== "undefined" ? DATOS_CURIOSOS_8 : [],
  typeof DATOS_CURIOSOS_9 !== "undefined" ? DATOS_CURIOSOS_9 : [],
  typeof DATOS_CURIOSOS_10 !== "undefined" ? DATOS_CURIOSOS_10 : [],
];

const datosPorNumero = {};
for (const lista of LISTAS) {
  for (const d of lista) {
    datosPorNumero[d.numero] = d;
  }
}

// ===== Elementos de la página =====
const pantalla = document.getElementById("pantalla");
const lineaOperacion = document.getElementById("operacion");
const cajaDato = document.getElementById("caja-dato");
const datoEtiqueta = document.getElementById("dato-etiqueta");
const datoTexto = document.getElementById("dato-texto");

// ===== Estado de la calculadora =====
let actual = "0";        // número que se está escribiendo
let anterior = null;     // primer número de la operación
let operador = null;     // +, −, ×, ÷
let nuevoNumero = true;  // true = la próxima cifra empieza un número nuevo

// Muestra un número con coma decimal (estilo español)
function formatear(numero) {
  return String(numero).replace(".", ",");
}

function actualizarPantalla() {
  pantalla.textContent = formatear(actual);
  lineaOperacion.textContent = operador !== null ? formatear(anterior) + " " + operador : "";
}

function operar(a, b, op) {
  if (op === "+") return a + b;
  if (op === "−") return a - b;
  if (op === "×") return a * b;
  if (op === "÷") return b === 0 ? NaN : a / b; // dividir entre 0 da error
}

// Si el resultado es un entero del 1 al 5000, buscamos su dato curioso
function mostrarDato(resultado) {
  cajaDato.classList.remove("nuevo");
  void cajaDato.offsetWidth; // reinicia la animación
  cajaDato.classList.add("nuevo");

  if (!Number.isInteger(resultado) || resultado < 1 || resultado > 5000) {
    datoEtiqueta.textContent = "";
    datoTexto.textContent = "Haz una operación cuyo resultado sea un número entero del 1 al 5000.";
    return;
  }

  const dato = datosPorNumero[resultado];
  if (dato) {
    datoEtiqueta.textContent = "#" + dato.numero + " · " + dato.categoria;
    datoTexto.textContent = dato.dato;
  } else {
    datoEtiqueta.textContent = "#" + resultado;
    datoTexto.textContent = "Todavía no tenemos el dato curioso número " + resultado + ". ¡Prueba con otro!";
  }
}

// ===== Acciones de las teclas =====
function pulsarNumero(tecla) {
  if (nuevoNumero) {
    actual = tecla === "." ? "0." : tecla;
    nuevoNumero = false;
  } else if (tecla === ".") {
    if (!actual.includes(".")) actual += ".";
  } else if (actual === "0") {
    actual = tecla;
  } else if (actual.length < 12) {
    actual += tecla;
  }
  actualizarPantalla();
}

function pulsarOperador(op) {
  // Si ya había una operación pendiente (ej. 2 + 3 +), la resolvemos antes
  if (operador !== null && !nuevoNumero) {
    anterior = operar(anterior, parseFloat(actual), operador);
    actual = String(Number(anterior.toFixed(10)));
  } else {
    anterior = parseFloat(actual);
  }
  operador = op;
  nuevoNumero = true;
  actualizarPantalla();
}

function pulsarIgual() {
  if (operador === null) {
    mostrarDato(parseFloat(actual)); // un número suelto también tiene dato
    return;
  }
  const resultado = operar(anterior, parseFloat(actual), operador);
  operador = null;
  anterior = null;
  nuevoNumero = true;

  if (!Number.isFinite(resultado)) {
    actual = "0";
    lineaOperacion.textContent = "";
    pantalla.textContent = "Error";
    datoEtiqueta.textContent = "";
    datoTexto.textContent = "No se puede dividir entre 0.";
    return;
  }
  actual = String(Number(resultado.toFixed(10))); // evita 0.1 + 0.2 = 0.30000000000000004
  actualizarPantalla();
  mostrarDato(parseFloat(actual));
}

function limpiar() {
  actual = "0";
  anterior = null;
  operador = null;
  nuevoNumero = true;
  actualizarPantalla();
}

function borrar() {
  if (nuevoNumero) return;
  actual = actual.length > 1 ? actual.slice(0, -1) : "0";
  actualizarPantalla();
}

// ===== Un solo evento para todos los botones =====
const botones = document.querySelectorAll(".tecla");
for (const boton of botones) {
  boton.addEventListener("click", function () {
    const tipo = boton.dataset.tipo; // lee data-tipo del HTML
    const texto = boton.textContent;
    if (tipo === "num") pulsarNumero(texto);
    else if (tipo === "op") pulsarOperador(texto);
    else if (tipo === "igual") pulsarIgual();
    else if (tipo === "limpiar") limpiar();
    else if (tipo === "borrar") borrar();
  });
}
