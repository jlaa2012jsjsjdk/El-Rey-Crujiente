// Referencias a elementos del DOM
// No necesitamos 'productosGrid' para renderizar, ya que los productos están en el HTML
const carritoItemsContainer = document.getElementById('carrito-items');
const carritoTotalSpan = document.getElementById('carrito-total');
const procederPagoBtn = document.getElementById('proceder-pago');
const carritoVacioMensaje = document.getElementById('carrito-vacio-mensaje');

let carrito = []; // Array para almacenar los productos en el carrito

// --- Funciones del Carrito ---

// Carga el carrito desde localStorage al iniciar la página
function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('elReyCrujienteCarrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarritoUI();
    }
}

// Guarda el carrito en localStorage
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('elReyCrujienteCarrito', JSON.stringify(carrito));
}

// Agrega un producto al carrito
function agregarProductoAlCarrito(event) {
    // Obtenemos los datos del producto directamente de los atributos 'data-' del botón
    const productId = event.target.dataset.id;
    const productName = event.target.dataset.nombre;
    // Obtener el precio del span con data-price dentro del mismo .menu-item
    const productPrice = parseFloat(event.target.closest('.menu-item').querySelector('.price').dataset.price);
    const productImage = event.target.dataset.imagen;

    const productoExistente = carrito.find(item => item.id === productId);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            id: productId,
            nombre: productName,
            precio: productPrice,
            imagen: productImage,
            cantidad: 1
        });
    }
    guardarCarritoEnLocalStorage();
    actualizarCarritoUI();
}

// Elimina un producto del carrito
function eliminarProductoDelCarrito(productId) {
    carrito = carrito.filter(item => item.id !== productId);
    guardarCarritoEnLocalStorage();
    actualizarCarritoUI();
}

// Actualiza la cantidad de un producto en el carrito
function actualizarCantidadProducto(productId, newQuantity) {
    const item = carrito.find(item => item.id === productId);
    if (item) {
        item.cantidad = parseInt(newQuantity);
        if (item.cantidad <= 0) { // Si la cantidad es 0 o menos, eliminar
            eliminarProductoDelCarrito(productId);
        } else {
            guardarCarritoEnLocalStorage();
            actualizarCarritoUI();
        }
    }
}

// Actualiza la interfaz de usuario del carrito
function actualizarCarritoUI() {
    carritoItemsContainer.innerHTML = ''; // Limpiar el contenido actual del carrito
    let total = 0;

    if (carrito.length === 0) {
        carritoVacioMensaje.style.display = 'block'; // Mostrar mensaje de carrito vacío
        procederPagoBtn.disabled = true; // Deshabilitar botón de pago
    } else {
        carritoVacioMensaje.style.display = 'none'; // Ocultar mensaje
        procederPagoBtn.disabled = false; // Habilitar botón de pago
        carrito.forEach(item => {
            const itemTotal = item.precio * item.cantidad;
            total += itemTotal;

            const carritoItemDiv = document.createElement('div');
            carritoItemDiv.classList.add('carrito-item');
            carritoItemDiv.innerHTML = `
                <div class="carrito-item-info">
                    <h4>${item.nombre}</h4>
                    <p>$${item.precio.toFixed(2)} c/u</p>
                </div>
                <div class="carrito-item-controls">
                    <input type="number" min="1" value="${item.cantidad}" data-id="${item.id}" class="cantidad-input">
                    <button class="eliminar-del-carrito" data-id="${item.id}">Eliminar</button>
                </div>
            `;
            carritoItemsContainer.appendChild(carritoItemDiv);
        });

        // Añadir event listeners dinámicamente a los botones de eliminar y los inputs de cantidad
        document.querySelectorAll('.eliminar-del-carrito').forEach(button => {
            button.addEventListener('click', (event) => {
                eliminarProductoDelCarrito(event.target.dataset.id);
            });
        });

        document.querySelectorAll('.cantidad-input').forEach(input => {
            input.addEventListener('change', (event) => {
                actualizarCantidadProducto(event.target.dataset.id, event.target.value);
            });
        });
    }

    carritoTotalSpan.textContent = total.toFixed(2);
}

// --- Lógica de Pago (Redirección a PayPal) ---

procederPagoBtn.addEventListener('click', () => {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de proceder al pago.');
        return;
    }

    const totalPagar = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    // Generar una descripción concisa para PayPal
    const descripcionPedido = carrito.map(item => `${item.cantidad}x ${item.nombre}`).join(', ');

    // --- ¡IMPORTANTE! Reemplaza este email con tu email real de PayPal Business ---
    const paypalBusinessEmail = 'tu-email-de-paypal-business@ejemplo.com'; // <--- ¡CAMBIA ESTO!

    if (paypalBusinessEmail === 'tu-email-de-paypal-business@ejemplo.com') {
        alert('ADVERTENCIA: Por favor, configura tu email de PayPal Business en js/script.js antes de usar la función de pago. El botón de pago no funcionará.');
        console.error('Email de PayPal no configurado. Por favor, edita js/script.js');
        return;
    }

    // Construye el URL de pago de PayPal
    // cmd=_xclick es para "comprar ahora"
    // business es tu email de vendedor
    // item_name es la descripción del producto
    // amount es el monto
    // currency_code es la moneda (MXN para Pesos Mexicanos)
    const paypalURL = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(paypalBusinessEmail)}&item_name=${encodeURIComponent(descripcionPedido)}&amount=${totalPagar.toFixed(2)}&currency_code=MXN`;

    // Abre una nueva pestaña/ventana para la pasarela de pago
    window.open(paypalURL, '_blank');

    // Limpiar el carrito después de redirigir (esto es opcional, puedes comentarlo si prefieres que el carrito no se vacíe inmediatamente)
    carrito = [];
    guardarCarritoEnLocalStorage();
    actualizarCarritoUI();
    alert('Serás redirigido a PayPal para completar tu compra. Una vez finalices, podrás regresar a esta página.');
});

// --- Inicialización: Se ejecuta cuando todo el DOM ha cargado ---
document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDesdeLocalStorage(); // Intenta cargar un carrito guardado al inicio

    // Asigna event listeners a todos los botones "Agregar al Carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', agregarProductoAlCarrito);
    });
});
