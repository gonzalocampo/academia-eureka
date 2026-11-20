// ===== 1. Menú generado desde un array de objetos =====
const MENU = [
	{ texto: "Inicio", enlace: "/academia/index.html" },
	{ texto: "Programas", enlace: "/academia/pages/programas.html" },
	{ texto: "Calculadora", enlace: "/academia/pages/calculadora.html" },
	{ texto: "Contacto", enlace: "/academia/pages/contacto.html" },
];

const menu = document.getElementById("menu");
const paginaActual = location.pathname.split("/").pop() || "index.html";

for (const item of MENU) {
	const li = document.createElement("li");
	const a = document.createElement("a");
	a.textContent = item.texto;
	a.href = item.enlace;
	if (item.enlace === paginaActual) {
		a.classList.add("activo"); // marca la página donde estamos
	}
	li.appendChild(a);
	menu.appendChild(li);
}

// ===== 2. Modo claro / oscuro (se recuerda entre páginas) =====
const botonModo = document.getElementById("btn-modo");

function actualizarTextoBoton() {
	botonModo.textContent = document.body.classList.contains("oscuro") ? "☀️ Modo claro" : "🌙 Modo oscuro";
}

if (localStorage.getItem("modo") === "oscuro") {
	document.body.classList.add("oscuro");
}
actualizarTextoBoton();

botonModo.addEventListener("click", function () {
	document.body.classList.toggle("oscuro");
	localStorage.setItem("modo", document.body.classList.contains("oscuro") ? "oscuro" : "claro");
	actualizarTextoBoton();
});

// ===== 3. Formulario de contacto (solo existe en contacto.html) =====
const formulario = document.getElementById("formulario");

if (formulario) {
	const mensaje = document.getElementById("mensaje");
	const contador = document.getElementById("contador");

	// Contador de caracteres del mensaje
	mensaje.addEventListener("input", function () {
		contador.textContent = mensaje.value.length + " / 300";
	});

	// Escribe (o borra) el error de un campo
	function poner_error(id, texto) {
		document.getElementById("error-" + id).textContent = texto;
		const campo = document.getElementById(id);
		if (campo.type !== "checkbox") {
			campo.classList.toggle("campo-mal", texto !== "");
		}
		return texto === ""; // true si no hay error
	}

	formulario.addEventListener("submit", function (evento) {
		evento.preventDefault(); // evita que la página se recargue

		const nombre = document.getElementById("nombre").value.trim();
		const email = document.getElementById("email").value.trim();
		const telefono = document.getElementById("telefono").value.replace(/\s/g, ""); // quita espacios
		const motivo = document.getElementById("motivo").value;
		const texto = mensaje.value.trim();
		const acepto = document.getElementById("acepto").checked;

		// Expresiones regulares
		const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
		const regexTelefono = /^(\+34)?[6789]\d{8}$/; // móvil o fijo español

		// Cada validación devuelve true (bien) o false (mal)
		const resultados = [
			poner_error("nombre", nombre === "" ? "Escribe tu nombre." : ""),
			poner_error("email", regexEmail.test(email) ? "" : "Escribe un email válido."),
			poner_error("telefono", regexTelefono.test(telefono) ? "" : "Teléfono no válido (9 cifras, ej. 612345678)."),
			poner_error("motivo", motivo === "" ? "Elige un motivo." : ""),
			poner_error("mensaje", texto.length < 20 ? "El mensaje debe tener al menos 20 caracteres." : ""),
			poner_error("acepto", acepto ? "" : "Debes aceptar la política de privacidad."),
		];

		const resultado = document.getElementById("resultado");
		if (resultados.includes(false)) {
			resultado.textContent = "Revisa los campos marcados.";
			resultado.className = "resultado";
		} else {
			resultado.textContent = "✅ ¡Gracias, " + nombre + "! Hemos recibido tu mensaje.";
			resultado.className = "resultado ok";
			formulario.reset();
			contador.textContent = "0 / 300";
		}
	});
}
