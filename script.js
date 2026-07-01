const experiencias = [
    { id: 1, nombre: "Pesca con Mosca en Río Simpson", categoria: "pesca", lugar: "Coyhaique", precio: 85000, cuposDisponibles: 8, descripcion: "Una experiencia única de pesca con mosca en las cristalinas aguas del Río Simpson.", icono: "🎣" },
    { id: 2, nombre: "Trekking Cerro Castillo", categoria: "trekking", lugar: "Coyhaique", precio: 65000, cuposDisponibles: 12, descripcion: "Ascenso moderado al imponente Cerro Castillo con vistas panorámicas.", icono: "🥾" },
    { id: 3, nombre: "Navegación a Capillas de Mármol", categoria: "navegacion", lugar: "Puerto Río Tranquilo", precio: 95000, cuposDisponibles: 10, descripcion: "Recorrido por las impresionantes formaciones de mármol en el Lago General Carrera.", icono: "⛵" },
    { id: 4, nombre: "Kayak en Fiordos de Aysén", categoria: "navegacion", lugar: "Puerto Aysén", precio: 75000, cuposDisponibles: 6, descripcion: "Explora los fiordos patagónicos en kayak.", icono: "🛶" },
    { id: 5, nombre: "Cultura y Tradiciones en Chile Chico", categoria: "cultura", lugar: "Chile Chico", precio: 45000, cuposDisponibles: 15, descripcion: "Recorrido por tradiciones locales y encuentro con artesanos.", icono: "🏔️" },
    { id: 6, nombre: "Navegación Laguna San Rafael", categoria: "navegacion", lugar: "Puerto Aysén", precio: 125000, cuposDisponibles: 8, descripcion: "Viaje hacia el Glaciar San Rafael.", icono: "🌊" },
    { id: 7, nombre: "Pesca en Lago Cochrane", categoria: "pesca", lugar: "Cochrane", precio: 92000, cuposDisponibles: 7, descripcion: "Pesca deportiva en el Lago Cochrane con prácticas sostenibles.", icono: "🐟" }
];

const experienciasContainer = document.getElementById('experiencias');
const filtroBtns = document.querySelectorAll('.filter-btn');
const selectExperiencia = document.getElementById('experiencia');
const form = document.getElementById('reserva-form');
const mensajeReserva = document.getElementById('mensaje-reserva');

function renderExperiencias(lista) {
    experienciasContainer.innerHTML = '';
    lista.forEach(exp => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-icon">${exp.icono}</div>
            <div class="card-content">
                <h3>${exp.nombre}</h3>
                <div class="meta">
                    <span>${exp.lugar}</span>
                    <span class="categoria">${exp.categoria.toUpperCase()}</span>
                </div>
                <div class="precio">$${exp.precio.toLocaleString('es-CL')}</div>
                <div class="cupos">Cupos disponibles: <strong>${exp.cuposDisponibles}</strong></div>
                <div class="descripcion" id="desc-${exp.id}">
                    <p>${exp.descripcion}</p>
                </div>
                <button class="btn-toggle" data-id="${exp.id}">Ver más</button>
            </div>
        `;
        experienciasContainer.appendChild(card);

        card.querySelector('.btn-toggle').addEventListener('click', function() {
            const desc = document.getElementById(`desc-${exp.id}`);
            desc.classList.toggle('show');
            this.textContent = desc.classList.contains('show') ? 'Ver menos' : 'Ver más';
        });
    });
}

function filtrarPorCategoria(categoria) {
    const listaFiltrada = categoria === 'todos' ? experiencias : experiencias.filter(exp => exp.categoria === categoria);
    renderExperiencias(listaFiltrada);
}

function poblarSelectExperiencias() {
    selectExperiencia.innerHTML = '<option value="">Selecciona una experiencia</option>';
    experiencias.forEach(exp => {
        const option = document.createElement('option');
        option.value = exp.id;
        option.textContent = `${exp.nombre} - $${exp.precio.toLocaleString('es-CL')}`;
        selectExperiencia.appendChild(option);
    });
}

function esEmailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function mostrarError(campoId, mensaje) {
    const errorElement = document.getElementById(`error-${campoId}`);
    if (errorElement) errorElement.textContent = mensaje;
}

function limpiarErrores() {
    document.querySelectorAll('.error').forEach(err => err.textContent = '');
    mensajeReserva.textContent = '';
    mensajeReserva.className = 'mensaje';
}

function descontarCupo(id, cantidad) {
    const exp = experiencias.find(e => e.id === parseInt(id));
    if (exp) exp.cuposDisponibles = Math.max(0, exp.cuposDisponibles - cantidad);
}

function validarFormulario(e) {
    e.preventDefault();
    limpiarErrores();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const expId = document.getElementById('experiencia').value;
    const personas = parseInt(document.getElementById('personas').value);
    const fecha = document.getElementById('fecha').value;

    let valido = true;

    if (!nombre) { mostrarError('nombre', 'El nombre es obligatorio'); valido = false; }
    if (!email) { mostrarError('email', 'El email es obligatorio'); valido = false; }
    else if (!esEmailValido(email)) { mostrarError('email', 'Email inválido'); valido = false; }
    if (!expId) { mostrarError('experiencia', 'Selecciona una experiencia'); valido = false; }
    if (!personas || personas < 1) { mostrarError('personas', 'Número mínimo: 1'); valido = false; }
    else {
        const exp = experiencias.find(e => e.id === parseInt(expId));
        if (exp && personas > exp.cuposDisponibles) {
            mostrarError('personas', `Solo quedan ${exp.cuposDisponibles} cupos`);
            valido = false;
        }
    }
    if (!fecha) { mostrarError('fecha', 'La fecha es obligatoria'); valido = false; }

    if (valido) {
        descontarCupo(expId, personas);
        mensajeReserva.textContent = `¡Reserva confirmada! Cupos actualizados.`;
        mensajeReserva.className = 'mensaje success';
        form.reset();

        const categoriaActiva = document.querySelector('.filter-btn.active').dataset.category;
        filtrarPorCategoria(categoriaActiva);
        poblarSelectExperiencias();
    }
}

function inicializar() {
    renderExperiencias(experiencias);
    poblarSelectExperiencias();

    filtroBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filtroBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtrarPorCategoria(btn.dataset.category);
        });
    });

    form.addEventListener('submit', validarFormulario);
}

document.addEventListener('DOMContentLoaded', inicializar);